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
        :title="tokensTotal"
        replace
        v-if="isContract && tokensTotal > 0"
      >
        <v-icon left small>mdi-circle-multiple-outline</v-icon>Tokens
        <span class="ml-1">({{ tokensTotal | numberToCompactSIFormat }})</span>
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
      <v-tab v-show="isSameContracts" :to="pushTo({name: 'samecontracts'})" replace>
        <v-icon left small>mdi-call-split</v-icon>Same Contracts
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
  },
  computed: {
    isContract() {
      return this.address.startsWith("KT");
    },
    isSameContracts() {
      return this.sameContracts.length > 0;
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