<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar :loading="loading" :address="address" :network="network" :contract="contract" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs center-active background-color="transparent" slider-color="primary" class="ml-4">
        <v-tab :to="{ name: 'contract' }" replace>
          <v-icon left small>mdi-swap-horizontal</v-icon>operations
          <span class="ml-1">({{ contract.tx_count || 0 }})</span>
        </v-tab>
        <v-tab>
          <v-icon left small>mdi-database</v-icon>Storage
        </v-tab>
        <v-tab :to="{ name: 'code' }" replace>
          <v-icon left small>mdi-code-braces</v-icon>Code
        </v-tab>
        <v-tab>
          <v-icon left small>mdi-play-box-outline</v-icon>Interact
        </v-tab>
      </v-tabs>
      <div class="mr-6 mt-6" style="width: 800px;">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view
      :contract="contract"
      :address="address" 
      :network="network">
    </router-view>
  </div>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";
import SideNavigation from "@/components/SideNavigation.vue";
import SideBar from "@/views/contract/SideBar.vue";

import { mapActions } from "vuex";
import { cancelRequests } from "@/utils/cancellation.js";

export default {
  name: "Contract",
  components: {
    SearchBox,
    SideNavigation,
    SideBar
  },
  props: {
    network: String,
    address: String
  },
  data: () => ({
    loading: true,
    contract: {}
  }),
  created() {
    this.getContract();
  },
  methods: {
    ...mapActions({
      showError: "showError"
    }),
    getContract() {
      if (
        this.contract.network === this.network &&
        this.contract.address === this.address
      ) {
        return;
      }
      this.loading = true;
      cancelRequests();
      this.api
        .getContract(this.network, this.address)
        .then(res => {
          if (!res) return;
          this.contract = res;
        })
        .catch(err => {
          const matches = err.message.match(/\d+/);
          if (matches !== null && matches.length === 1)
            this.errorCode = parseInt(matches[0]);
          this.showError(err.message);
        })
        .finally(() => (this.loading = false));
    }
  },
  watch: {
    address: 'getContract'
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
.v-tabs {
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 500;
}
</style>
