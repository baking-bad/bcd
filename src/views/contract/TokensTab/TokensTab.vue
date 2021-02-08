<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row no-gutters>
      <v-col cols="9" class="pa-2">
        <MetadataToken :token="token"/>
        <v-skeleton-loader v-show="isHoldersListLoading" :loading="isHoldersListLoading" type="image" class="mt-3"/>
        <HoldersInfo
            v-show="!isHoldersListLoading && token && holders[token.token_id]"
            class="mt-3"
            :holders="sortedCurrentHolder"
            :token="token.symbol"
        />
      </v-col>
      <v-col cols="3" class="pa-2">
        <TokensList
          :tokens="tokens"
          :preselectedToken="selectedToken"
          @changeSelectedToken="setSelectedToken"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MetadataToken from "@/views/contract/TokensTab/Metadata/MetadataToken";
import HoldersInfo from "@/views/contract/TokensTab/HoldersInfo";
import TokensList from "@/views/contract/TokensTab/TokensList";

export default {
  name: "ContractTokensTab",
  props: {
    tokens: Array,
    network: String,
  },
  components: {
    TokensList,
    HoldersInfo,
    MetadataToken,
  },
  computed: {
    sortedCurrentHolder() {
      return Object.fromEntries(Object.entries(this.holders[this.token.token_id])
          .sort((item1, item2) => Number(item2[1]) - Number(item1[1])));
    },
  },
  data: () => ({
    isHoldersListLoading: false,
    token: null,
    selectedToken: -1,
    holders: {},
  }),
  watch: {
    tokens: function () {
      this.setSelectedToken(0);
    },
    async token(newVal) {
      if (!this.holders[newVal.token_id]) {
        this.isHoldersListLoading = true;
        const data = await this.api.getTokenHoldersList(this.network, newVal.contract, newVal.token_id);
        this.isHoldersListLoading = false;
        this.$set(this.holders, newVal.token_id, data);
      }
    },
  },
  methods: {
    setSelectedToken(newVal) {
      this.selectedToken = newVal;
      this.token = this.tokens[this.selectedToken];
    },
  }
};
</script>

<style scoped>
.item {
  background-color: var(--v-canvas-base);
  opacity: 0.8;
}
</style>
