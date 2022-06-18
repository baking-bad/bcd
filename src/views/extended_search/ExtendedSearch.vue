<template>
  <div class="fill-height canvas">
    <v-app-bar extended fixed app flat class="search-bar px-4" style="margin-top: var(--main-header-weight);" height="75">
      <div style="width: 100%;" class="mt-4 ml-8">
        <v-row>
          <v-col cols="9">
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
          <v-col cols="3" class="d-flex justify-end pt-4">
            <v-chip-group
              v-model="networks"
              column
              multiple
              mandatory
              active-class="secondary--text"
            >
              <v-chip filter outlined v-for="(net) in config.networks" :key="net">{{ net }}</v-chip>
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
      </template>
    </v-app-bar>

    <v-container fluid class="canvas fill-canvas px-10 pt-8">
      <v-row>
        <v-col cols="8" class="pl-8">
          <template v-if="total > 0">
            <v-overlay :value="loading" color="data" style="z-index:4" absolute></v-overlay>
            <span
              class="text--secondary caption ml-4"
            >Found {{ total == 10000 ? `more than ${total}` : total }} documents ({{ elasticTime }} ms)</span>
            <template v-for="(item, idx) in suggests">
              <Account   :item="item" :words="getSearchWords()" :key="idx" v-if="item.type === 'account'"/>
              <BigMapKey :item="item" :words="getSearchWords()" :key="idx" v-if="item.type === 'bigmapkey'"/>
              <Operation :item="item" :words="getSearchWords()" :key="idx" v-if="item.type === 'operation'"/>
              <Token     :item="item" :words="getSearchWords()" :key="idx" v-if="item.type === 'token'"/>
            </template>
            <span v-intersect="onDownloadPage" v-if="!completed && !loading"></span>
          </template>
          <template v-else-if="!cold">
            <EmptyState
              icon="mdi-code-brackets"
              title="Nothing found"
              text="Empty set is also a result, otherwise try a broader query"
            />
          </template>        
          <v-overlay v-else-if="loading" :value="cold" color="data" absolute>
            <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
          </v-overlay>
        </v-col>
        <v-col cols="4" v-if="first" class="pt-10 mt-2 pr-8">
          <AccountCard   :item="first" v-if="first.type === 'account' && !first.body.IsContract"/>
          <ContractCard  :item="first" v-if="first.type === 'account' && first.body.IsContract"/>
          <BigMapKeyCard :item="first" v-if="first.type === 'bigmapkey'"/>
          <OperationCard :item="first" v-if="first.type === 'operation'"/>
          <TokenCard     :item="first" v-if="first.type === 'token'"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@/components/Cards/EmptyState.vue";
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
    networks: [],
    seqno: 0,
  }),
  computed: {
    indices() {
      if (this.tab == 1) {
        return ["accounts"];
      } else if (this.tab == 2) {
        return ["operations"];
      } else if (this.tab == 3) {
        return ["big-maps"];
      } else if (this.tab == 4) {
        return ["tokens"];
      }
      return ["accounts", "operations", "big-maps", "tokens"];
    },
    first() {
      if (this.suggests.length > 0) {
        return this.suggests[0];
      }
      return undefined;
    }
  },
  mounted() {
    this.networks = [...this.config.networks.keys()];
    this.$nextTick(() => {
      this.initializing = false;
      this.searchText = this.$route.query.text;
    });
  },
  methods: {
    ...mapActions(["showError"]),
    getSearchWords() {
      return this.searchText.split(" ");
    },
    onDownloadPage(entries) {
      if (entries[0].isIntersecting && !this.completed) {
        this.fetchSearchDebounced(this.searchText, ++this.seqno, true);
      }
    },
    fetchSearchDebounced(text, seqno, push = false) {
      if (!text || text.length < 3) return;

      this.loading = true;
      this.completed = false;
      // cancel pending call
      clearTimeout(this._timerId);

      const offset = push ? this.suggests.length : 0;
      let networks = [];
      this.networks.forEach(x => {
        networks.push(this.config.networks[x]);
      });
      let filters = {
        network: networks,
        index: this.indices
      } 

      this._timerId = setTimeout(() => {
        this.searchService
          .search(text, filters, 10, offset)
          .then((res) => {
            if (seqno !== this.seqno || !res) return;

            if (!this.completed) {
              if (push) {
                this.suggests.push(...res.items);
              } else {
                this.suggests = res.items;
              }
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
    }
  },
  watch: {
    searchText(val) {
      if (!val) {
        this.clearTotal();
        return;
      }
      if (val.length < 3 || this._locked || this.initializing) return;
      if (val.length > 255) val = val.substring(0, 255);
      this._locked = true;
      this.searchText = val ? val.trim() : "";
      if (this.searchText) {
        this.fetchSearchDebounced(this.searchText, ++this.seqno);
      } else {
        this.clearTotal();
      }
      this._locked = false;
    },
    indices() {
      if (this.initializing) return;
      this.fetchSearchDebounced(this.searchText, ++this.seqno);
    },
    networks: {
      deep: true,
      handler: function () {
        if (this.initializing) return;
        this.fetchSearchDebounced(this.searchText, ++this.seqno);
      },
    },
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
