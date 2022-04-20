<template>
  <v-app-bar app clipped-left flat class="canvas pr-4">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon @click="toggleTheme" class="ml-2 text--secondary">
          <v-icon v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
          <v-icon v-else>mdi-weather-night</v-icon>
        </v-btn>
      </template>
      <span v-if="$vuetify.theme.dark">Disable dark theme</span>
      <span v-else>Enable dark theme</span>
    </v-tooltip>

    <v-btn icon class="ml-2 text--secondary" to="/docs">
      <v-icon>mdi-api</v-icon>
    </v-btn>

    <v-spacer></v-spacer>
    <SocialsList />
  </v-app-bar>
</template>

<script>
import SocialsList from '../../components/SocialsList';

export default {
  name: "HomeToolbar",
  components: {SocialsList},
  computed: {
    apiDocsUrl() {
      return `${window.location.origin}/docs`;
    },
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark", this.$vuetify.theme.dark);
    },
  },
};
</script>

<style>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
