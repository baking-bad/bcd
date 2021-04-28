import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new Router({
  linkActiveClass: '',
  linkExactActiveClass: '',
  mode: 'history',
  routes: [
    {
      path: '/',
      components: {
        default: () => import('@/views/home/Home.vue')
      },
      name: 'home'
    },
    {
      path: '/welcome',
      components: {
        default: () => import('@/views/home/Welcome.vue'),
      },
      name: 'welcome',
      props: { default: true }
    },
    {
      path: '/search',
      components: {
        default: () => import('@/views/extended_search/ExtendedSearch.vue')
      },
      name: 'search',
      props: { default: true },
    },
    {
      path: '/dapps',
      components: {
        default: () => import('@/views/dapps/Main.vue')
      },
      props: { default: true },
      children: [
        {
          path: '',
          name: 'dapps',
          redirect: 'list'
        },
        {
          path: 'list',
          components: {
            default: () => import('@/views/dapps/List.vue')
          },
          name: 'dapps-list',
          props: { default: true },
        },
        {
          path: ':slug',
          components: {
            default: () => import('@/views/dapps/DApp.vue')
          },
          name: 'dapp',
          props: { default: true },
        },
      ]
    },
    {
      path: '/stats/:network',
      components: {
        default: () => import('@/views/stats/Stats.vue'),
      },
      props: { default: true },
      children: [
        {
          path: '',
          name: 'stats',
          redirect: 'stats_general'
        },
        {
          name: 'stats_general',
          path: 'general',
          component: () => import('@/views/stats/NetworkTab.vue'),
          props: true
        },
        {
          path: 'fa12',
          name: 'stats_fa12',
          component: () => import('@/views/stats/TokensTab.vue'),
          props: true
        },
        {
          path: 'fa2',
          name: 'stats_fa20',
          component: () => import('@/views/stats/TokensTab.vue'),
          props: true
        },
        {
          path: 'domains',
          name: 'domains',
          component: () => import('@/views/stats/DomainsTab.vue'),
          props: true
        }
      ]
    },
    {
      path: '/diff',
      components: {
        default: () => import('@/views/diff/Diff.vue'),
      },
      name: 'diff',
      props: { default: true },
    },
    {
      path: '/docs',
      components: {
        default: () => import('@/views/docs/Docs.vue')
      },
      name: 'docs',
      props: { default: true },
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
      path: '/:network/:address([0-9A-z]{36})',
      components: {
        default: () => import('@/views/contract/Contract.vue'),
      },
      props: { default: true },
      children: [
        {
          path: '',
          name: 'contract',
          redirect: 'operations'
        },
        {
          path: 'operations',
          name: 'operations',
          component: () => import('@/views/contract/OperationsTab.vue'),
          props: true
        },
        {
          path: 'code',
          name: 'code',
          component: () => import('@/views/contract/CodeTab.vue'),
          props: true
        },
        {
          path: 'interact',
          name: 'interact',
          component: () => import('@/views/contract/InteractTab.vue'),
          props: true
        },
        {
          path: 'metadata',
          name: 'metadata',
          component: () => import('@/views/contract/MetadataTab/MetadataTab.vue'),
          props: true
        },
        {
          path: 'storage',
          name: 'storage',
          component: () => import('@/views/contract/StorageTab.vue'),
          props: true
        },
        {
          path: 'fork',
          name: 'fork',
          components: {
            default: () => import('@/views/contract/ForkTab.vue'),
          }
        },
        {
          path: 'tokens',
          name: 'tokens',
          component: () => import('@/views/contract/TokensTab/TokensTab.vue'),
          props: true
        },
        {
          path: 'transfers',
          name: 'transfers',
          component: () => import('@/views/contract/TransfersTab/TransfersTab.vue'),
          props: true
        },
      ]
    },
    {
      path: '/dashboard',
      components: {
        default: () => import('@/views/dashboard/Dashboard.vue')
      },
      props: { default: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          redirect: 'events'
        },
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/dashboard/EventsTab.vue'),
          props: true
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('@/views/dashboard/TasksTab.vue'),
          props: true
        },
        {
          path: 'compilations',
          name: 'compilations',
          component: () => import('@/views/dashboard/CompilationsTab.vue'),
          props: true
        }
      ]
    },
    {
      path: '/:network/big_map/:ptr(\\d+)',
      components: {
        default: () => import('@/views/big_map/BigMap.vue')
      },
      props: { default: true },
      children: [
        {
          path: '',
          name: 'big_map',
          redirect: 'keys'
        },
        {
          path: 'keys',
          name: 'big_map_keys',
          component: () => import('@/views/big_map/KeysTab.vue'),
          props: true
        },
        {
          path: ':keyhash',
          name: 'big_map_history',
          component: () => import('@/views/big_map/HistoryTab.vue'),
          props: true
        }
      ]
    },
    {
      path: '/:network/opg/:hash(o[0-9A-z]{50})',
      alias: '/:network(main|babylon|zero|carthage)/:hash(o[0-9A-z]{50})',
      components: {
        default: () => import('@/views/opg/OperationGroup.vue')
      },
      props: { default: true },
      children: [
        {
          path: '',
          name: 'operation_group',
          redirect: 'contents'
        },
        {
          path: 'contents',
          name: 'opg_contents',
          component: () => import('@/views/opg/ContentsTab.vue'),
          props: true
        }
      ]
    }
  ]
});

export default router;
