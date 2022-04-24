<template>
  <div class="fill-height canvas">
    <SideNavigation :app="true" />
    <div>
      <v-toolbar flat class color="toolbar" height="75">
        <v-toolbar-title class="headline">
          <router-link style="text-decoration: none; color: inherit;" to="/dapps">
        <span class="font-weight-light">
          Tezos
          <span class="font-weight-regular">DApps</span>
        </span>
          </router-link>
        </v-toolbar-title>
      </v-toolbar>
      <v-container style="max-width: 1280px">
        <router-view></router-view>
      </v-container>
    </div>
  </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";

export default {
  name: "MainDApp",
  components: {
    SideNavigation,
  },
};
</script>
