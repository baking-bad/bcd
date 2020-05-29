<template>
  <v-container fluid class="pa-0 ma-0 canvas fill-canvas">
    <v-row class="px-8 pt-8" no-gutters>
      <v-col cols="7">
        <v-text-field
          v-model="search"
          label="Filter by"
          placeholder="Start typing a key or paste a key hash"
          prepend-inner-icon="mdi-filter-outline"
          clearable
          filled
          background-color="data"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <!-- <v-col cols="3" class="d-flex justify-center">
        <v-checkbox v-model="showRemoved">
          <template v-slot:label>
            <span>Show removed keys</span>
          </template>
        </v-checkbox>
      </v-col> -->
    </v-row>

    <v-row class="px-8 pt-6" no-gutters>
      <v-col>
        <v-overlay v-if="loading" :value="loading" color="data" absolute>
          <v-progress-circular v-if="bigmap.length === 0" indeterminate color="primary" size="64" />
        </v-overlay>
        <EmptyState
          v-if="!loading && bigmap.length === 0"
          icon="mdi-code-brackets"
          title="Nothing found"
          text="Empty set is also a result, otherwise try a broader query"
        />
        <v-expansion-panels v-if="bigmap.length > 0" multiple hover flat class="bb-1">
          <template v-for="(diff, idx) in bigmap">
            <BigMapDiff :diff="diff" :network="network" :address="address" :ptr="ptr" :key="idx" />
          </template>
        </v-expansion-panels>
        <span v-intersect="onDownloadPage" v-if="!loading && !downloaded"></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BigMapDiff from "@/views/big_map/BigMapDiff.vue";
import EmptyState from "@/components/EmptyState.vue"
import { mapActions } from "vuex";

export default {
  name: "BigMapKeys",
  props: {
    network: String,
    address: String,
    ptr: String
  },
  components: {
    BigMapDiff,
    EmptyState
  },
  data: () => ({
    loading: true,
    downloaded: false,
    showRemoved: true,
    orderBy: [],
    search: "",
    bigmap: [],
    _locked: false,
    _timerId: null
  }),
  created() {
    this.fetchSearchDebounced(this.search, !this.showRemoved);
  },
  computed: {
    searchText() {
      const searchText = this.search ? this.search.trim() : "";
      if (searchText.length > 2) {
        return searchText;
      }
      return "";
    }
  },
  methods: {
    ...mapActions(["showError"]),
    fetchSearchDebounced(text, skipRemoved = false) {
      this.loading = true;
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        this.api
          .getContractBigMapKeys(
            this.network,
            this.ptr,
            skipRemoved,
            text,
            this.bigmap.length
          )
          .then(res => {
            if (this.bigmap.length == 0) {
              this.bigmap = res;
            } else {
              this.bigmap.push(...res);
            } 
            this.downloaded = res.length == 0;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
            this.downloaded = true;
          })
          .finally(() => {
            this.loading = false;
          });
      }, 100);
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.fetchSearchDebounced(this.searchText, !this.showRemoved);
      }
    },
    onFiltersChange(searchText, skipRemoved) {
      if (this._locked) return;
      this._locked = true;
      this.downloaded = false;
      searchText = searchText ? searchText.trim() : "";
      if (searchText.length > 2 || searchText.length === 0) {
        this.bigmap = [];
        this.loading = true;
        this.fetchSearchDebounced(searchText, skipRemoved);
      }
      this._locked = false;
    }
  },
  watch: {
    search(val) {
      this.onFiltersChange(val, !this.showRemoved);
    },
    showRemoved(val) {
      this.onFiltersChange(this.searchText, !val);
    },
    ptr() {
      this.search = "";
      this.fetchSearchDebounced(this.search, !this.showRemoved);
    }
  }
};
</script>