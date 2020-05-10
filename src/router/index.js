import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'

import HomeToolbar from '@/components/HomeToolbar.vue';
import Nav from '@/components/Nav.vue';

import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'

import ExtendedSearch from '@/views/extended_search/ExtendedSearch.vue'

import Project from '@/views/project/Project.vue'
import OperationsTab from '@/views/project/OperationsTab.vue'
import CodeTab from '@/views/project/CodeTab.vue'
import EntrypointsTab from '@/views/project/EntrypointsTab.vue'
import StorageTab from '@/views/project/StorageTab.vue'
import MigrationsTab from '@/views/project/MigrationsTab.vue'

import BigMap from '@/views/big_map/BigMap.vue'
import BigMapKeys from '@/views/big_map/KeysTab.vue'
import BigMapHistory from '@/views/big_map/HistoryTab.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import EventsTab from '@/views/dashboard/EventsTab.vue'

import Diff from '@/views/Diff.vue'
import BigMapViewer from '@/views/BigMapViewer.vue'
import BigMapDiffViewer from '@/views/BigMapDiffViewer.vue'
import Projects from '@/views/Projects.vue'
import OPG from '@/views/OPG.vue'
import Stats from '@/views/Stats.vue'

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
            path: '/stats',
            components: {
                default: Stats,
                nav: Nav
            },
            name: 'stats'
        },
        {
            path: '/opg/:hash(o[0-9A-z]{50})',
            alias: '/:network(main|babylon|zero|carthage)/:hash(o[0-9A-z]{50})',
            components: {
                default: OPG,
                nav: Nav
            },
            name: 'opg'
        },
        {
            path: '/diff',
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
            path: '/bigmap/:network/:address(KT[0-9A-z]{34})/:ptr(\\d+)',
            components: {
                default: BigMapViewer,
                nav: Nav
            },
            name: 'bigmap'
        }, {
            path: '/bigmap/:network/:address(KT[0-9A-z]{34})/:ptr(\\d+)/:keyhash',
            components: {
                default: BigMapDiffViewer,
                nav: Nav
            },
            name: 'bigmapdiff'
        },
        { // backward compatibility
            path: '/:network(main|babylon|zero|carthage)/:address(KT[0-9A-z]{34})',
            children: [
                {
                    path: '',
                    redirect: to => {
                        const { params } = to
                        return `/${params.network}net/${params.address}`
                    }
                },
                {
                    path: 'operations',
                    redirect: to => {
                        const { params } = to
                        return `/${params.network}net/${params.address}/operations`
                    }
                },
                {
                    path: 'script',
                    redirect: to => {
                        const { params } = to
                        return `/${params.network}net/${params.address}/code`
                    }
                },
                {
                    path: 'state',
                    redirect: to => {
                        const { params } = to
                        return `/${params.network}net/${params.address}/storage`
                    }
                },
            ]
        },
        {
            path: '/:network/:address(KT[0-9A-z]{34})',
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
                    path: 'migrations',
                    name: 'migrations',
                    component: MigrationsTab
                }
            ]
        },
        {
            path: '/dashboard',
            components: {
                default: Dashboard
            },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    redirect: 'events'
                },
                {
                    path: 'events',
                    name: 'events',
                    component: EventsTab
                }
            ]
        },
        {
            path: '/:network/big_map/:ptr(\\d+)',
            components: {
                default: BigMap
            },
            props: true,
            children: [
                {
                    path: '',
                    name: 'big_map_new',
                    redirect: 'keys'
                },
                {
                    path: 'keys',
                    name: 'big_map_keys',
                    component: BigMapKeys,
                    props: true
                },
                {
                    path: ':keyhash',
                    name: 'big_map_history',
                    component: BigMapHistory,
                    props: true
                }
            ]
        }
    ]
});

export default router;
