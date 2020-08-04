<template>
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="336" color="canvas" class="main-navigation">
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar
            :loading="loading"
            :address="address"
            :network="network"
            :contract="contract"
            v-on:fork="onFork"
          />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs
        v-model="tab"
        center-active
        background-color="transparent"
        slider-color="primary"
        class="ml-4"
      >
        <v-tab :to="{ name: 'operations' }" replace style="width: 175px;">
          <v-icon left small>mdi-swap-horizontal</v-icon>operations
          <span class="ml-1">({{ contract.tx_count || 0 }})</span>
        </v-tab>
        <v-tab :to="{ name: 'storage' }" replace>
          <v-icon left small>mdi-database</v-icon>Storage
        </v-tab>
        <v-tab :to="{ name: 'code' }" replace>
          <v-icon left small>mdi-code-braces</v-icon>Code
        </v-tab>
        <v-tab :to="{ name: 'interact' }" replace>
          <v-icon left small>mdi-play-box-outline</v-icon>Interact
        </v-tab>
        <v-tab v-if="migrations.length > 0" :to="{ name: 'log' }" replace>
          <v-icon left small>mdi-alert-circle-outline</v-icon>Log
          <span class="ml-1">({{ migrations.length }})</span>
        </v-tab>
        <v-tab :to="{ name: 'fork' }" replace v-if="showFork">
          <v-icon left small>mdi-source-fork</v-icon>Fork
        </v-tab>
      </v-tabs>
      <div class="mr-6 mt-6" style="width: 800px;">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view
      :address="address"
      :network="network"
      :contract="contract"
      :migrations="migrations"
    ></router-view>
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
    SideBar,
  },
  props: {
    network: String,
    address: String,
  },
  data: () => ({
    contractLoading: true,
    migrationsLoading: true,
    contract: {},
    migrations: [],
    showFork: false,
    tab: null,
  }),
  created() {
    this.showFork = this.$route.name === "fork";
    this.getContract();
    this.getMigrations();
  },
  computed: {
    loading() {
      return this.contractLoading || this.migrationsLoading;
    },
  },
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    getContract() {
      if (
        this.contract.network === this.network &&
        this.contract.address === this.address
      ) {
        return;
      }
      this.contractLoading = true;
      this.api
        .getContract(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.contract = res;
        })
        .catch((err) => {
          const matches = err.message.match(/\d+/);
          if (matches !== null && matches.length === 1)
            this.errorCode = parseInt(matches[0]);
          this.showError(err.message);
        })
        .finally(() => (this.contractLoading = false));
    },
    getMigrations() {
      this.migrationsLoading = true;
      this.api
        .getContractMigrations(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.migrations = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.migrationsLoading = false));
    },
    onFork() {
      this.showFork = !this.showFork;
    },
  },
  watch: {
    address() {
      cancelRequests();
      this.getContract();
      this.getMigrations();
      this.showFork = false;
    },
    showFork: function (newValue) {
      this.$router.push({ name: newValue ? "fork" : "operations" });
    },
  },
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
