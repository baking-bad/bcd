<template>
  <div>
    <v-skeleton-loader
      v-if="!dapp"
      type="card"
    />
    <div v-if="dapp">
      <v-row no-gutters>
        <v-col cols="12">
          <HeaderBlock class="mb-10" :dapp="dapp" />
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
import DEXBlock from "@/views/dapps/DEXBlock.vue";
import TokenBlock from "@/views/dapps/TokenBlock.vue";

export default {
  name: "DApp",
  components: {
    HeaderBlock,
    ScreenshotsBlock,
    InformationBlock,
    StatisticsBlock,
    DEXBlock,
    TokenBlock,
  },
  data: () => ({
    loading: true,
    dapp: null,
    fab: false,
  }),
  created() {
    this.getBasicInfo(this.$route.params.slug);
    this.getDApp(this.$route.params.slug);
  },
  methods: {
    ...mapActions(["showError"]),
    getBasicInfo(slug) {
      this.api
        .getDApps()
        .then((res) => {
          for (var i = 0; i < res.length; i++) {
            if (res[i].slug == slug) {
              this.dapp = res[i];
              return;
            }
          }          
        })
    },
    getDApp(slug) {
      this.loading = true;
      this.api
        .getDApp(slug)
        .then((res) => {
          this.dapp = res;
        })
        .finally(() => {
          this.loading = false;
        })
    },
  },
  watch: {
    $route: function () {
      this.getBasicInfo(this.$route.params.slug);
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
