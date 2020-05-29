<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar :ptr="ptr" :bigmap="bigmap" :network="network" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-btn v-if="address" small text class="ml-4" :to="{name: 'storage', params: {address: address, network}}">
        <v-icon small class="mr-1">mdi-undo-variant</v-icon>storage
      </v-btn>

      <v-tabs center-active background-color="transparent" slider-color="primary" class="ml-4">
        <v-tab :to="{ name: 'big_map_keys' }" replace>
          <v-icon left small>mdi-database</v-icon>keys
          <span v-if="bigmap" class="ml-1">({{ bigmap.total_keys }})</span>
        </v-tab>
        <v-tab v-if="keyhash" :to="{ name: 'big_map_history' }" replace>
          <v-icon left small>mdi-history</v-icon>
          <span style="text-transform: none;" v-html="helpers.shortcut(keyhash)"></span>
          <span class="ml-1">({{ count }})</span>
        </v-tab>  
      </v-tabs>
      <div class="mr-6 mt-6" style="width: 800px;">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view :address="address" :count.sync="count"></router-view>
  </div>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";
import SideNavigation from "@/components/SideNavigation.vue";
import SideBar from "@/views/big_map/SideBar.vue";
import { mapActions } from "vuex";

export default {
  name: "BigMap",
  components: {
    SearchBox,
    SideBar,
    SideNavigation,
  },
  props: {
    network: String,
    ptr: String,
  },
  computed: {
    keyhash() {
      return this.$route.params.keyhash;
    },
    address() {
      return this.bigmap.address;
    }
  },
  data: () => ({
    bigmap: {},
    count: 0
  }),
  created() {
    this.getBigMap();
  },
  methods: {
    ...mapActions(["showError"]),
    getBigMap() {
      this.api
        .getContractBigMap(this.network, this.ptr)
        .then(res => {
          if (!res) return;
          this.bigmap = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    }
  },
  watch: {
    ptr: 'getBigMap'
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>