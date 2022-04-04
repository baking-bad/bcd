import Vue from 'vue'
import Clipboard from 'v-clipboard'
import App from './App.vue'

import './styles';

import store from '@/store'
import router from '@/router'

import VueGtag from "vue-gtag";

import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";

import { shortcut, formatDatetime, formatDate, plural, urlExtractBase58, checkAddress, round } from "@/utils/tz.js";
import { BetterCallApi } from "@/api/bcd.js";
import { NodeRPC } from "@/api/rpc.js";

import { makeVuetify } from '@/plugins/vuetify';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import { fixNavigationCurrentLocationProblem } from '@/setups/router';

fixNavigationCurrentLocationProblem();

import VJsf from '@baking-bad/vjsf/lib/VJsf.js';
import '@baking-bad/vjsf/lib/VJsf.css';

import draggable from 'vuedraggable';
import {roundDownSignificantDigits, SIFormatter} from "./utils/number";
Vue.component('draggable', draggable);
Vue.component('VJsf', VJsf)

Vue.config.productionTip = false;

dayjs.extend(relativeTime);
dayjs.extend(utc);

Vue.use(Clipboard);

Vue.filter('numberToCompactSIFormat', function (value) {
  return SIFormatter.format(roundDownSignificantDigits(Number(value)));
});

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
});

Vue.filter('snakeToCamel', (str) => {
  if (!(/[_-]/).test(str)) return str;

  return str.toLowerCase()
                          .replace(/([-_])([a-z])/g, (_match, _p1, p2) => p2.toUpperCase());
});

let config = {
  API_URI: process.env.VUE_APP_API_URI || `${window.location.protocol}//${window.location.host}/v1`,
  HOME_PAGE: 'home'
}

let api = new BetterCallApi(config.API_URI);

api.getConfig().then(response => {
  Object.assign(config, response);

  config.rpc_endpoints = Object.fromEntries(
    Object.entries(config.rpc_endpoints)
      .map(([k, v]) => [k, v.replace('sandbox', '127.0.0.1')])
  );

  let rpc = new NodeRPC(config.rpc_endpoints);
  let helpers = { shortcut, formatDatetime, formatDate, plural, checkAddress, round }

  Vue.mixin({
    data() {
      return { config, api, rpc, helpers }
    }
  });

  if (process.env.NODE_ENV !== "development" && config.sentry_dsn !== "") {
    Sentry.init({
      dsn: config.sentry_dsn,
      ignoreErrors: [
        "Don't have an RPC endpoint"
      ],
      attachStacktrace: true,
      integrations: [new VueIntegration({
        Vue,
        attachProps: true,
        tracing: true,
        tracingOptions: {
          trackComponents: true,
        },
      })],
    });
  }

  router.addRoutes([
    {
      path: '/@:slug([a-zA-Z0-9_.:-]*)',
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

  if (config.GA_ENABLED || config.ga_enabled) {
    Vue.use(VueGtag, {
      pageTrackerUseFullPath: true,
      config: {
        id: "UA-160856677-1",
      }
    }, router);
  }

  const isDark = localStorage.getItem('dark') ? JSON.parse(localStorage.getItem('dark')) : true;
  if (isDark) {
    document.body.classList.add('dark-theme-background');
  }

  let vuetify = makeVuetify(isDark);

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app');
});
