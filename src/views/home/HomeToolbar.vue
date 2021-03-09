<template>
  <v-app-bar app clipped-left flat class="canvas pr-4">
    <v-menu
      open-on-hover
      bottom
      offset-y
      v-if="!isAuthorized && config.oauth_enabled"
    >
      <template v-slot:activator="{ on }">
        <v-btn color="primary" text small v-on="on">
          <v-icon class="mr-1" small>mdi-login</v-icon>Sign in
        </v-btn>
      </template>

      <v-list class="pa-0">
        <v-list-item
          class="d-flex align-center px-4"
          :href="`${config.API_URI}/oauth/github/login`"
        >
          <v-list-item-title>
            <v-icon class="mr-4">mdi-github</v-icon>GitHub
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="d-flex align-center px-4"
          :href="`${config.API_URI}/oauth/gitlab/login`"
        >
          <v-list-item-title>
            <v-icon class="mr-4">mdi-gitlab</v-icon>GitLab
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-tooltip bottom v-else-if="profile != null">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :to="{ name: 'dashboard' }"
          fab
          small
          class="ml-2 mr-4"
        >
          <v-avatar size="40">
            <img :src="profile.avatar_url" :alt="profile.login" />
          </v-avatar>
        </v-btn>
      </template>
      <strong>{{ profile.login }}</strong> dashboard
    </v-tooltip>

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
    <v-btn
      icon
      class="text--secondary mr-2"
      href="tg://resolve?domain=baking_bad_chat"
      target="_blank"
      rel="nofollow noopener"
    >
      <v-icon>mdi-telegram</v-icon>
    </v-btn>
    <v-btn
      icon
      class="text--secondary mr-2"
      href="https://twitter.com/TezosBakingBad"
      target="_blank"
      rel="nofollow noopener"
    >
      <v-icon>mdi-twitter</v-icon>
    </v-btn>
    <v-btn
      icon
      class="text--secondary"
      href="https://github.com/baking-bad"
      target="_blank"
      rel="nofollow noopener"
    >
      <v-icon>mdi-github</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "HomeToolbar",
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    },
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
