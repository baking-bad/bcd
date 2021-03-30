<template>
  <div class="fill-height">
    <v-navigation-drawer
      floating
      app
      permanent
      width="336"
      color="canvas"
      class="main-navigation"
    >
      <v-row class="fill-height br-1" no-gutters>
        <v-col cols="2">
          <SideNavigation />
        </v-col>
        <v-col cols="10">
          <SideBar
            :loading="loading"
            :address="address"
            :network="network"
            :migrations="migrations"
            :contract="contract"
            :metadata="metadata"
            :balance="balance"
            ref="sidebar"
            v-on:fork="onFork"
          />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-toolbar flat class color="toolbar" height="75">
      <v-tabs
        center-active
        background-color="transparent"
        slider-color="primary"
        class="ml-4"
      >
        <v-tab :to="{ name: 'operations' }" replace style="width: 175px">
          <v-icon left small>mdi-swap-horizontal</v-icon>operations
          <span class="ml-1">({{ contract.tx_count || 0 }})</span>
        </v-tab>
        <v-tab :to="{ name: 'storage' }" replace v-if="isContract">
          <v-icon left small>mdi-database</v-icon>Storage
        </v-tab>
        <v-tab :to="{ name: 'code' }" replace v-if="isContract">
          <v-icon left small>mdi-code-braces</v-icon>Code
        </v-tab>
        <v-tab :to="{ name: 'interact' }" replace v-if="isContract">
          <v-icon left small>mdi-play-box-outline</v-icon>Interact
        </v-tab>
        <v-tab
          :to="{ name: 'tokens' }"
          replace
          v-if="isContract && tokensTotal > 0"
        >
          <v-icon left small>mdi-circle-multiple-outline</v-icon>Tokens
          <span class="ml-1">({{ tokensTotal }})</span>
        </v-tab>
        <v-tab
          :to="{ name: 'transfers' }"
          replace
          v-if="tokenBalancesTotal > 0"
        >
          <v-icon left small>mdi-transfer</v-icon>Transfers
        </v-tab>
        <v-tab
          :to="{ name: 'metadata' }"
          replace
          v-if="metadata"
        >
          <v-icon left small>mdi-puzzle-outline</v-icon>Metadata
        </v-tab>
        <v-tab :to="{ name: 'fork' }" replace v-if="showFork && isContract">
          <v-icon left small>mdi-source-fork</v-icon>Fork
        </v-tab>
      </v-tabs>
      <div class="mr-6 mt-6" style="width: 800px">
        <SearchBox :inplace="true"></SearchBox>
      </div>
    </v-toolbar>

    <router-view
      :address="address"
      :network="network"
      :contract="contract"
      :migrations="migrations"
      :tokensTotal="tokensTotal"
      :tokenBalancesTotal="tokenBalancesTotal"
      :metadata="metadata"
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
    balance: 0,
    migrations: [],
    metadata: null,
    tokenBalancesTotal: 0,
    tokensTotal: 0,
    showFork: false,
    contractTags: null,
    contractLink: '',
  }),
  computed: {
    loading() {
      return this.contractLoading || this.migrationsLoading;
    },
    isContract() {
      return this.address.startsWith("KT");
    },
  },
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    init() {
      this.tokensTotal = 0;
      this.tokenBalancesTotal = 0;
      this.metadata = null;
      this.migrations = [];
      this.contract = {};
      this.showFork = this.$route.name === "fork";
      if (this.isContract) {
        this.getContract();
        this.getTokensTotal();
        this.getMigrations();
      } else {
        this.migrationsLoading = false;
      }
      this.getInfo();
      this.getTokenBalancesTotal();
      this.getMetadata();
    },
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
          this.showError(err);
        })
        .finally(() => (this.migrationsLoading = false));
    },
    getTokensTotal() {
      this.api
        .getContractTokensCount(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.tokensTotal = res.count || 0;
        })
        .catch((err) => {
          this.showError(err);
        })
    },
    getTokenBalancesTotal() {
      this.api
        .getAccountTokenBalances(this.network, this.address, 0, 1)
        .then((res) => {
          if (!res) return;
          this.tokenBalancesTotal = res.total || 0;
        })
        .catch((err) => {
          this.showError(err);
        })
    },
    getInfo() {
      this.contractLoading = true;
      this.api
        .getAccountInfo(this.network, this.address)
        .then((res) => {
          if (!res) return;
          if (!this.isContract) {
            this.contract = res;
          }
          this.balance = res.balance || 0;
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => (this.contractLoading = false));
    },
    getMetadata() {
      this.api
        .getAccountMetadata(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.metadata = res;
        })
        .catch((err) => {
          this.showError(err);
        });
    },
    onFork() {
      this.showFork = !this.showFork;
    },
  },
  watch: {
    address: {
      immediate: true,
      handler() {
        cancelRequests();
        this.init();
      }
    },
    showFork: function (newValue) {
      const currentRouteName = this.$route.name;
      if (newValue && currentRouteName !== "fork") {
        this.$router.push({ name: "fork" });
      } else if (!newValue && currentRouteName !== "operations") {
        this.$router.push({ name: "operations" });
      }
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
