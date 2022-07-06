<template>
  <v-toolbar flat class color="toolbar" height="48">
    <v-tabs
      center-active
      background-color="transparent"
      slider-color="primary"
    >
      <v-tab :to="pushTo({ name: 'operations' })" :title="contract.tx_count" replace style="width: 175px">
        <v-icon left small>mdi-swap-horizontal</v-icon>operations
        <span class="ml-1">({{ contract.tx_count || 0 | numberToCompactSIFormat }})</span>
      </v-tab>
      <v-tab :to="pushTo({ name: 'storage' })" replace v-if="isContract">
        <v-icon left small>mdi-database</v-icon>Storage
      </v-tab>
      <v-tab :to="pushTo({ name: 'code' })" replace v-if="isContract">
        <v-icon left small>mdi-code-braces</v-icon>Code
      </v-tab>
      <v-tab :to="pushTo({ name: 'interact' })" replace v-if="isContract">
        <v-icon left small>mdi-play-box-outline</v-icon>Interact
      </v-tab>
      <v-tab
        :to="pushTo({ name: 'tokens' })"
        replace
        v-if="isContract"
      >
        <v-icon left small>mdi-circle-multiple-outline</v-icon>Tokens
      </v-tab>
      <v-tab
        :to="pushTo({ name: 'transfers' })"
        replace
        v-if="tokenBalancesTotal > 0"
      >
        <v-icon left small>mdi-transfer</v-icon>Transfers
      </v-tab>
      <v-tab
        :to="pushTo({ name: 'metadata' })"
        replace
        v-if="metadata"
      >
        <v-icon left small>mdi-puzzle-outline</v-icon>Metadata
      </v-tab>
      <v-tab :to="pushTo({ name: 'fork' })" replace v-if="isContract">
        <v-icon left small>mdi-source-fork</v-icon>Fork
      </v-tab>
      <v-tab v-show="isOffChainViews" :to="pushTo({name: 'views'})" replace>
        <v-icon left small>mdi-adjust</v-icon>Views
      </v-tab>
      <v-tab v-show="contract.tx_count > 1" :to="pushTo({name: 'contract_stats'})" replace>
        <v-icon left small>mdi-align-vertical-bottom</v-icon>Statistics
      </v-tab>
      <v-tab v-show="isSameContracts || isMigrations" :to="pushTo({name: 'details'})" replace>
        <v-icon left small>mdi-alert-circle-outline</v-icon>Details
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
    sameContracts: Array,
    isAnythingLoading: Boolean,
    migrations: Array,
  },
  computed: {
    isContract() {
      return this.address.startsWith("KT");
    },
    isSameContracts() {
      return this.sameContracts.length > 0;
    },
    isMigrations() {
      return this.migrations.length > 0;
    },
    isOffChainViews() {
      return this.metadata && this.metadata.metadata && this.metadata.metadata.views && this.metadata.metadata.views.length > 0;
    },
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