<template>
  <v-container fluid class="pa-0 ma-0 canvas">
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
      <!-- <v-col cols="2" class="mr-4">
        <v-select
          :items="['Last updated', 'Key']"
          v-model="orderBy"
          disabled
          label="Order by"
          prepend-inner-icon="mdi-sort-ascending"
        ></v-select>
      </v-col>
      <v-col cols="2" class="mr-4">
        <v-checkbox v-model="showRemoved" disabled>
          <template v-slot:label>
            <span>Show removed</span>
          </template>
        </v-checkbox>
      </v-col> -->
    </v-row>

    <v-row class="px-8 pt-6" no-gutters>
      <v-col>
        <v-overlay v-if="loading" :value="loading" color="data" absolute>
          <v-progress-circular indeterminate color="primary" size="64" />
        </v-overlay>
        <v-card
          v-else-if="bigmap.length === 0"
          class="d-flex flex-column align-center justify-center transparent pa-8 mt-12"
          flat
        >
          <v-icon size="100" class="text--secondary">mdi-package-variant</v-icon>
          <span class="title text--secondary">No results were found for your request</span>
        </v-card>
        <v-expansion-panels v-if="bigmap.length > 0" multiple hover flat class="bb-1">
          <template v-for="(diff, idx) in bigmap">
            <BigMapDiff :diff="diff" :network="network" :address="address" :ptr="ptr" :key="idx" />
          </template>
        </v-expansion-panels>
        <span v-intersect="onDownloadPage" v-if="!downloaded"></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BigMapDiff from "@/views/big_map/BigMapDiff.vue";
import { mapActions } from "vuex";

export default {
  name: "BigMapKeys",
  props: {
    network: String,
    address: String,
    ptr: String,
    count: Number
  },
  components: {
    BigMapDiff
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
    this.fetchSearchDebounced(this.search);
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
    requestData() {
      this.fetchSearchDebounced(this.searchText);
    },
    fetchSearchDebounced(text) {
      console.log(text, "AZAZAZA")
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        this.api
          .getContractBigMap(
            this.network,
            this.address,
            this.ptr,
            text,
            this.bigmap.length
          )
          .then(res => {
            if (this.bigmap.length == 0) this.bigmap = res;
            else this.bigmap.push(...res);
            this.downloaded = res.length == 0;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.loading = false;
            this.$emit("update:count", this.bigmap.length); // TODO: get total from backend
          });
      }, 100);
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.fetchSearchDebounced(this.searchText);
      }
    }
  },
  watch: {
    ptr: "requestData",
    search(val) {
      if (this._locked) return;
      this._locked = true;
      this.downloaded = false;
      let searchText = val ? val.trim() : "";
      if (searchText.length > 2 || searchText.length === 0) {
        this.bigmap = [];
        this.loading = true;
        this.fetchSearchDebounced(searchText);
      }
      this._locked = false;
    }
  }
};
</script>