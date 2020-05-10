<template>
  <v-container fluid class="pa-0 ma-0 canvas">
    <v-row class="px-12">
      <v-col cols="5" class="mr-4">
        <v-text-field
          v-model="search"
          label="Filter by"
          placeholder="Start typing a key or paste a key hash"
          prepend-inner-icon="mdi-filter-outline"
          clearable
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="mr-4">
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
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="px-12">
        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
        >
          <div v-if="bigmap.length > 0">
            <v-expansion-panels multiple flat class="bb-1" color="data">
              <template v-for="(diff, idx) in bigmap">
                <BigMapDiff :diff="diff" :network="network" :address="address" :ptr="ptr" :key="idx" />
              </template>
            </v-expansion-panels>
            <span v-intersect="onDownloadPage" v-if="!downloaded"></span>
          </div>
          <v-card
            v-else
            class="d-flex flex-column align-center justify-center mt-12 transparent"
            :elevation="0"
          >
            <v-icon size="100" color="grey">mdi-package-variant</v-icon>
            <span class="title grey--text">Nothing found for your request</span>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BigMapDiff from "@/views/bigmap/BigMapDiff.vue";
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
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      this.fetchSearchDebounced(this.search);
    },
    fetchSearchDebounced(text) {
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
        this.fetchSearchDebounced(this.search);
      }
    }
  },
  watch: {
    $route: "requestData",
    search(val) {
      if (this._locked) return;
      this._locked = true;
      this.downloaded = false;
      let searchText = val ? val.trim() : "";
      if (searchText.length > 2 || searchText.length == 0) {
        this.bigmap = [];
        this.loading = true;
        this.fetchSearchDebounced(searchText);
      }
      this._locked = false;
    }
  }
};
</script>