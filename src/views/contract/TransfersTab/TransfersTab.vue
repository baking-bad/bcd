<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row v-if="balances" no-gutters>
      <v-col cols="8" class="pa-2">
        <TransferList
          :address="address"
          :network="network"
          :token="token"
          :contract="token.contract"
        />
      </v-col>
      <v-col cols="4" class="pa-2">
        <TransfersCard
          @selectedToken="updateSelectedToken"
          :default-selected-token="selectedToken"
          :balances="balances"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TransferList from "@/views/contract/TransferList.vue";
import TransfersCard from "@/views/contract/TransfersTab/TransfersCard";

export default {
  name: "TransfersTab",
  props: {
    contract: Object,
    network: String,
    address: String,
  },
  components: {
    TransfersCard,
    TransferList,
  },
  computed: {
    balances() {
      if (!this.contract) return [];
      return this.contract.tokens;
    },
    token() {
      if (
        this.selectedToken < 0 ||
        this.selectedToken >= this.contract.tokens.length
      )
        return null;
      return this.contract.tokens[this.selectedToken];
    },
  },
  methods: {
    updateSelectedToken(newVal) {
      this.selectedToken = newVal
    },
  },
  data: () => ({
    selectedToken: 0,
  }),
};
</script>