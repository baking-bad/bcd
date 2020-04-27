import Vue from 'vue'
import Clipboard from 'v-clipboard'
import App from './App.vue'

import store from './store'
import router from './router'
import VueAnalytics from 'vue-analytics'

import { getJwt, logout } from "@/utils/auth.js";
import { BetterCallApi, UnauthorizedError } from "@/api/index.js"
import { NodeRPC } from "@/api/node.js"

import '@mdi/font/css/materialdesignicons.css';
import vuetify from './plugins/vuetify';

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
  const runtimeConfig = await fetch('/config.json');
  return await runtimeConfig.json();
}

getRuntimeConfig().then(function(config) {
  // config.API_URI = process.env.VUE_APP_API_URI || config.API_URI;
  // config.GA_ENABLED = process.env.VUE_APP_GA_ENABLED || config.GA_ENABLED;
  // config.OAUTH_ENABLED = process.env.VUE_APP_OAUTH_ENABLED || config.OAUTH_ENABLED;

  let api = new BetterCallApi(config.API_URI);
  let rpc = new NodeRPC(config.RPC_ENDPOINTS)

  Vue.mixin({
    data() { return {config, api, rpc} }
  });

  router.beforeEach((to, from, next) => {
    const privatePages = ['/dashboard', '/dashboard/'];
    const authRequired = privatePages.includes(to.path);
    const loggedIn = getJwt() !== null;

    store.dispatch('setIsAuthorized', loggedIn)
    if (authRequired && !loggedIn) {
      return next('/');
    }

    if (loggedIn && store.state.profile === null) {
      api.getProfile()
        .then(res => {
          store.dispatch('setProfile', res);
        })
        .catch(err => {
          if (err instanceof UnauthorizedError) {
            store.dispatch('setIsAuthorized', false);
            store.dispatch('setProfile', null);
            store.dispatch('showError', 'Unauthorized access. Please login');
            logout();
          } else {
            store.dispatch('showError', err);
          }
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

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')
})