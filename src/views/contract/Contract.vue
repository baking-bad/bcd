<template>
  <div class="fill-height bg-canvas-base">
    <v-row class="bg-canvas-base">
      <v-col cols="9" class="pr-4 pb-4 d-flex align-center" style="padding-top: 10px;">
        <v-breadcrumbs
          class="pl-0 pb-0 pt-0 ml-10"
          divider="/"
          :items="breadcrumbsItems"
        />
        <Tags :tags="contract.tags"/>
      </v-col>
      <v-col cols="3" class="d-flex justify-end pr-7">
        <div class="d-flex align-center justify-start pa-2 px-4">
          <v-btn
            class="mr-2 pl-2 pr-2 text--secondary"
            outlined
            small
            @click="bookmarkState"
          >
            <v-icon class="text--secondary" small>{{ isBookmark ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            <span class="ml-1 text--secondary">{{ isBookmark ? 'Remove bookmark' : 'Add bookmark' }}</span>
          </v-btn>
          <v-btn
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
          <v-btn
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
        </div>
      </v-col>
    </v-row>

    <MenuToolbar
      class="pl-7"
      :contract="contract"
      :network="network"
      :address="address"
      :tokensTotal="tokensTotal"
      :metadata="metadata"
      :is-anything-loading="isLoadingDataForTabs"
      :on-chain-views="onChainViews"
    />

    <VContainer fluid class="pt-0">
      <router-view
        :accountType="accountType"
        :address="address"
        :network="network"
        :alias="alias"
        :contract="contract"
        :tokensTotal="tokensTotal"
        :metadata="metadata"
        :same-count="contract ? contract.same_count: 0"
        :on-chain-views="onChainViews"
      ></router-view>

      <BookmarkDialog v-model="openBookMarkDialog" :alias="alias || ``" @added="onBookmarkAdded"/>
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
import BookmarkDialog from "@/components/BookmarkDialog.vue";
import {openTzktContract} from "../../utils/tzkt";
import {DATA_LOADING_STATUSES} from "../../utils/network";
import {applyStyles} from "../../utils/styles";

const MIN_SEARCHBOX_WIDTH = 240;

export default {
  name: "Contract",
  components: {
    Tags,
    MenuToolbar,
    BookmarkDialog
  },
  props: {
    network: String,
    address: String,
  },
  data: () => ({
    accountType: '',
    contractLoading: true,
    contract: {},
    balance: 0,
    metadata: null,
    tokensTotal: 0,
    contractTags: null,
    contractLink: '',
    isComboBoxExpanded: false,
    onChainViews: [],
    onChainViewsLoadingStatus: DATA_LOADING_STATUSES.NOTHING,
    isBookmark: false,
    openBookMarkDialog: false,
    alias: undefined
  }),
  computed: {
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
    isOnChainsLoading() {
      return this.offChainViewsLoadingStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    isLoadingDataForTabs() {
      return this.isOnChainsLoading;
    },
    isContract() {
      return this.accountType === 'contract';
    },
    breadcrumbsItems() {
      return [
        {
          text: 'Home',
          to: '/',
        },
        {
          to: {
            name: "recently_called",
            params: {
              network: this.network
            }
          },
          text: toTitleCase(this.network),
        },
        {
          text: this.alias ? this.alias : shortcutOnly(this.address),
          to: `/${this.network}/${this.address}`,
          disabled: false,
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
    loadOnChainViews() {
      this.onChainViews = [];
      if (!this.network || !this.address) {
        return
      }
      this.onChainViewsLoadingStatus = DATA_LOADING_STATUSES.PROGRESS;

      this.api.getMetadataViewsSchema(this.network, this.address, 'on-chain')
        .then(views => {
          views.forEach(view => applyStyles(view.schema));
          this.onChainViews = views;
        })
        .catch(err => {
          this.showError(`Error while fetching off-chain views: ${err}`);
        })
        .finally(() => {
          this.onChainViewsLoadingStatus = DATA_LOADING_STATUSES.NOTHING;
        })
    },
    openInTzkt() {
      openTzktContract(this.network, this.contract);
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
    async init() {
      this.getInfo();
      this.tokensTotal = 0;
      this.metadata = null;

      this.alias = await this.getAlias(this.network, this.address);
      if (this.isContract) {
        this.contract = {};
        this.bookmarks.registerObserver(this.onBookmarkStateChanged);
        this.detectBookmark();
        this.getContract();
        this.loadOnChainViews();
      }
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
    getInfo() {
      this.contractLoading = true;
      this.api
        .getAccountInfo(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.contract = res;
          this.accountType = res.account_type;
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
      if (!this.metadataService.created()) return;

      this.metadataService
        .get(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.metadata = res;
        })
        .catch((err) => {
          this.showError(err);
        });
    },
    bookmarkState() {
      let key = `${this.network}_${this.address}`;
      if (this.isBookmark) {
        this.bookmarks.remove(key);
      } else {
        this.openBookMarkDialog = !this.openBookMarkDialog;
        this.name = this.alias || "";
        
      }
    },
    detectBookmark() {
      let key = `${this.network}_${this.address}`;
      let bookmarks = this.bookmarks.getAll();
      this.isBookmark = bookmarks[key] !== undefined;
    },
    onBookmarkStateChanged(event, key) {
      let currentKey = `${this.network}_${this.address}`;
      if (currentKey !== key) {
        return;
      }
      if (event === 'remove') {
        this.isBookmark = false;
      } else {
        this.isBookmark = true;
      }
    },
    onBookmarkAdded(value) {
      let key = `${this.network}_${this.address}`;
      this.bookmarks.add(key, {
        network: this.network,
        address: this.address,
        alias: value || this.alias,          
      })
      this.openBookMarkDialog = false;
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
