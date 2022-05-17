<template>
  <div class="fill-height bg-canvas-base">
    <v-row class="bg-canvas-base">
      <v-col cols="9" class="pr-4 pb-4 pl-3 d-flex align-center">
        <v-breadcrumbs
          class="pl-0 pb-0 pt-0 ml-7"
          divider="/"
          :items="breadcrumbsItems"
        />
        <Tags
          :contract="contract"
        />
      </v-col>
      <v-col cols="3" class="d-flex justify-end pr-7">
        <div class="d-flex align-center justify-start pa-2 px-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                class="mr-2 pl-2 pr-2 text--secondary"
                outlined
                small
                @click="
                  () => {
                    $clipboard(address);
                    showClipboardOK();
                  }
                "
              >
                <v-icon class="text--secondary" small>mdi-content-copy</v-icon>
                <span class="ml-1 text--secondary">
                  Copy address
                </span>
              </v-btn>
            </template>
            Copy address
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                class="mr-2 pl-2 pr-2 text--secondary"
                outlined
                small
                @click="
                  () => {
                    openInTzkt();
                  }
                "
              >
                <v-icon class="text--secondary" small>mdi-logout-variant</v-icon>
                <span class="ml-1 text--secondary">
                  Open in TZKT
                </span>
              </v-btn>
            </template>
            Open in TZKT
          </v-tooltip>
        </div>
      </v-col>
    </v-row>

    <MenuToolbar
      class="pl-7"
      :contract="contract"
      :address="address"
      :tokensTotal="tokensTotal"
      :tokenBalancesTotal="tokenBalancesTotal"
      :metadata="metadata"
    />

    <VContainer>
      <router-view
        :address="address"
        :network="network"
        :contract="contract"
        :migrations="migrations"
        :tokensTotal="tokensTotal"
        :tokenBalancesTotal="tokenBalancesTotal"
        :metadata="metadata"
      ></router-view>
    </VContainer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { cancelRequests } from "@/utils/cancellation.js";
import {toTitleCase} from "../../utils/string";
import {shortcutOnly} from "../../utils/tz";
import MenuToolbar from "./MenuToolbar";
import Tags from "../../components/Tags";
import ShareLink from "../../components/Buttons/ShareLink";
import {openTzktContract} from "../../utils/tzkt";

const MIN_SEARCHBOX_WIDTH = 240;

export default {
  name: "Contract",
  components: {
    ShareLink,
    Tags,
    MenuToolbar,
  },
  props: {
    network: String,
    address: String,
  },
  data: () => ({
    contractLoading: true,
    contract: {},
    balance: 0,
    migrations: [],
    metadata: null,
    tokenBalancesTotal: 0,
    tokensTotal: 0,
    contractTags: null,
    contractLink: '',
    isComboBoxExpanded: false,
  }),
  computed: {
    alias() {
      if (this.contract) {
        if (this.contract.alias) {
          return this.contract.alias;
        } else if (this.metadata && this.metadata.name) {
          return this.metadata.name;
        }
      }
      return null;
    },

    link() {
      let routeData = {};
      if (this.contract && this.contract.slug) {
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
      return `${window.location.protocol}//${window.location.host}${routeData.href}`;
    },
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
      showClipboardOK: "showClipboardOK",
    }),
    openInTzkt() {
      openTzktContract(this.contract);
    },
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
      this.contract = {};
      if (this.isContract) {
        this.getContract();
        this.getTokensTotal();
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
  },
  watch: {
    address: {
      immediate: true,
      handler() {
        cancelRequests();
        this.init();
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
