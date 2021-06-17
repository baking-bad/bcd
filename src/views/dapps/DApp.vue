<template>
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
      <v-col cols="12" v-if="dapp.categories.includes('DEX') && dapp.dex_tokens">
        <DEXBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12" v-if="dapp.categories.includes('Token') && dapp.tokens">
        <TokenBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12" v-if="dapp.agora_review_post_id || dapp.agora_qa_post_id">
        <AgoraBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
    </v-row>
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
  data: () => ({
    loading: true,
    dapp: null,
    fab: false,
  }),
  created() {
    this.getDApp(this.$route.params.slug);
  },
  methods: {
    ...mapActions(["showError"]),
    getDApp(slug) {
      this.loading = true;

      this.api_other
        .getDApp(slug)
        .then((res) => {
          this.dapp = res;
        })
        .catch((err) => {
          console.log(err);
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
