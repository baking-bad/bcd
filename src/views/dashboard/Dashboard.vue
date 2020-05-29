<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar />        
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class="pl-8" color="toolbar" height="75">
      <v-tabs center-active background-color="transparent" slider-color="primary">
        <v-tab :to="{ name: 'events' }" exact-active-class="active-tab" replace>
          <v-icon left small>mdi-message-text-clock-outline</v-icon>Events
        </v-tab>
        <v-tab disabled>
          <v-icon left small>mdi-file-code-outline</v-icon>Deploy
        </v-tab>
      </v-tabs>
      <div class="mr-4 mt-6" style="width: 800px;">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view />
  </div>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";
import SideNavigation from "@/components/SideNavigation.vue"
import SideBar from "@/views/dashboard/SideBar.vue"

export default {
  name: "Dashboard",
  components: {
    SearchBox,
    SideBar,
    SideNavigation
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>