<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar :loading="loading" :states="states" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs center-active background-color="transparent" slider-color="primary" class="ml-4">
        <v-tab v-for="(state, idx) in states" :key="idx" :to="`/stats/${state.network}`" replace>
          <v-icon v-if="state.network === 'mainnet'" small left>mdi-crown</v-icon>
          <v-icon v-else small left>mdi-flask-outline</v-icon>
          {{ state.network }}
        </v-tab>
      </v-tabs>
      <div class="mr-6 mt-6" style="width: 800px;">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SearchBox from "@/components/SearchBox.vue";
import SideNavigation from "@/components/SideNavigation.vue";
import SideBar from "@/views/stats/SideBar.vue"

export default {
  name: "Stats",
  components: {
    SearchBox,
    SideNavigation,
    SideBar
  },
  props: {
    network: String
  },
  data: () => ({
    loading: true,
    states: []
  }),
  created() {
    this.getStats();
  },
  methods: {
    ...mapActions(["showError"]),
    navigate() {
      if (!this.network && this.states.length > 0) {
        this.$router.push({name: 'network_stats', params: {network: this.states[0].network}});
      }
    },
    getStats() {
      this.loading = true;
      this.api.getStats()
        .then(res => {
          if (!res) return;
          this.states = res.sort(function(a, b) {
            if (a.network === 'mainnet' || b.network === 'zeronet') {
              return -1;
            } else if(b.network === 'mainnet' || a.network === 'zeronet') {
              return 1;
            } else {
              return b.network.localeCompare(a.network);
            }
          });
          this.navigate();
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
  },
  watch: {
    $route: 'navigate'
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>
