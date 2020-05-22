<template>
  <div class="fill-height canvas">
    <SideNavigation :app="true" />
    <v-app-bar extended fixed app flat class="search-bar px-4" height="75">
      <v-toolbar-title class="headline mt-4">
        <span class="font-weight-light">
          BETTER CALL
          <span class="font-weight-regular">DEV</span>
        </span>
      </v-toolbar-title>
      <div style="width: 770px;" class="mt-4 ml-8">
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
          full-width
        ></v-combobox>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center justify-end mt-4">
        <v-btn
          icon
          class="text--secondary mr-2"
          href="tg://resolve?domain=baking_bad_chat"
          target="_blank"
          rel="nofollow noopener"
        >
          <v-icon>mdi-telegram</v-icon>
        </v-btn>
        <v-btn
          icon
          class="text--secondary mr-2"
          href="https://twitter.com/TezosBakingBad"
          target="_blank"
          rel="nofollow noopener"
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn
          icon
          class="text--secondary"
          href="https://github.com/baking-bad"
          target="_blank"
          rel="nofollow noopener"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </div>

      <template v-slot:extension>
        <v-tabs v-model="tab" style="margin-left: 267px;">
          <v-tab>
            <v-icon left small>mdi-auto-fix</v-icon>Everywhere
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-code-braces</v-icon>Contracts
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-swap-horizontal</v-icon>Operations
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-database</v-icon>Big Maps
          </v-tab>
          <div class="d-flex ml-8" style="margin-top: 6px;">
            <v-btn
              v-model="showFilters"
              :depressed="showFilters"
              @click="showFilters = !showFilters"
              text
              class="text--secondary"
            >
              <v-icon small class="mr-1">mdi-filter-outline</v-icon>Filters
            </v-btn>
          </div>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-container fluid class="canvas fill-canvas pa-8">
      <div style="width: 699px; margin-left: 267px">
        <template v-if="total > 0">
          <v-overlay :value="loading" color="data" absolute></v-overlay>
          <span
            class="text--secondary caption ml-4"
          >Found {{ total == 10000 ? `more than ${total}` : total }} documents ({{ elasticTime }} ms)</span>
          <template v-for="(item, idx) in suggests">
            <ResultItem :key="idx" :item="item" :words="getSearchWords()" />
          </template>
          <span v-intersect="onDownloadPage"></span>
        </template>
        <template
          v-else-if="(isAddress() || isOpgHash()) && !loading && tzkt.supportsAny(filters.networks)"
        >
          <v-card flat outlined class="mt-8 pa-8 data">
            <v-img class="img-avatar" :src="getCatavaSrc()"></v-img>
            <span class="headline grey--text">
              Mysterious
              <span v-if="isAddress()">address</span>
              <span v-else>operation</span>
            </span>
            <span class="subtitle-1 grey--text">We couldn't find anything, but perhaps TzKT will</span>
            <v-btn-toggle class="mt-2 d-flex flex-row" multiple>
              <template v-for="network in filters.networks">
                <v-btn
                  :key="searchText + network"
                  :href="getTzktHref(network)"
                  target="_blank"
                  small
                >{{ network }}</v-btn>
              </template>
            </v-btn-toggle>
          </v-card>
        </template>
        <template v-else-if="searchText == '' || searchText == null">
          <v-card flat outlined class="mt-8 pa-8 data">
            <div class="d-flex flex-row justify-start align-center">
              <v-icon size="50">mdi-sort-ascending</v-icon>
              <span class="display-1 ml-5">Ranking Factors</span>
            </div>
            <div class="d-flex flex-row mt-5">
              <div class="d-flex flex-column mr-5" v-for="(values, key) in help" :key="key">
                <span class="title text-capitalize">{{ key }}</span>
                <span v-for="(value, i) in values" :key="'help' + key + i" class="mt-1">
                  <span class="overline">{{ value[0] }}</span>
                  <span class="body-2 ml-1">{{ value[1] }}</span>
                </span>
              </div>
            </div>
          </v-card>
        </template>
        <template v-else-if="!cold">
          <v-card
            flat
            outlined
            class="mt-8 pa-8 data d-flex flex-column align-center justify-center"
          >
            <v-icon size="100" color="grey">mdi-package-variant</v-icon>
            <span class="headline grey--text">No results found for your request</span>
            <span
              class="subtitle-1 grey--text"
            >Type another address, annotation, entrypoint name or anything else</span>
          </v-card>
        </template>
        <v-overlay v-else :value="cold" color="data" absolute>
          <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        </v-overlay>
      </div>
      <SearchFilters :show="showFilters" :filters="filters" />
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import SearchFilters from "@/views/extended_search/SearchFilters.vue";
import SideNavigation from "@/components/SideNavigation.vue";
import ResultItem from "@/views/extended_search/ResultItem.vue";

