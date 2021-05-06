<template>
  <div class="fill-height canvas">
    <SideNavigation :app="true" />
    <div>
      <Toolbar />
      <v-container style="max-width: 1280px">
        <router-view></router-view>
      </v-container>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/views/dapps/Toolbar.vue";
import SideNavigation from "@/components/SideNavigation.vue";

export default {
  name: "MainDApp",
  components: {
    Toolbar,
    SideNavigation,
  },
};
</script>
