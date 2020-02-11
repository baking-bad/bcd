import Vue from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'

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

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
