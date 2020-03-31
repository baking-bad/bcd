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
            <v-icon left small>mdi-auto-fix</v-icon>All
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-code-tags</v-icon>Contracts
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-swap-horizontal</v-icon>Operations
          </v-tab>
          <v-spacer></v-spacer>
          <v-btn
            small
            tile
            ripple
            :depressed="showTools"
            class="align-self-center mr-4 tab-btn primary--text"
            @click="showTools = !showTools"
          >Filters</v-btn>
        </v-tabs>
      </template>
    </v-app-bar>

    <SearchNav v-model="showTools" :filters="filters" />
    <v-container fluid class="pl-10">
      <div v-if="total > 0">
        <v-overlay :value="loading" color="white" absolute></v-overlay>
        <span
          class="time-info"
        >Found {{ total == 10000 ? `more than ${total}` : total }} documents ({{ elasticTime }} ms)</span>       
        <template v-for="(item, idx) in suggests">
          <ContractItem :key="idx" :item="item" :words="getSearchWords()" v-if="item.type === 'contract'" />
          <OperationItem :key="idx" :item="item" v-else-if="item.type === 'operation'" />
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
          <v-icon size="100" color="grey">mdi-cloud-search-outline</v-icon>
          <span class="headline grey--text">You can try search anything</span>
          <span
            class="subtitle-1 grey--text"
          >Type address, annotation, entrypoint name or anything else</span>
        </template>
        <template v-else>
          <v-icon size="100" color="grey">mdi-package-variant</v-icon>
          <span class="headline grey--text">No results found for your request</span>
          <span
            class="subtitle-1 grey--text"
          >Type another address, annotation, entrypoint name or anything else</span>
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapActions } from "vuex";

import { getTzKTLink } from "@/utils/tzkt.js";
import * as api from "@/api/index.js";

import ContractItem from "@/views/extended_search/ContractItem.vue";
import OperationItem from "@/views/extended_search/OperationItem.vue";
import SearchNav from "@/views/extended_search/SearchNav.vue";

export default {
  name: "ExtendedSearch",
  components: {
    ContractItem,
    OperationItem,
    SearchNav
  },
  data: () => ({
    suggests: [],
    searchText: null,
    total: 0,
    elasticTime: 0,
    loading: false,
    completed: false,
    tab: 0,
    showTools: true,
    showTimeDialog: false,
    filters: {
      startTime: 0,
      networks: ["mainnet", "babylonnet", "carthagenet", "zeronet"],
      languages: ["michelson", "ligo", "smartpy", "liquidity", "lorentz"]
    },
    _timerId: null
  }),
  computed: {
    indices() {
      if (this.tab == 1) {
        return ["contract"];
      } else if (this.tab == 2) {
        return ["operation"];
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
    getSearchText() {
      return this.searchText ? this.searchText.trim() : '';
    },
    getSearchWords() {
      return this.getSearchText().split(' ');
    },
    onDownloadPage(entries) {
      if (entries[0].isIntersecting) {
        this.fetchSearchDebounced(
          this.getSearchText(),
          this.indices,
          true,
          this.filters.networks,
          this.filters.languages,
          this.filters.startTime
        );
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
        api
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
            this.loading = false;
          });
      }
    },
    getSearchTime(selectedTime) {
      if (selectedTime == 1) {
        return dayjs()
          .subtract(1, "hour")
          .unix();
      } else if (selectedTime == 2) {
        return dayjs()
          .subtract(1, "day")
          .unix();
      } else if (selectedTime == 3) {
        return dayjs()
          .subtract(1, "week")
          .unix();
      } else if (selectedTime == 4) {
        return dayjs()
          .subtract(1, "month")
          .unix();
      } else if (selectedTime == 5) {
        return dayjs()
          .subtract(1, "year")
          .unix();
      }
      return 0;
    },
    fetchSearchDebounced(
      text,
      indices = [],
      push = false,
      networks = [],
      languages = [],
      time = {}
    ) {
      if (text == null) return;
      this.completed = false;
      // cancel pending call
      clearTimeout(this._timerId);

      // delay new call 200ms
      this._timerId = setTimeout(() => {
        this.search(text, indices, push, networks, languages, time);
      }, 200);
    },
    isAddress() {
      return /^(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}$/.test(this.getSearchText());
    },
    isOpgHash() {
      return /^o[1-9A-HJ-NP-Za-km-z]{50}$/.test(this.getSearchText());
    },
    getTzktHref(network) {
      return getTzKTLink(network, this.getSearchText());
    },
    getCatavaSrc() {
      return `https://services.tzkt.io/v1/avatars/${this.getSearchText()}`;
    }
  },
  watch: {
    searchText(val) {
      let startTime = { s: this.getSearchTime(this.filters.startTime) };
      this.fetchSearchDebounced(
        val ? val.trim() : null,
        this.indices,
        false,
        this.filters.networks,
        this.filters.languages,
        startTime
      );
    },
    indices(val) {
      let startTime = { s: this.getSearchTime(this.filters.startTime) };
      this.fetchSearchDebounced(
        this.getSearchText(),
        val,
        false,
        this.filters.networks,
        this.filters.languages,
        startTime
      );
    },
    filters: {
      deep: true,
      handler: function(newValue) {
        let startTime = { s: this.getSearchTime(newValue.startTime) };
        this.fetchSearchDebounced(
          this.getSearchText(),
          this.indices,
          false,
          this.filters.networks,
          this.filters.languages,
          startTime
        );
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
