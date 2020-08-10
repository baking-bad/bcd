<template>
  <v-row v-if="dapp" no-gutters>
    <v-col cols="12">
      <HeaderBlock class="mb-10" :dapp="dapp" :loading="loading" />
    </v-col>
    <v-col cols="12" v-if="dapp.pictures">
      <ScreenshotsBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
    </v-col>
    <v-col cols="12">
      <InformationBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
    </v-col>
    <v-col cols="12">
      <StatisticsBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
    </v-col>
    <v-col cols="12" v-if="dapp.tokens">
      <TokensBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import HeaderBlock from "@/views/dapps/HeaderBlock.vue";
import InformationBlock from "@/views/dapps/InformationBlock.vue";
import ScreenshotsBlock from "@/views/dapps/ScreenshotsBlock.vue";
import StatisticsBlock from "@/views/dapps/StatisticsBlock.vue";
import TokensBlock from "@/views/dapps/TokensBlock.vue";

export default {
  name: "DApp",
  components: {
    HeaderBlock,
    ScreenshotsBlock,
    InformationBlock,
    StatisticsBlock,
    TokensBlock
  },
  data: () => ({
    loading: true,
    dapp: null,
  }),
  created() {
    this.getDApp(this.$route.params.address);
  },
  methods: {
    ...mapActions(["showError"]),
    getDApp(address) {
      this.loading = true;

      this.api
        .getDApp("mainnet", address)
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
      this.getDApp(this.$route.params.address);
    },
  },
};
</script>

<style lang="scss" scoped>
.island {
  background-color: var(--v-data-base);
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 15px;
}
</style>