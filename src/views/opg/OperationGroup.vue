<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="12">
          <SideBar :loading="loading" :network="network" :hash="hash" :operations="operations" class="top-margin-from-main-header" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs center-active background-color="transparent" slider-color="primary" class="ml-4">
        <v-tab active>
          <v-icon left small>mdi-format-list-bulleted</v-icon>contents
          <span class="ml-1">({{ contentsLength }})</span>
        </v-tab>        
      </v-tabs>
    </v-toolbar>

    <router-view :loading="loading" :operations="operations"></router-view>
  </div>
</template>

<script>
import SideBar from "@/views/opg/SideBar.vue";
import { mapActions } from "vuex";

export default {
  name: "OperationGroup",
  components: {
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
  computed: {
    contentsLength() {
      return this.operations.filter(op => !op.internal).length;
    }
  },
  methods: {
    ...mapActions({
      showError: "showError"
    }),
    getOPG() {
      this.api.getOPG(this.hash)
        .then(res => {
          if (!res) return;
          this.operations = res;
        })
        .catch(err => {
          if (err.code !== 204){
            console.log(err);
            this.showError(err);
          }
        })
        .finally(() => (this.loading = false));
    }
  },
  watch: {
    hash: "getOPG"
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>
