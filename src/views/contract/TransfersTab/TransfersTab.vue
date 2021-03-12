<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row no-gutters>
      <v-col cols="8" class="pa-2">
        <TransferList
          v-if="selectedToken"
          :address="address"
          :network="network"
          :token="selectedToken"
          :contract="selectedToken.contract"
        />
      </v-col>
      <v-col cols="4" class="pa-2">
        <TransfersCard
          :tokens="balances"
          @selectedToken="updateSelectedToken"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TransferList from "@/views/contract/TransfersTab/TransferList.vue";
import TransfersCard from "@/views/contract/TransfersTab/TransfersCard.vue";

export default {
  name: "TransfersTab",
  props: {
    balances: Array,
    network: String,
    address: String,
  },
  components: {
    TransfersCard,
    TransferList,
  },
  methods: {
    updateSelectedToken(newVal) {
      this.selectedToken = newVal
    },
  },
  data: () => ({
    selectedToken: null,
  }),
};
</script>
