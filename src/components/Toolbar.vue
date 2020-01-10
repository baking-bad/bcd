<template>
  <div>
    <v-app-bar app clipped-left color="primary" dark>
      <v-toolbar-title class="brand headline pl-2">
        <router-link to="/" class="font-weight-light toolbar-title white--text">
          BETTER CALL
          <span class="font-weight-regular">DEV</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-btn icon color="white">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon color="white">
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "Toolbar"
};
</script>

<style>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>