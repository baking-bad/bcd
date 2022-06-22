<template>
  <div class="fill-height">
    <v-row>
       <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbs" divider="/" class="ml-10 pl-0 pt-0 mt-3" />
       </v-col>
    </v-row>
    <v-row class="fill-height px-8 mt-1" no-gutters>
      <v-col cols="2">
        <SideBar :loading="loading" :states="states" :network="currentNetwork" />
      </v-col>
      <v-col cols="10">
        <router-view :network="currentNetwork" :state="currentState"></router-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SideBar from "./SideBar.vue";
import capitalize from 'lodash.capitalize';

export default {
  name: "Network",
  components: {
    SideBar,
  },
  data: () => ({
    loading: true,
    states: [],
    currentNetwork: null,
  }),
  computed: {
    currentState() {
      return this.currentNetwork ? this.states.find((item) => item.network === this.currentNetwork) : {};
    },
    breadcrumbs() {
      return [{
        text: 'Home',
        to: '/',
      }, {
        text: capitalize(this.currentNetwork),
        to: `/${this.currentNetwork}${this.$route.hash !== '#' ? '#' : '##'}`
      }]
    }
  },
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
