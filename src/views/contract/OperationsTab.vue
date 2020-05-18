<template>
  <v-container fluid class="px-8 py-4 canvas fill-canvas">
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="status"
          :items="['applied', 'failed', 'backtracked', 'skipped', 'pending', 'lost', 'refused', 'branch_refused']"
          chips
          small-chips
          filled
          label="Status"
          placeholder="Any"
          multiple
          background-color="data"
          hide-details
        >
          <template v-slot:selection="{ item, index }">
            <v-chip x-small v-if="index < 1">
              <span>{{ item }}</span>
            </v-chip>&nbsp;
            <span
              v-if="index === 1 "
              class="grey--text caption"
            >+{{ status.length - 1 }} others</span>
          </template>
        </v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="entrypoints"
          :items="[]"
          chips
          small-chips
          filled
          background-color="data"
          label="Entrypoint"
          placeholder="Any"
          multiple
          hide-details
        >
          <template v-slot:selection="{ item, index }">
            <v-chip x-small v-if="index < 1">
              <span>{{ shortestEntrypoint }}</span>
            </v-chip>&nbsp;
            <span
              v-if="index === 1 "
              class="grey--text caption"
            >+{{ entrypoints.length - 1 }} others</span>
          </template>
        </v-select>
      </v-col>

      <v-col cols="3">
        <v-menu
          ref="menu"
          v-model="datesModal"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateRangeText"
              label="Date range"
              placeholder="All time"
              readonly
              filled
              background-color="data"
              hide-details
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="datesBuf" scrollable range show-current>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="datesModal = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(datesBuf)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="d-flex align-center justify-end" cols="3">
        <v-btn small text @click="fetchOperations">
          <v-icon small class="mr-1 text--secondary">mdi-trash-can</v-icon>
          <span class="text--secondary">clear filters</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          v-if="!loading && items.length === 0"
          class="d-flex flex-column align-center justify-center transparent pa-8 mt-12"
          flat
        >
          <v-icon size="100" class="text--secondary">mdi-package-variant</v-icon>
          <span class="title text--secondary">No results were found for your request</span>
        </v-card>
        <v-expansion-panels v-if="items.length > 0" multiple hover flat class="bb-1">
          <ContentItem
            :data="item"
            :key="item.hash + '_' + item.counter + '_' + key"
            :address="address"
            v-for="(item, key) in items"
          />
        </v-expansion-panels>
         <v-skeleton-loader 
          v-if="loading"
          type="list-item-two-line, divider, list-item-two-line, divider, list-item-two-line"/>  
        <span v-intersect="onDownloadPage" v-if="!downloaded"></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import ContentItem from "@/views/contract/ContentItem.vue";
import dayjs from "dayjs";