export default {
  name: "ExtendedSearch",
  components: {
    SearchFilters,
    SideNavigation,
    ResultItem
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
    showFilters: false,
    timeItems: [
      {
        name: "Any time",
        value: 0
      },
      {
        name: "Last hour",
        value: 1
      },
      {
        name: "Last 24 hours",
        value: 2
      },
      {
        name: "Last week",
        value: 3
      },
      {
        name: "Last month",
        value: 4
      },
      {
        name: "Last year",
        value: 5
      }
    ],
    filters: {
      startTime: 0,
      networks: [],
      languages: []
    },
    _timerId: null,
    _locked: false,
    seqno: 0,
    help: {
      contracts: [
        ["alias", "known contract name"],
        ["tags", "derived from the code"],
        ["entrypoints", ""],
        ["fail_strings", "custom error messages"],
        ["language", "determined by heuristics"],
        ["annotations", ""],
        ["delegate", "address"],
        ["hardcoded", "strings inside the code section"],
        ["manager", "[deployer] address"],
        ["address"]
      ],
      operations: [
        ["entrypoint", ""],
        ["parameter_strings", ""],
        ["storage_strings", ""],
        ["error.with", "error message [if failed]"],
        ["error.id", "if failed"],
        ["hash", "of the operation group"]
      ],
      "big maps": [
        ["key_strings", ""],
        ["value_strings", ""],
        ["key_hash", ""]
      ]
    }
  }),
  computed: {
    indices() {
      if (this.tab == 1) {
        return ["contract"];
      } else if (this.tab == 2) {
        return ["operation"];
      } else if (this.tab == 3) {
        return ["bigmapdiff"];
      }
      return [];
    }
  },
  mounted() {
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
        this.fetchSearchDebounced(++this.seqno, true);
      }
    },
    searchMempool(opgHash) {
      this.api
        .getOPG(opgHash)
        .then(res => {
          if (res) {
            this.suggests = res.map(op => {
              return {
                type: "operation",
                value: op.hash,
                body: op,
                highlights: { hash: op.hash }
              };
            });
            this.total = res.length;
          }
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
          this.cold = false;
        });
    },
    search(
      text,
      indices = [],
      push = false,
      networks = [],
      languages = [],
      time = {}
    ) {
      let hasText = text != null && text.length >= 2;
      if (!this.loading && hasText && !this.completed) {
        this.loading = true;
        let offset = push ? this.suggests.length : 0;
        this.api
          .search(text, indices, offset, networks, languages, time, 1)
          .then(res => {
            this.completed = res.items.length == 0;
            if (!this.completed) {
              if (push) {
                this.suggests.push(...res.items);
              } else {
                this.suggests = res.items;
              }
            }
            this.total = res.count;
            this.elasticTime = res.time;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            if (this.suggests.length === 0 && this.isOpgHash(text)) {
              this.searchMempool(text);
            } else {
              this.loading = false;
              this.cold = false;
            }
          });
      }
    },
    fetchSearchDebounced(seqno, push = false) {
      if (!this.searchText || this.searchText.length < 3) return;

      this.completed = false;
      // cancel pending call
      clearTimeout(this._timerId);

      let text = this.searchText;
      let indices = this.indices;
      let networks = this.filters.networks;
      let languages = this.filters.languages;
      let time = { s: this.filters.startTime };

      // delay new call 500ms
      this._timerId = setTimeout(() => {
        if (seqno === this.seqno) {
          this.search(text, indices, push, networks, languages, time);
          if (text !== this.$route.query.text) {
            this.$router.replace({ query: { text: text } });
          }
        }
      }, 500);
    },
    isAddress() {
      return /^(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}$/.test(this.searchText);
    },
    isOpgHash() {
      return /^o[1-9A-HJ-NP-Za-km-z]{50}$/.test(this.searchText);
    },
    getTzktHref(network) {
      return this.tzkt.resolve(network, this.searchText);
    },
    getCatavaSrc() {
      return `https://services.tzkt.io/v1/avatars/${this.searchText}`;
    }
  },
  watch: {
    searchText(val) {
      if (this._locked || this.initializing) return;
      this._locked = true;
      this.searchText = val ? val.trim() : "";
      if (this.searchText) {
        this.fetchSearchDebounced(++this.seqno);
      } else {
        this.suggests = [];
        this.total = 0;
        this.cold = true;
      }
      this._locked = false;
    },
    indices() {
      if (this.initializing) return;
      this.fetchSearchDebounced(++this.seqno);
    },
    filters: {
      deep: true,
      handler: function() {
        if (this.initializing) return;
        this.fetchSearchDebounced(++this.seqno);
      }
    }
  }
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
