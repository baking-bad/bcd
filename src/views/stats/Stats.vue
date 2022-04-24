<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar :loading="loading" :states="states" :network="currentNetwork" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs center-active background-color="transparent" slider-color="primary" class="ml-4">
        <v-tab :to="{name: 'stats_general'}" replace>
          <v-icon left small>mdi-align-vertical-bottom</v-icon>&nbsp;General
        </v-tab>
        <v-tab :to="{name: 'stats_fa12'}" replace>
          <v-icon left small>mdi-bank-outline</v-icon>&nbsp;FA1.2
        </v-tab>
        <v-tab :to="{name: 'stats_fa20'}" replace>
          <v-icon left small>mdi-bank</v-icon>&nbsp;FA2.0
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <router-view :network="currentNetwork"></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SideNavigation from "@/components/SideNavigation.vue";
import SideBar from "@/views/stats/SideBar.vue";

export default {
  name: "Stats",
  components: {
    SideNavigation,
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