export default {
  name: "OperationsTab",
  props: {
    address: String,
    network: String
  },
  components: {
    ContentItem
  },
  data: () => ({
    operations: [],
    mempool: [],
    downloaded: false,
    operationsLoading: false,
    mempoolLoading: false,
    last_id: null,
    status: [],
    dates: [],
    datesBuf: [],
    datesModal: false,
    entrypoints: []
  }),
  created() {
    this.fetchOperations();
  },
  computed: {
    loading() {
      return this.operationsLoading || this.mempoolLoading;
    },
    items() {
      let operations = [];
      if (this.last_id !== null) operations = this.operations;

      if (this.config.MEMPOOL_ENABLED) {
        let mempoolOperations = this.getDisplayedMempool();
        if (mempoolOperations.length > 0)
          operations = operations
            .concat(mempoolOperations)
            .sort(this.compareOperations);
      }

      return operations;
    },
    dateRangeText() {
      let texts = this.dates.map(d => dayjs(d).format("MMM DD"));
      if (texts.length === 2) {
        return texts.join(" — ");
      } else if (texts.length === 1) {
        return texts[0];
      } else {
        return "";
      }
    },
    shortestEntrypoint() {
      if (this.entrypoints.length === 0) return "";
      let s = this.entrypoints[0];

      for (let i = 1; i < this.entrypoints.length; i++) {
        if (this.entrypoints[i].length < s.length) s = this.entrypoints[i];
      }
      return s;
    }
  },
  methods: {
    ...mapActions(["showError"]),
    compareOperations(a, b) {
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      return 0;
    },
    getTimestamps() {
      let timestamps = this.dates.map(d => dayjs(d).unix() * 1000).sort();
      if (timestamps.length === 2) {
        return [timestamps[0], timestamps[1] + 86400000];
      } else if (timestamps.length === 1) {
        return [timestamps[0], timestamps[0] + 86400000];
      } else {
        return [0, 0];
      }
    },
    getOperations(clearData = false, resetFilters = false) {
      if (this.operationsLoading || (this.downloaded && !clearData)) return;
      this.operationsLoading = true;

      if (clearData) {
        this.operations = [];
        this.downloaded = false;
        this.last_id = null;
      }
      if (resetFilters) {
        this.status = [];
        this.dates = [];
        this.datesBuf = [];
        this.datesModal = false;
        this.entrypoints = [];
      }

      const onChainStatuses = ["applied", "failed", "skipped", "backtracked"];
      let status = this.status.filter(s => onChainStatuses.includes(s));
      if (status.length === 0 && this.status.length > 0) {
        this.operationsLoading = false;
        return;
      }
      let entries = this.entrypoints;
      let timestamps = this.getTimestamps();

      this.api
        .getContractOperations(
          this.network,
          this.address,
          this.last_id,
          timestamps[0],
          timestamps[1],
          status,
          entries
        )
        .then(res => {
          if (!res) return;
          this.pushOperations(res.operations);
          this.downloaded = res.operations.length == 0;
          this.last_id = res.last_id;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => { this.operationsLoading = false; });
    },
    getMempool() {
      if (this.mempoolLoading) return;
      this.mempoolLoading = true;

      this.api
        .getContractMempool(this.network, this.address)
        .then(res => {
          this.mempool = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.mempoolLoading = false));
    },
    getDisplayedMempool() {
      if (this.mempool.length === 0) return [];
      let mempoolOperations = this.mempool;

      // Apply operation filters
      if (this.status.length > 0) {
        mempoolOperations = mempoolOperations.filter(o =>
          this.status.includes(o.status)
        );
      }
      if (this.entrypoints.length > 0) {
        mempoolOperations = mempoolOperations.filter(o =>
          this.entrypoints.includes(o.entrypoint)
        );
      }
      if (this.dates.length > 0) {
        let timestamps = this.getTimestamps();
        mempoolOperations = mempoolOperations.filter(function(op) {
          const ts = dayjs(op.timestamp).unix() * 1000;
          return ts >= timestamps[0] && ts < timestamps[1];
        });
      }

      // Ensure no duplicates (tune the number if needed) and proper cut
      if (this.operations.length > 0) {
        const lastTimestamp = this.operations[this.operations.length - 1]
          .timestamp;
        const lastHashes = this.operations.slice(0, 15).map(o => o.hash);
        mempoolOperations = mempoolOperations.filter(
          o => o.timestamp >= lastTimestamp && !lastHashes.includes(o.hash)
        );
      }

      return mempoolOperations;
    },
    pushOperations(data) {
      data.forEach(element => {
        if (element.internal) {
          this.operations[this.operations.length - 1].internal_operations.push(
            element
          );
        } else {
          element.internal_operations = [];
          this.operations.push(element);
        }
      });
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getOperations();
      }
    },
    fetchOperations() {
      this.getOperations(true, true);
      if (this.config.MEMPOOL_ENABLED) {
        this.getMempool();
      }
    },
    updateOperations() {
      this.getOperations(true, false);
    }
  },
  watch: {
    address: "fetchOperations",
    status: "updateOperations",
    entrypoints: "updateOperations",
    dates: "updateOperations"
  }
};
</script>
