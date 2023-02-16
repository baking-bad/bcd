<template>
  <div class="fill-height canvas">
    <v-app-bar extended fixed app flat class="search-bar px-4" style="margin-top: var(--main-header-weight);" height="75">
      <div style="width: 100%;" class="mt-4 ml-8">
        <v-row>
          <v-col cols="8">
            <v-combobox
              rounded
              :search-input.sync="searchText"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search anything"
              autocomplete="off"
              background-color="data"
              no-filter
              append-icon
              clearable
              hide-selected
              hide-details
              outlined
            ></v-combobox>
          </v-col>
          <v-col cols="4" class="d-flex justify-end pt-4">
            <v-chip-group
              v-model="filters.network"
              column
              multiple
              mandatory
              active-class="secondary--text"
            >
              <v-chip filter outlined v-for="(net) in config.networks" :value="net" :key="net">{{ net }}</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </div>
      <template v-slot:extension>
        <v-tabs v-model="tab" class="ml-10">
          <v-tab>
            <v-icon left small>mdi-auto-fix</v-icon>Everywhere
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-wallet-outline</v-icon>Accounts
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-swap-horizontal</v-icon>Operations
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-database</v-icon>Big Maps
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-circle-multiple-outline</v-icon>Tokens
          </v-tab>
        </v-tabs>

        <v-btn small text @click="isFiltersOpen = !isFiltersOpen" class="mr-2 text--secondary" v-if="tab == 4">
          <v-icon v-if="!isFiltersOpen">mdi-chevron-down</v-icon>
          <v-icon v-else>mdi-chevron-up</v-icon>
          <span>Filters</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-container fluid class="canvas fill-canvas pa-0">
      <v-expand-transition>
        <keep-alive>
          <v-row v-show="isFiltersOpen" no-gutters>
            <v-col>
              <TokenFilters v-model="filters" :search="searchText" v-if="tab == 4" @applied="fetch"/>
              <v-divider/>
            </v-col>
          </v-row>
        </keep-alive>
      </v-expand-transition>
      <v-row v-if="(completed || loading) || total > 0" class="px-10 pt-8">
        <v-col cols="7" class="pl-8">
          <template v-if="total > 0">
            <v-overlay :value="loading" color="data" style="z-index:4" absolute></v-overlay>
            <span
              class="text--secondary caption ml-4"
            >Found {{ total == 10000 ? `more than ${total}` : total }} documents ({{ elasticTime }} ms)</span>
            <template v-for="(item, idx) in suggests">
              <Account   :item="item" :words="getSearchWords()" :key="idx" v-if="item.type === 'account'" @click="selectedIndex = idx" :active="selectedIndex == idx"/>
              <BigMapKey :item="item" :words="getSearchWords()" :key="idx" v-else-if="item.type === 'bigmapkey'" @click="selectedIndex = idx" :active="selectedIndex == idx"/>
              <Operation :item="item" :words="getSearchWords()" :key="idx" v-else-if="item.type === 'operation'" @click="selectedIndex = idx" :active="selectedIndex == idx"/>
              <Token     :item="item" :words="getSearchWords()" :key="idx" v-else-if="item.type === 'token'" @click="selectedIndex = idx" :active="selectedIndex == idx"/>
            </template>
            <span v-intersect="onDownloadPage" v-if="!completed && !loading"></span>
          </template>
          <template v-else-if="!cold">
            <EmptyState
              title="Nothing found"
              text="Empty set is also a result, otherwise try a broader query"
            />
          </template>        
          <v-overlay v-else-if="loading" :value="cold" color="data" absolute>
            <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
          </v-overlay>
        </v-col>
        <v-col cols="5" v-if="selected" class="pt-10 mt-2 pr-8">
          <keep-alive>
            <AccountCard   :item="selected" v-if="selected.type === 'account' && !selected.body.IsContract"/>
            <ContractCard  :item="selected" v-else-if="selected.type === 'account' && selected.body.IsContract"/>
            <BigMapKeyCard :item="selected" v-else-if="selected.type === 'bigmapkey'"/>
            <OperationCard :item="selected" v-else-if="selected.type === 'operation'"/>
            <TokenCard     :item="selected" v-else-if="selected.type === 'token'"/>
          </keep-alive>
        </v-col>
      </v-row>
      <StartSearchState v-else/>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@/components/Cards/EmptyState.vue";
import StartSearchState from "./StartSearchState.vue";
import {SEARCH_TABS} from "../../constants/searchTabs";
import Account from "./result/Account.vue";
import BigMapKey from "./result/BigMapKey.vue";
import Operation from "./result/Operation.vue";
import Token from "./result/Token.vue";
import AccountCard from "./cards/Account.vue";
import ContractCard from "./cards/Contract.vue";
import BigMapKeyCard from "./cards/BigMapKey.vue";
import OperationCard from "./cards/Operation.vue";
import TokenCard from "./cards/Token.vue";
import TokenFilters from './filters/TokenFilters.vue';

const MIN_SEARCH_LENGTH = 1;

