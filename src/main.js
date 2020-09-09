import Vue from 'vue'
import Clipboard from 'v-clipboard'
import App from './App.vue'

import store from '@/store'
import router from '@/router'
import VueAnalytics from 'vue-analytics'

import { shortcut, formatDatetime, formatDate, plural, urlExtractBase58, checkAddress } from "@/utils/tz.js";
import { getJwt, logout, getBool } from "@/utils/auth.js";
import { BetterCallApi, UnauthorizedError } from "@/api/bcd.js"
import { NodeRPC } from "@/api/rpc.js"
import { TzKTApi } from "@/api/tzkt.js"
import { BcdWs } from "@/api/ws.js";

import '@mdi/font/css/materialdesignicons.css';
import { makeVuetify } from '@/plugins/vuetify';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';


import VJsf from '@koumoul/vjsf/lib/VJsf.js'
import '@koumoul/vjsf/lib/VJsf.css'

import draggable from 'vuedraggable';
Vue.component('draggable', draggable);
Vue.component('VJsf', VJsf)

Vue.config.productionTip = false;

dayjs.extend(relativeTime);
dayjs.extend(utc);

Vue.use(Clipboard)

Vue.filter('formatDate', function (value) {
  if (value) {
    return dayjs(value).format('D MMMM YYYY');
  }
})

Vue.filter('formatTime', function (value) {
  if (value) {
    return dayjs(value).format('D MMMM YYYY HH:mm');
  }
})


Vue.filter('formatShortTime', function (value) {
  if (value) {
    return dayjs(value).format('D MMM YYYY HH:mm');
  }
})

Vue.filter('fromNow', function (value) {
  if (value) {
    return dayjs(value).fromNow();
  }
})

Vue.filter('uxtz', function (value) {
  let xtz = (value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 6 });
  return `${xtz} \uA729`;
})

Vue.filter('mutez', function (value) {
  let xtz = (value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 6 });
  return `${xtz}`;
})

Vue.filter('bytes', function (value) {
  return `${value} bytes`;
})

const getRuntimeConfig = async () => {
  const runtimeConfig = await fetch(process.env.VUE_APP_CONFIG_PATH || '/config.json');
  return await runtimeConfig.json();
}

getRuntimeConfig().then(function (config) {
  let api = new BetterCallApi(config.API_URI);
  let rpc = new NodeRPC(config.RPC_ENDPOINTS);
  let tzkt = new TzKTApi(config.TZKT_ENDPOINTS);
  let ws = new BcdWs(config.WS_URI);
  
  let helpers = { shortcut, formatDatetime, formatDate, plural, checkAddress }

  Vue.mixin({
    data() {
      return { config, api, rpc, tzkt, ws, helpers }
    }
  });

  router.addRoutes([
    {
      path: '/@:slug([a-zA-Z0-9_]*)',
      name: 'slug',
      beforeEnter: async function (to, from, next) {
        return await api.getContractBySlug(to.params.slug)
          .then(res => next(`/${res.network}/${res.address}`))
          .catch(() => next(`/search?text=${to.params.slug}`))
      }
    },
    {
      path: '*',
      redirect: to => {
        const text = urlExtractBase58(to.path) || to.path.split('/').join(' ');
        return { name: 'search', query: { text } };
      }
    }
  ]);

  router.beforeEach((to, from, next) => {
    const privatePages = ['/dashboard', '/dashboard/'];
    const authRequired = privatePages.includes(to.path);
    const loggedIn = config.SINGLE_USER_MODE || getJwt() !== null;

    store.dispatch('setIsAuthorized', loggedIn)
    if (authRequired && !loggedIn) {
      return next('/');
    }

    if (loggedIn && store.state.profile === null) {
      api.getProfile()
        .then(res => {
          let subs = res.subscriptions;
          delete res['subscriptions'];
          store.dispatch('setProfile', res);
          store.dispatch('setSubscriptions', subs);
        })
        .catch(err => {
          if (err instanceof UnauthorizedError) {
            store.dispatch('setIsAuthorized', false);
            store.dispatch('setProfile', null);
            store.dispatch('showError', 'Unauthorized access. Please sign in');
          } else {
            store.dispatch('showError', err);
          }
          logout();
          // eslint-disable-next-line
          console.log(err)
        });
    }

    next();
  })

  if (config.GA_ENABLED) {
    Vue.use(VueAnalytics, {
      id: "UA-160856677-1",
      router,
      autoTracking: {
        pageviewTemplate(route) {
          return {
            page: route.name,
            title: document.title,
            location: window.location.href
          }
        }
      },
      debug: {
        enabled: false,
        sendHitTask: true
      }
    });
  }

  let vuetify = makeVuetify(getBool('dark', true));

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app');
})