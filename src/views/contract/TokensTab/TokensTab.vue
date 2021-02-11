<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row no-gutters>
      <v-col cols="9" class="pa-2">
        <MetadataToken v-if="token" :token="token"/>
        <HoldersInfo
            v-if="token && holders[token.token_id] && Object.keys(holders[token.token_id]).length"
            class="mt-3"
            :holders="sortedCurrentHolder"
            :token="token ? token.symbol : null"
            :network="network"
            :decimals="token.decimals"
        />
      </v-col>
      <v-col cols="3" class="pa-2">
        <TokensList
          v-if="selectedToken !== -1"
          :tokens="shownTokens"
          :current-token="token"
          :preselectedToken="selectedToken"
          @changeSelectedToken="setSelectedTokenWithRoute"
        />
        <v-pagination
          v-model="tokensPage"
          :length="tokensPageCount"
          v-if="tokens && tokens.length > amountOfTokensToShow"
        ></v-pagination>
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
      if (this.token && this.holders[this.token.token_id]) {
        return Object.fromEntries(Object.entries(this.holders[this.token.token_id])
            .sort((item1, item2) => Number(item2[1]) - Number(item1[1])));
      }

      return null;
    },
    tokensPageCount() {
      if (!this.tokens) {
        return 1;
      } else {
        return Math.ceil(this.tokens.length / this.amountOfTokensToShow);
      }
    },
  },
  data: () => ({
    isInitialized: false,
    token: null,
    selectedToken: -1,
    holders: {},
    tokensPage: 1,
    amountOfTokensToShow: 10,
    shownTokens: null,
  }),
  mounted() {
    this.init();
  },
  watch: {
    tokens(newVal, oldVal) {
      if (oldVal === null) {
        this.init();
      }
      if (newVal !== null) {
        const tokenID = this.$route.query.token_id ? Number(this.$route.query.token_id) : newVal[0].token_id;
        this.setSelectedTokenWithRoute(tokenID);
      }
    },
    tokensPage() {
      this.setShownTokens();
    },
    async token(newVal) {
      if (newVal && !this.holders[newVal.token_id]) {
        const data = await this.api.getTokenHoldersList(this.network, newVal.contract, newVal.token_id);
        this.$set(this.holders, newVal.token_id, data);
      }
    },
  },
  methods: {
    init() {
      if (this.isInitialized) {
        return;
      }

      this.setTokensPage();
      this.setShownTokens();
      const tokenID = this.$route.query.token_id ? Number(this.$route.query.token_id) : this.shownTokens[0].token_id;
      this.setSelectedTokenWithRoute(tokenID);
      this.isInitialized = true;
    },
    setShownTokens() {
      const nextStart = (this.tokensPage - 1) * this.amountOfTokensToShow;
      const nextEnd = nextStart + this.amountOfTokensToShow;
      this.shownTokens = this.tokens.slice(nextStart, nextEnd);
      console.log('this.shownTokens: ', this.shownTokens)
    },
    setTokensPage() {
      const isTokenId = typeof this.$route.query.token_id !== "undefined";
      if (isTokenId) {
        const position = this.tokens.findIndex(token => token.token_id === Number(this.$route.query.token_id));
        this.tokensPage = Math.ceil(position / this.amountOfTokensToShow);
      }
    },
    sendToRoute(token_id) {
      const isNoTokenId = typeof this.$route.query.token_id === "undefined";
      const isAlreadyOnRoute = typeof this.$route.query.token_id !== "undefined" && Number(this.$route.query.token_id) === token_id;
      if (!isAlreadyOnRoute || isNoTokenId) {
        this.$router.replace({query: {token_id}});
      }
    },
    setSelectedTokenWithRoute(newVal) {
      this.token = this.shownTokens.find(token => token.token_id === newVal);
      this.selectedToken = this.shownTokens.findIndex(token => token.token_id === newVal);
      this.sendToRoute(this.token.token_id);
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
