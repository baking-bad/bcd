<template>
  <div>
    <v-app-bar app clipped-left elevation="0">
      <v-toolbar-title class="brand headline pl-2">
        <router-link to="/" class="font-weight-light toolbar-title">
          BETTER CALL
          <span class="font-weight-regular">DEV</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-menu open-on-hover bottom offset-y v-if="!isAuthorized">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" text v-on="on">Sign in</v-btn>
        </template>

        <v-list>
          <v-list-item
            class="d-flex align-center"
            href="http://localhost:14000/v1/oauth/github/login"
          >
            <v-list-item-title>
              <v-icon class="mr-4">mdi-github</v-icon>GitHub
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            class="d-flex align-center"
            href="http://localhost:14000/v1/oauth/gitlab/login"
          >
            <v-list-item-title>
              <v-icon class="mr-4">mdi-gitlab</v-icon>GitLab
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <router-link v-else-if="profile != null" :to="{name: 'dashboard'}" class="font-weight-light toolbar-title">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-avatar size="24" v-on="on" class="mr-4">
              <img :src="profile.avatarURL" :alt="profile.login" />
            </v-avatar>
          </template>
          {{ profile.login }}
        </v-tooltip>
      </router-link>

      <v-btn icon color="primary" href="https://twitter.com/TezosBakingBad" target="_blank">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon color="primary" href="https://github.com/baking-bad" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    }
  }
};
</script>

<style>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
