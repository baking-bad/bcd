<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar :loading="loading" :network="network" :hash="hash" :contents="contents" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs center-active background-color="transparent" slider-color="primary" class="ml-4">
        <v-tab active>
          <v-icon left small>mdi-format-list-bulleted</v-icon>contents
          <span class="ml-1">({{ contents.length }})</span>
        </v-tab>        
      </v-tabs>
      <div class="mr-6 mt-6" style="width: 800px;">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view :loading="loading" :operations="operations"></router-view>
  </div>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";
import SideNavigation from "@/components/SideNavigation.vue";
import SideBar from "@/views/opg/SideBar.vue";
import { mapActions } from "vuex";

export default {
  name: "OperationGroup",
  components: {
    SearchBox,
    SideNavigation,
    SideBar
  },
  props: {
    network: String,
    hash: String,
  },
  data: () => ({
      loading: true,
      operations: []
  }),
  created() {
    this.getOPG();
  },
  methods: {
    ...mapActions({
      showError: "showError"
    }),
    getOPG() {
      this.api.getOPG(this.hash)
        .then(res => {
          this.operations = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>