export default {
  name: "ExtendedSearch",
  components: {
    Account,
    AccountCard,
    ContractCard,
    BigMapKey,
    BigMapKeyCard,
    Operation,
    OperationCard,
    Token,
    TokenCard,
    EmptyState,
    StartSearchState,
    TokenFilters,
  },
  data: () => ({
    suggests: [],
    searchText: null,
    total: 0,
    elasticTime: 0,
    cold: true,
    loading: false,
    initializing: true,
    completed: false,
    tab: 0,
    _timerId: null,
    _locked: false,
    seqno: 0,
    selectedIndex: -1,
    isFiltersOpen: false,
    filters: {
      tags: [],
      creators: [],
      minters: [],
      mime_types: [],
      network: [],
      index: []
    }
  }),
  computed: {
    selected() {
      if (this.selectedIndex < 0) {
        return;
      }
      if (this.suggests.length < this.selectedIndex + 1) {
        return;
      }
      return this.suggests[this.selectedIndex];
    },
    isTokensFilters() {
      return this.filters.tags.length > 0 ||
        this.filters.creators.length > 0 ||
        this.filters.minters.length > 0 ||
        this.filters.mime_types.length > 0
    },
    requestFilters() {
      if (this.isTokensFilters){
        return {
          tokens: this.filters
        }
      }
      return {
          search: this.filters
      }
    },
    networks() {
      return this.filters.network;
    },
    isSearchIsEmpty() {
      return !this.searchText || this.searchText.length == 0
    }
  },
  mounted() {
    this.filters.network = [...this.config.networks];
    this.$nextTick(() => {
      this.initializing = false;
      this.searchText = this.$route.query.text;
    });
  },
  methods: {
    ...mapActions(["showError"]),
    getSearchWords() {
      if (this.isSearchIsEmpty) return [];
      return this.searchText.split(" ");
    },
    onDownloadPage(entries) {
      if (entries[0].isIntersecting && !this.completed) {
        this.fetchSearchDebounced(this.searchText, ++this.seqno, true);
      }
    },
    fetchSearchDebounced(text, seqno, push = false) {
      if (!this.isTokensFilters && (!text || text.length < MIN_SEARCH_LENGTH)) return;

      this.loading = true;
      this.completed = false;
      // cancel pending call
      clearTimeout(this._timerId);

      const offset = push ? this.suggests.length : 0;
      this._timerId = setTimeout(() => {
        this.searchService
          .search(text, this.requestFilters, 10, offset)
          .then((res) => {
            if (seqno !== this.seqno || !res) return;

            if (!this.completed) {
              if (push) {
                this.suggests.push(...res.items);
              } else {
                this.suggests = res.items;
              }
            }

            if (this.selectedIndex < 0 && this.suggests.length > 0) {
              this.selectedIndex = 0;
            }

            this.total = res.total;
            this.completed =
              res.items.length != 10 ||
              (this.total == 1 &&
                this.suggests.length == 1 &&
                this.suggests[0].body.mempool);
            this.elasticTime = res.took;

            if (text !== this.$route.query.text) {
              const query = { ...this.$route.query, text };
              this.$router.replace({ query });
            }
            if (this.$route.query.redirected) {
              const query = {
                ...this.$route.query,
                sc: undefined,
                redirected: undefined,
              };
              this.$router.replace({ query });
              return;
            }
            if (this.$gtag) {
              this.$gtag.pageview(`/search?text=${text}&sc=${SEARCH_TABS[this.tab]}`);
            }
          })
          .catch((err) => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.cold = false;
            this.loading = false;
          });
      }, 500);
    },
    clearTotal() {
      this.suggests = [];
      this.total = 0;
      this.cold = true;
      this.selectedIndex = -1;
    },
    fetch() {
      if (this.initializing) return;
      this.selectedIndex = -1;
      this.fetchSearchDebounced(this.searchText, ++this.seqno);
    },
    resetFilters() {
      this.filters.tags = [];
      this.filters.creators = [];
      this.filters.minters = [];
      this.filters.mime_types = [];
      this.isFiltersOpen = false;
    }
  },
  watch: {
    searchText(val) {
      if (!val) {
        this.clearTotal();
        return;
      }
      if (val.length < MIN_SEARCH_LENGTH || this._locked || this.initializing) return;
      if (val.length > 255) val = val.substring(0, 255);
      this._locked = true;
      this.searchText = val ? val.trim() : "";
      if (this.searchText) {
        this.fetch();
      } else {
        this.clearTotal();
      }
      this._locked = false;
    },
    networks: {
      deep: true,
      handler: function () {
        this.fetch();
      },
    },
    tab(value) {
      if (value == 1) {
        this.filters.index = ["accounts"];
        this.resetFilters();
      } else if (value == 2) {
        this.filters.index = ["operations"];
        this.resetFilters();
      } else if (value == 3) {
        this.filters.index = ["big-maps"];
        this.resetFilters();
      } else if (value == 4) {
        this.filters.index = ["tokens"];
      } else {
        this.filters.index =["accounts", "operations", "big-maps", "tokens"];
        this.resetFilters();
      }

      this.clearTotal();
      this.fetch();
    }
  },
};
</script>

<style lang="scss" scoped>
.v-toolbar.v-app-bar.v-sheet.search-bar {
  background-color: var(--v-canvas-base);
  border-bottom: 1px solid var(--v-border-base);
}

.item:hover {
  cursor: pointer;
}

.img-avatar {
  max-width: 125px;
  max-height: 125px;
}
</style>
