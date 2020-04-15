import Vue from 'vue'
import Clipboard from 'v-clipboard'
import App from './App.vue'

import store from './store'
import router from './router'
import VueAnalytics from 'vue-analytics'

import { UnauthorizedError, getProfile } from "@/api/profile.js";
import { getJwt, logout } from "@/utils/auth.js";

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

router.beforeEach((to, from, next) => {
  const privatePages = ['/dashboard', '/dashboard/'];
  const authRequired = privatePages.includes(to.path);
  const loggedIn = getJwt() !== null;

  store.dispatch('setIsAuthorized', loggedIn)
  if (authRequired && !loggedIn) {
    return next('/');
  }

  if (loggedIn && store.state.profile === null) {
    getProfile()
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

if (process.env.NODE_ENV === 'production') {
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
  render: function (h) { return h(App) },
}).$mount('#app')
