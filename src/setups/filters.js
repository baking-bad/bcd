import Vue from "vue";
import dayjs from "dayjs";

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
        return dayjs(value).fromNow(value);
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
