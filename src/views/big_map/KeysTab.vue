<template>
  <v-container fluid class="pa-0 ma-0 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          color="primary"
          label="Filter by"
          placeholder="Start typing a key or paste a key hash"
          clearable
          outlined
          background-color="data"
          single-line
          hide-details
        
        >
          <template v-slot:append-outer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn ripple icon :color="onlyActive ? 'primary' : ''" :class="onlyActive ? '': 'text--secondary'" @click="onlyActive = !onlyActive" v-bind="attrs" v-on="on" style="top: -6px;">
                  <v-icon>mdi-key</v-icon>
                </v-btn>
              </template>
              <span v-if="!onlyActive">Show only active keys</span>
              <span v-else>Show all keys</span>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row class="pt-6" no-gutters>
      <v-col>
        <v-skeleton-loader
          v-if="loading && bigmap.length === 0"
          :loading="loading"
          type="list-item-two-line, list-item-two-line, list-item-two-line"
        />
        <EmptyState
          v-if="!loading && bigmap.length === 0"
          title="Nothing found"
          text="Empty set is also a result, otherwise try a broader query"
        />
        <v-expansion-panels v-if="bigmap.length > 0" multiple hover flat class="bb-1">
          <BigMapDiff 
            :network="network" 
            :address="address" 
            :ptr="ptr" 
            :key_hash="diff.body.KeyHash" 
            :name="diff.body.Name"
            :is_active="diff.body.IsActive"
            :timestamp="diff.body['@timestamp']"
            v-for="(diff, idx) in bigmap" 
            :key="idx" />
        </v-expansion-panels>
        <span v-intersect="onDownloadPage" v-if="!loading && !downloaded"></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BigMapDiff from "@/views/big_map/BigMapDiff.vue";
import EmptyState from "@/components/Cards/EmptyState.vue"
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
    onlyActive: false,
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
        if (searchText.length > 255) {
          return searchText.substring(0, 255);
        }
        return searchText;
      }
      return "";
    }
  },
  methods: {
    ...mapActions(["showError"]),
    fetchSearchDebounced(text) {
      this.loading = true;
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        this.searchService
          .bigMapKeys(
            text, {
              network: this.network,
              big_map_id: parseInt(this.ptr, 10),
              is_active: this.onlyActive
            }, 10, this.bigmap.length
          )
          .then(res => {
            if (!res) {
              this.downloaded = true;
            } else {
              res.items.forEach(x => {
                if (x.body.KeyHash && x.body.KeyHash != "") this.bigmap.push(x);
              })
              
              this.downloaded = res.items.length < 10;
            }
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
        this.fetchSearchDebounced(this.searchText);
      }
    },
    onFiltersChange(searchText) {
      if (this._locked) return;
      this._locked = true;
      this.downloaded = false;
      searchText = searchText ? searchText.trim() : "";
      if (searchText.length > 2 || searchText.length === 0) {
        this.bigmap = [];
        this.fetchSearchDebounced(searchText);
      }
      this._locked = false;
    }
  },
  watch: {
    search(val) {
      this.onFiltersChange(val);
    },
    ptr() {
      this.search = "";
      this.onFiltersChange(this.search);
    },
    onlyActive() {
      this.onFiltersChange(this.search);
    }
  }
};
</script>