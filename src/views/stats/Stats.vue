<template>
  <div class="fill-height">
    <v-row class="fill-height br-1 pa-8" no-gutters>
      <v-col cols="3">
        <SideBar :loading="loading" :states="states" :network="currentNetwork" />
      </v-col>
      <v-col cols="9">
        <router-view :network="currentNetwork"></router-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SideBar from "@/views/stats/SideBar.vue";

export default {
  name: "Stats",
  components: {
    SideBar,
  },
  data: () => ({
    loading: true,
    states: [],
    currentNetwork: null,
  }),
  created() {
    this.getStats();
  },
  methods: {
    ...mapActions(["showError"]),
    navigate() {
      if (this.$route.params.network)
        this.currentNetwork = this.$route.params.network;
      else if (this.states.length > 0)
        this.currentNetwork = this.states[0].network;
    },
    getStats() {
      this.loading = true;
      this.api
        .getStats()
        .then((res) => {
          if (!res) return;
          this.states = res.sort(function (a, b) {
            if (a.network === "mainnet") {
              return -1;
            } else if (b.network === "mainnet") {
              return 1;
            } else {
              return b.network.localeCompare(a.network);
            }
          });
          this.navigate();
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
  },
  watch: {
    $route: "navigate",
  },
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>
