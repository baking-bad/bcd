<template>
  <div>
    <v-skeleton-loader
      v-if="!dapp"
      type="card"
    />
    <div v-if="dapp">
      <v-row no-gutters>
        <v-col cols="12">
          <HeaderBlock class="mb-10" :dapp="dapp" :loading="loading" />
        </v-col>
        <v-col cols="12" v-if="dapp.screenshots">
          <ScreenshotsBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
        </v-col>
        <v-col cols="12">
          <InformationBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
        </v-col>
        <v-col cols="12">
          <StatisticsBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
        </v-col>
        <v-col cols="12" v-if="dexTokens && dexTokens.length">
          <DEXBlock class="island elevation-1" :dapp="dapp" :dex-tokens="dexTokens" :loading="loading" />
        </v-col>
        <v-col cols="12" v-if="isTokenCategory && dapp.tokens">
          <TokenBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
        </v-col>
        <v-col cols="12" v-if="dapp.agora_review_post_id || dapp.agora_qa_post_id">
          <AgoraBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HeaderBlock from "@/views/dapps/HeaderBlock.vue";
import InformationBlock from "@/views/dapps/InformationBlock.vue";
import ScreenshotsBlock from "@/views/dapps/ScreenshotsBlock.vue";
import StatisticsBlock from "@/views/dapps/StatisticsBlock.vue";
import AgoraBlock from "@/views/dapps/AgoraBlock.vue";
import DEXBlock from "@/views/dapps/DEXBlock.vue";
import TokenBlock from "@/views/dapps/TokenBlock.vue";
import {DAPP_CATEGORIES} from "../../constants/dapp_categories";

export default {
  name: "DApp",
  components: {
    HeaderBlock,
    ScreenshotsBlock,
    InformationBlock,
    StatisticsBlock,
    AgoraBlock,
    DEXBlock,
    TokenBlock,
  },
  computed: {
    isDexCategory() {
      return this.dapp && this.dapp.categories.includes(DAPP_CATEGORIES.DEX);
    },
    isTokenCategory() {
      return this.dapp && this.dapp.categories.includes(DAPP_CATEGORIES.TOKEN);
    },
  },
  data: () => ({
    loading: true,
    dapp: null,
    fab: false,
    dexTokens: null,
  }),
  created() {
    this.getDApp(this.$route.params.slug);
  },
  methods: {
    ...mapActions(["showError"]),
    getDApp(slug) {
      this.loading = true;

      this.api
        .getDApp(slug)
        .then((res) => {
          this.dapp = res;
          return this.isDexCategory ? this.api.getDexDappTokens(slug) : this.dapp.dex_tokens;
        })
        .then((res) => {
          this.dexTokens = res;
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  watch: {
    $route: function () {
      this.getDApp(this.$route.params.slug);
    },
  },
};
</script>

<style lang="scss" scoped>
.island {
  background-color: var(--v-data-base);
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 4px;
}
</style>
