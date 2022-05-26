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
      :is-anything-loading="isLoadingDataForTabs"
      :same-contracts="sameContracts"
    />

    <VContainer>
      <router-view
        :address="address"
        :network="network"
        :contract="contract"
        :tokensTotal="tokensTotal"
        :tokenBalancesTotal="tokenBalancesTotal"
        :metadata="metadata"
        :same-contracts="sameContracts"
        :same-count="sameCount"
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
import {openTzktContract} from "../../utils/tzkt";
import {DATA_LOADING_STATUSES} from "../../utils/network";

const MIN_SEARCHBOX_WIDTH = 240;

export default {
  name: "Contract",
  components: {
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
    metadata: null,
    tokenBalancesTotal: 0,
    tokensTotal: 0,
    contractTags: null,
    contractLink: '',
    isComboBoxExpanded: false,
    sameContractsLoadingStatus: DATA_LOADING_STATUSES.NOTHING,
    sameContracts: [],
    sameCount: 0,
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
    isSameContractsLoading() {
      return this.sameContractsLoadingStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    isLoadingDataForTabs() {
      return this.isSameContractsLoading;
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
          to: `/${this.network}/${this.address}/operations${this.$route.hash !== '#' ? '#' : '##'}`,
          disabled: false,
        },
      ];
    },
  },
  created() {
    this.requestSame();
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
    requestSame() {
      if (!this.isContract
        || this.sameContractsLoadingStatus !== DATA_LOADING_STATUSES.NOTHING
      ) return;
      this.sameContractsLoadingStatus = DATA_LOADING_STATUSES.PROGRESS;
      this.sameContracts = [];
      this.sameCount = 0;
      this.api
        .getSameContracts(this.network, this.address, 0)
        .then((res) => {
          if (!res) return;
          this.sameContracts = res.contracts;
          this.sameCount = res.count;
          this.sameContractsLoadingStatus = DATA_LOADING_STATUSES.SUCCESS;
        })
        .catch((err) => {
          this.showError(err);
          this.sameContractsLoadingStatus = DATA_LOADING_STATUSES.ERROR;
        });
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
