import Vue from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'

import { UnauthorizedError, getProfile } from "@/api/profile.js";
import { getJwt, logout } from "@/utils/auth.js";

import vuetify from './plugins/vuetify';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

Vue.config.productionTip = false

dayjs.extend(relativeTime);
dayjs.extend(utc);


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
        console.log(typeof err)
        if (err instanceof UnauthorizedError) {
          console.log(err.name)
          store.dispatch('setIsAuthorized', false);
          store.dispatch('setProfile', null);
          logout();
        } else {
          console.log(err)
        }
      });
  }

  next();
})

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
