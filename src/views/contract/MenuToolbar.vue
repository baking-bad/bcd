<template>
  <v-toolbar flat class color="toolbar" height="48">
    <v-tabs
      :key="componentKey"
      center-active
      background-color="transparent"
      slider-color="primary"
    >
      <v-tab :to="pushTo({ name: 'operations' })" :key="0" :title="contract.tx_count" replace style="width: 175px">
        <v-icon left small>mdi-swap-horizontal</v-icon>operations
        <span class="ml-1">({{ contract.tx_count || 0 | numberToCompactSIFormat }})</span>
      </v-tab> 
      <v-tab v-for="(tab, idx) in tabs" :key="idx + 1" :to="tab.to">
        <v-icon left small>{{ tab.icon }}</v-icon>{{ tab.text }}
      </v-tab>
     
      <v-tab v-if="isAnythingLoading">
        <v-skeleton-loader :loading="isAnythingLoading" type="button" transition="fade-transition">
        </v-skeleton-loader>
      </v-tab>
    </v-tabs>
  </v-toolbar>
</template>

<script>
export default {
  name: "MenuToolbar",
  props: {
    contract: Object,
    address: String,
    tokensTotal: Number,
    tokenBalancesTotal: Number,
    metadata: Object,
    isAnythingLoading: Boolean,
    network: String,
    onChainViews: Array
  },
  data() {
    return {
      componentKey: 1
    }
  },
  watch: {
    'contract.tx_count'() {
      this.componentKey += 1;
    }
  },
  computed: {
    isContract() {
      return this.address.startsWith("KT");
    },
    hasOffChainViews() {
      return this.metadata && this.metadata.metadata && this.metadata.metadata.views && this.metadata.metadata.views.length > 0;
    },
    hasStats() {
      return this.stats.hasApi(this.network);
    },
    hasOnChainViews() {
      return this.onChainViews && this.onChainViews.length > 0;
    },
    tabs() {
      let tabs = [];
      if (this.isContract) {
        tabs.push({
          to: this.pushTo({ name: 'storage' }),
          icon: 'mdi-database',
          text: 'Storage',
        },{
          to: this.pushTo({ name: 'code' }),
          icon: 'mdi-code-braces',
          text: 'Code',
        },{
          to: this.pushTo({ name: 'interact' }),
          icon: 'mdi-play-box-outline',
          text: 'Interact',
        })

        if (this.tokenMetadata.created()) {
          tabs.push({
            to: this.pushTo({ name: 'tokens' }),
            icon: 'mdi-circle-multiple-outline',
            text: 'Tokens',
          })
        }

        if (this.contract.has_ticket_updates) {
          tabs.push({
            to: this.pushTo({ name: 'ticket_updates' }),
            icon: 'mdi-ticket-outline',
            text: 'Tickets',
          })
        }
      }

      if (this.metadata) {
        tabs.push({
          to: this.pushTo({ name: 'metadata' }),
          icon: 'mdi-puzzle-outline',
          text: 'Metadata',
        })
      }

      if (this.isContract) {
        tabs.push({
          to: this.pushTo({ name: 'fork' }),
          icon: 'mdi-source-fork',
          text: 'Fork',
        })

        if (this.hasOffChainViews || this.hasOnChainViews) {
          tabs.push({
            to: this.pushTo({ name: 'views' }),
            icon: 'mdi-adjust',
            text: 'Views',
          })
        }

        if (this.contract.events_count && this.contract.events_count > 0) {
          tabs.push({
            to: this.pushTo({ name: 'events' }),
            icon: 'mdi-bell-outline',
            text: 'Events',
          })
        }

        if (this.hasStats) {
          tabs.push({
            to: this.pushTo({ name: 'contract_stats' }),
            icon: 'mdi-align-vertical-bottom',
            text: 'Statistics',
          })
        }

        tabs.push({
          to: this.pushTo({ name: 'details' }),
          icon: 'mdi-alert-circle-outline',
          text: 'Details',
        })
      }

      return tabs;
    }
  },
  methods: {
    pushTo(obj) {
      return Object.assign({
        query: this.$route.query,
      }, obj);
    },
  },
}
</script>

<style scoped>

</style>