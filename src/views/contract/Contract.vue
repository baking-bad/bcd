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
            :alias="alias"
            :contract-tags="contractTags"
            :contract-link="contractLink"
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
          v-if="isContract && tokens && tokens.length > 0"
        >
          <v-icon left small>mdi-circle-multiple-outline</v-icon>Tokens
          <span class="ml-1">({{ tokens.length || 0 }})</span>
        </v-tab>
        <v-tab
          :to="{ name: 'transfers' }"
          replace
          v-if="tokenBalances && tokenBalances.length > 0"
        >
          <v-icon left small>mdi-transfer</v-icon>Transfers
        </v-tab>
        <v-tab
          :to="{ name: 'metadata' }"
          replace
          v-if="isContract && isContractMetadata"
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
      :tokens="tokens"
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
    tokensLoading: true,
    contract: {},
    migrations: [],
    tokens: null,
    showFork: false,
    alias: undefined,
    contractTags: null,
    contractLink: '',
  }),
  mounted() {
    this.init();
  },
  computed: {
    isContractMetadata() {
      return this.contract && this.contract.metadata;
    },
    loading() {
      return this.contractLoading || this.migrationsLoading;
    },
    isContract() {
      return this.address.startsWith("KT");
    },
    tokenBalances() {
      if (!this.contract) return [];
      return this.contract.tokens;
    },
  },
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    init() {
      this.tokens = null;
      this.migrations = [];
      this.showFork = this.$route.name === "fork";
      if (this.isContract) {
        this.getContract();
        this.getMigrations();
      } else {
        this.migrationsLoading = false;
      }
      this.getInfo();
      this.getMetadata();
      this.getTokens();
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
          this.$set(this, 'contract', Object.assign(this.contract, res));
          this.$nextTick(() => {
            this.setAlias();
            this.setTags();
            this.setContractLink();
          })
        })
        .catch((err) => {
          this.showError(err.message);
        })
        .finally(() => (this.contractLoading = false));
    },
    setAlias() {
      if (this.contract.subscription && this.contract.subscription.alias) {
        this.alias = this.contract.subscription.alias;
      } else if (this.contract.alias) {
        this.alias = this.contract.alias;
      } else {
        this.alias = undefined;
      }
    },
    setTags() {
      const standards = {
        fa2: "FA2",
        fa12: "FA1.2",
        fa1: "FA1",
        delegator: "Delegator",
        multisig: "Multisig",
      };
      if (this.contract.tags) {
        for (var tag in standards) {
          if (this.contract.tags.includes(tag)) {
            this.contractTags = { tag, text: standards[tag] };
          }
        }
      } else {
        this.contractTags = null;
      }
    },
    setContractLink() {
      let routeData = {};
      if (this.contract.slug) {
        routeData = {href:`/@${this.contract.slug}`};
      } else {
        routeData = this.$router.resolve({
          name: "contract",
          params: {
            address: this.address,
            network: this.network,
          },
        });
      }
      this.contractLink = `${window.location.protocol}//${window.location.host}${routeData.href}`;
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
    getTokens() {
      this.tokensLoading = true;
      this.api
        .getContractTokens(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.tokens = res;
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => (this.tokensLoading = false));
    },
    getInfo() {
      this.contractLoading = true;
      this.api
        .getAccountInfo(this.network, this.address)
        .then((res) => {
          if (!res) return;
          if (this.isContract) {
            this.$set(this, 'contract', Object.assign(this.contract, res));
          } else {
            this.$set(this, 'contract', res);
          }
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
          this.$set(this.contract, 'metadata', res);
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
    address() {
      cancelRequests();
      this.$nextTick(() => {
        this.init();
      });
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
