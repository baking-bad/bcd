import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'

import HomeToolbar from '@/components/HomeToolbar.vue';
import Toolbar from '@/components/Toolbar.vue';

import Home from '@/views/Home.vue'
import Project from '@/views/Project.vue'

Vue.use(VueRouter)

export default new Router({
    linkActiveClass: '',
    linkExactActiveClass: '',
    mode: 'history',
    routes: [
        {
            path: '/',
            components: {
                default: Home,
                toolbar: HomeToolbar
            },
            name: 'home'
        },
        {
            path: '/:address([0-9A-z]{36})',
            components: {
                default: Project,
                toolbar: Toolbar
            },
        }
    ]
});
