<template>
  <v-navigation-drawer :app="app" dark mini-variant permanent floating color="sidenav" class="top-margin-from-main-header">

    <v-list nav>
      <v-list-item-group>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item :to="{ name: 'search' }" v-on="on" active-class="primary--text">
              <v-list-item-icon>
                <v-icon v-if="isAdvancedSearchPage" color="primary">mdi-cloud-search-outline</v-icon>
                <v-icon v-else color="grey lighten-2">mdi-cloud-search-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Advanced search
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>Advanced search</span>
        </v-tooltip>

        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item
                :to="{ path: `/stats/${config.networks[0]}/general` }"
                v-on="on"
                :class="isStatsPage ? 'v-list-item--active primary--text' : ''"
            >
              <v-list-item-icon>
                <v-icon v-if="isStatsPage" color="primary">mdi-poll</v-icon>
                <v-icon v-else color="grey lighten-2">mdi-poll</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Statistics
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>Statistics</span>
        </v-tooltip>

        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item
                :to="{ path: '/dapps' }"
                v-on="on"
                :class="isDappsPage ? 'v-list-item--active primary--text' : ''"
            >
              <v-list-item-icon>
                <v-icon v-if="isDappsPage" color="primary">mdi-apps</v-icon>
                <v-icon v-else color="grey lighten-2">mdi-apps</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                DApps
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>DApps</span>
        </v-tooltip>

      </v-list-item-group>
    </v-list>

    <div class="d-flex flex-column align-center justify-center">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="random" :loading="pickingRandom" class="mt-3">
            <v-icon color="grey lighten-2">mdi-dice-3-outline</v-icon>
          </v-btn>
        </template>
        <span>Pick random</span>
      </v-tooltip>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from "vuex";
import { toggleTheme } from '../utils/vuetify';

export default {
  name: "SideNavigation",
  props: {
    app: Boolean,
  },
  computed: {
    apiDocsUrl() {
      return `${window.location.origin}/docs`;
    },
    isAdvancedSearchPage() {
      return this.$route.fullPath.indexOf(`/search`) === 0;
    },
    isDappsPage() {
      return this.$route.fullPath.indexOf(`/dapps`) === 0;
    },
    isStatsPage() {
      return this.$route.fullPath.indexOf(`/stats/`) === 0;
    },
  },
  data: () => ({
    pickingRandom: false,
  }),
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    toggleTheme,
    random() {
      if (this.pickingRandom) return;
      this.pickingRandom = true;
      this.api
          .getRandomContract()
          .then((res) => {
            this.$router.push({ path: `/${res.network}/${res.address}` });
          })
          .catch((err) => {
            if (err.code !== 204) {
              console.log(err);
              this.showError(err);
            }
          })
          .finally(() => {
            this.pickingRandom = false;
          });
    },
  },
};
</script>

<style lang="scss" scoped>
.socials-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
</style>
