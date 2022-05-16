<template>
  <div class="fill-height">
    <v-row class="bg-canvas-base">
      <v-col cols="6" class="pr-4 pb-4 ml-7">
        <v-breadcrumbs
          class="pl-0 pb-0"
          divider="/"
          :items="breadcrumbsItems"
        />
      </v-col>
    </v-row>

    <MenuToolbar
      class="pl-7"
      :contract="contract"
      :address="address"
      :tokensTotal="tokensTotal"
      :tokenBalancesTotal="tokenBalancesTotal"
      :metadata="metadata"
      :show-fork="showFork"
    />

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
import SideBar from "@/views/contract/SideBar.vue";
import { mapActions } from "vuex";
import { cancelRequests } from "@/utils/cancellation.js";
import {toTitleCase} from "../../utils/string";
import {shortcutOnly} from "../../utils/tz";
import MenuToolbar from "./MenuToolbar";

const MIN_SEARCHBOX_WIDTH = 240;

export default {
  name: "Contract",
  components: {
    MenuToolbar,
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
    isComboBoxExpanded: false,
  }),
  computed: {
    loading() {
      return this.contractLoading || this.migrationsLoading;
    },
    isContract() {
      return this.address.startsWith("KT");
    },
    breadcrumbsItems() {
      return [
        {
          text: 'Home',
          to: '/',
        },
        {
          disabled: true,
          text: toTitleCase(this.network),
        },
        {
          text: this.contract && this.contract.alias ? this.contract.alias : shortcutOnly(this.address),
          to: `/${this.network}/${this.address}/operations`,
        },
      ];
    },
  },
  destroyed() {
    this.hideError();
  },
  methods: {
    ...mapActions({
      showError: "showError",
      hideError: "hideError",
    }),
    handleSearchBoxFocus() {
      const { width } = this.$refs.searchbox.$el.getBoundingClientRect();
      if (width < MIN_SEARCHBOX_WIDTH) {
        this.isComboBoxExpanded = true;
      }
    },
    handleSearchBoxBlur() {
      this.isComboBoxExpanded = false;
    },
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
          if (err.code === 204) {
            return this.$router.push({
              name: 'not_found',
            });
          } else {
            this.showError(err);
          }
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
          if (res.balance !== undefined) {
            this.balance = res.balance || 0;
            return;
          }

          return this.rpc.getTezosBalance(this.network, 'head', this.address);
        })
        .then((res) => {
          if (!res) return;
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
