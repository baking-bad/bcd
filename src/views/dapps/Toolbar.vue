<template>
  <v-toolbar flat class color="toolbar" height="75">
    <v-toolbar-title class="headline">
      <router-link style="text-decoration: none;" to="/dapps">
        <span class="font-weight-light">
          Tezos
          <span class="font-weight-regular">DApps</span>
        </span>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="mr-6 mt-6" style="width: 800px;">
      <SearchBox :inplace="true"></SearchBox>
    </div>
  </v-toolbar>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";

export default {
  name: "Toolbar",
  components: {
    SearchBox,
  },
};
</script>