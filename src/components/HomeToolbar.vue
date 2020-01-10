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
      <v-btn icon color="primary">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon color="primary">
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