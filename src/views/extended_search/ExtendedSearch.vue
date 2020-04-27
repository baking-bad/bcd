<template>
  <div>
    <v-app-bar extended fixed app elevation="1" class="white">
      <v-combobox
        dense
        class="ml-6"
        :search-input.sync="searchText"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search anything"
        autocomplete="off"
        no-filter
        append-icon
        clearable
        hide-selected
        hide-details
        outlined
      ></v-combobox>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-btn icon color="primary" href="https://twitter.com/TezosBakingBad" target="_blank">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon color="primary" href="https://github.com/baking-bad" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="tab" class="ml-7">
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab>
            <v-icon left small>mdi-auto-fix</v-icon>Everywhere
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-code-tags</v-icon>Contracts
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-swap-horizontal</v-icon>Operations
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-file-tree</v-icon>Big Maps
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <SearchNav :filters="filters" />
    <v-container fluid class="pl-10">
      <div v-if="total > 0">
        <v-overlay :value="loading" color="white" absolute></v-overlay>
        <span
          class="time-info"
        >Found {{ total == 10000 ? `more than ${total}` : total }} documents ({{ elasticTime }} ms)</span>       
        <template v-for="(item, idx) in suggests">
          <ContractItem :key="idx" :item="item" :words="getSearchWords()" v-if="item.type === 'contract'" />
          <OperationItem :key="idx" :item="item" :words="getSearchWords()" v-else-if="item.type === 'operation'" />
          <BigMapDiffItem :key="idx" :item="item" :words="getSearchWords()" v-else-if="item.type === 'bigmapdiff'" />
        </template>
        <span v-intersect="onDownloadPage"></span>
      </div>
      <v-card
        height="60vh"
        v-else
        class="d-flex flex-column align-center justify-center mt-12 transparent message-card"
        :elevation="0"
      >
        <template v-if="isAddress() || isOpgHash()">
          <v-img class="img-avatar" :src="getCatavaSrc()"></v-img>
          <span class="headline grey--text">
            Mysterious <span v-if="isAddress()">address</span><span v-else>operation</span>
          </span>
          <span
            class="subtitle-1 grey--text"
          >We couldn't find anything, but perhaps TzKT will</span>
           <v-btn-toggle
            class="mt-2" 
            dense
            multiple>
            <template v-for="network in filters.networks">
              <v-btn 
                :key="searchText + network" 
                :href="getTzktHref(network)"
                target="_blank"
                small>{{ network }}</v-btn>            
            </template>
          </v-btn-toggle>
        </template>
        <template v-else-if="searchText == '' || searchText == null">
          <v-card flat outlined>
            <v-card-text class="pa-10">
              <div class="d-flex flex-row justify-start align-center">
                <v-icon size="50">mdi-sort-ascending</v-icon>
                <span class="display-1 ml-5">Ranking Factors</span>
              </div>
              <div class="d-flex flex-row mt-5">
                <div class="d-flex flex-column mr-5" v-for="(values, key) in help" :key="key">
                  <span class="title text-capitalize">{{ key }}</span>
                  <span v-for="(value, i) in values" :key="'help' + key + i" class="mt-1">
                    <span class="overline">{{ value[0] }}</span> <span class="body-2">{{ value[1] }}</span>
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </template>
        <template v-else-if="!cold">
          <v-icon size="100" color="grey">mdi-package-variant</v-icon>
          <span class="headline grey--text">No results found for your request</span>
          <span
            class="subtitle-1 grey--text"
          >Type another address, annotation, entrypoint name or anything else</span>
        </template>
        <v-overlay v-else :value="cold" color="white" absolute>
          <v-progress-circular indeterminate size="64" color="grey"></v-progress-circular>
        </v-overlay>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { getTzKTLink } from "@/utils/tzkt.js";

import ContractItem from "@/views/extended_search/ContractItem.vue";
import OperationItem from "@/views/extended_search/OperationItem.vue";
import BigMapDiffItem from "@/views/extended_search/BigMapDiffItem.vue";
import SearchNav from "@/views/extended_search/SearchNav.vue";

export default {
  name: "ExtendedSearch",
  components: {
    ContractItem,
    OperationItem,
    BigMapDiffItem,
    SearchNav
  },
  data: () => ({
    suggests: [],
    searchText: null,
    total: 0,
    elasticTime: 0,
    cold: true,
    loading: false,
    completed: false,
    tab: 0,
    filters: {
      startTime: 0,
      networks: [],
      languages: []
    },
    _timerId: null,
    _locked: false,
    seqno: 0,
    help: {
      'contracts': [
        ['alias', 'known contract name'],
        ['tags', 'derived from the code'],
        ['entrypoints', ''],
        ['fail_strings', 'custom error messages'],
        ['language', 'determined by heuristics'],
        ['annotations', ''],
        ['delegate', 'address'],
        ['hardcoded', 'strings inside the code section'],
        ['manager', '[deployer] address'],
        ['address']
      ],
      'operations': [
        ['entrypoint', ''],
        ['parameter_strings', ''],
        ['storage_strings', ''],
        ['error.with', 'error message [if failed]'],
        ['error.id', 'if failed'],
        ['hash', 'of the operation group']
      ],
      'big maps': [
        ['key_strings', ''],
        ['value_strings', ''],
        ['key_hash', '']
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
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.searchText = this.$route.query.text;
    });
  },
  methods: {
    ...mapActions(["showError"]),
    getSearchWords() {
      return this.searchText.split(' ');
    },
    onDownloadPage(entries) {
      if (entries[0].isIntersecting) {
        this.fetchSearchDebounced(++this.seqno, true);
      }
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
            this.cold = false;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.loading = false;
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
      let time = {s : this.filters.startTime };

      // delay new call 500ms
      this._timerId = setTimeout(() => {
        if (seqno === this.seqno) {
          this.search(text, indices, push, networks, languages, time);
          if (text !== this.$route.query.text) {
            this.$router.replace({ query: { text: text } })
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
      return getTzKTLink(network, this.searchText);
    },
    getCatavaSrc() {
      return `https://services.tzkt.io/v1/avatars/${this.searchText}`;
    }
  },
  watch: {
    searchText(val) {
      if (this._locked) return;
      this._locked = true;
      this.searchText = val ? val.trim() : '';
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
      this.fetchSearchDebounced(++this.seqno);
    },
    filters: {
      deep: true,
      handler: function() {
        this.fetchSearchDebounced(++this.seqno);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.message-card {
  margin-right: 30%;
}

.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}

.item {
  max-width: 600px;
}
.item:hover {
  cursor: pointer;
}

.time-info {
  color: grey;
  font-size: 12px;
}

.v-tab {
  font-size: 12px;
}

.tab-btn {
  color: rgba(0, 0, 0, 0.54);
}

.same-link {
  font-size: 12px;
  color: grey;
}

.same-network {
  font-size: 12px;
  color: #70757a;
}

.same-link:hover {
  color: #5b942a;
}

.img-avatar {
  max-width: 125px;
  max-height: 125px;
}
</style>
