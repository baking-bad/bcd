import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'

import HomeToolbar from '@/components/HomeToolbar.vue';
import Nav from '@/components/Nav.vue';

import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import ExtendedSearch from '@/views/ExtendedSearch.vue'

import Project from '@/views/project/Project.vue'
import OperationsTab from '@/views/project/OperationsTab.vue'
import CodeTab from '@/views/project/CodeTab.vue'
import EntrypointsTab from '@/views/project/EntrypointsTab.vue'
import StorageTab from '@/views/project/StorageTab.vue'
import MigrationTab from '@/views/project/MigrationTab.vue'

import Dashboard from '@/views/dashboard/Dashboard.vue'
import SubscriptionsTab from '@/views/dashboard/SubscriptionsTab.vue'

import Diff from '@/views/Diff.vue'
import Projects from '@/views/Projects.vue'

Vue.use(VueRouter)

const router = new Router({
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
            path: '/welcome',
            components: {
                default: Home,
                toolbar: Welcome
            },
            name: 'welcome'
        },
        {
            path: '/search',
            components: {
                default: ExtendedSearch,
                nav: Nav
            },
            name: 'search'
        },
        {
            path: '/diff/:network(mainnet|babylonnet|zeronet|carthagenet)/:address([0-9A-z]{36})/:network2(mainnet|babylonnet|zeronet|carthagenet)/:address2([0-9A-z]{36})',
            components: {
                default: Diff,
                nav: Nav
            },
            name: 'diff'
        },
        {
            path: '/projects',
            components: {
                default: Projects,
                nav: Nav
            },
            name: 'projects'
        },
        {
            path: '/:network(mainnet|babylonnet|zeronet|carthagenet)/:address([0-9A-z]{36})',
            components: {
                default: Project,
                nav: Nav
            },
            children: [
                {
                    path: '',
                    name: 'project',
                    redirect: 'operations'
                },
                {
                    path: 'operations',
                    name: 'operations',
                    component: OperationsTab
                },
                {
                    path: 'code',
                    name: 'code',
                    component: CodeTab
                },
                {
                    path: 'entrypoints',
                    name: 'entrypoints',
                    component: EntrypointsTab
                },
                {
                    path: 'storage',
                    name: 'storage',
                    component: StorageTab
                },
                {
                    path: 'migration',
                    name: 'migration',
                    component: MigrationTab
                }
            ]
        },
        {
            path: '/dashboard',
            components: {
                default: Dashboard,
                nav: Nav
            },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    redirect: 'subscriptions'
                },
                {
                    path: 'subscriptions',
                    name: 'subscriptions',
                    component: SubscriptionsTab
                }
            ]
        },

        { path: '*', redirect: '/' }
    ]
});

export default router;