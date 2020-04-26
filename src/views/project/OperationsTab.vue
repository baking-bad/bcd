<template>
  <v-container fluid>
    <v-overlay :value="loading" color="white" absolute>
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>
    <div v-if="!loading">
      <v-row class="pl-lg-1 pb-lg-4">
        <v-col cols="3">
          <v-select
            v-model="status"
            :items="['applied', 'failed', 'backtracked', 'skipped', 'pending', 'lost', 'refused', 'branch_refused']"
            chips
            small-chips
            label="Status"
            placeholder="Any"
            multiple
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
            :items="contract.entrypoints"
            small-chips
            chips
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
          <v-btn small depressed @click="clearFilters" class="toolbar-btn">
            <v-icon small class="mr-1">mdi-close</v-icon>
            <span class="overline">clear filters</span>
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="operations !== undefined && operations.length > 0">
        <v-expansion-panels multiple tile>
          <Operation
            :data="item"
            :key="item.hash + '_' + item.counter + '_' + key"
            :address="contract.address"
            v-for="(item, key) in operations"
          />
        </v-expansion-panels>
        <span v-intersect="onDownloadPage" v-if="!contract.downloadedOperations"></span>
      </div>

      <v-card
        v-else
        class="d-flex flex-column align-center justify-center mt-12 transparent"
        :elevation="0"
      >
        <v-icon size="100" color="grey">mdi-package-variant</v-icon>
        <span class="title grey--text">Nothing found for your request</span>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import Operation from "@/components/Operation.vue";
import { getContractOperations, getContractMempool } from "@/api/index.js";
import dayjs from "dayjs";

export default {
  name: "OperationsTab",
  props: {
    contract: Object
  },
  components: {
    Operation
  },
  computed: {
    loading() {
      return this.operationsLoading || this.mempoolLoading;
    },
    operations() {
      let operations = [];
      if (this.last_id !== null)
        operations = this.contract.operations;

      let mempoolOperations = this.getDisplayedMempool();
      if (mempoolOperations.length > 0)
        operations = operations.concat(mempoolOperations).sort(this.compareOperations);

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
  data: () => ({
    operationsLoading: true,
    mempoolLoading: true,
    last_id: "",
    status: [],
    dates: [],
    datesBuf: [],
    datesModal: false,
    entrypoints: [],
    operationsSeqNo: 0
  }),
  created() {
    this.fetchOperations();
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
    getOperations(seqno) {
      if (this.contract == null || this.contract.downloadedOperations)
        return;

      const onChainStatuses = ['applied', 'failed', 'skipped', 'backtracked'];
      let status = this.status.filter(s => onChainStatuses.includes(s));
      if (status.length === 0 && this.status.length > 0) {
        this.operationsLoading = false;
        return;
      }
      let entries = this.entrypoints;
      let timestamps = this.getTimestamps();

      getContractOperations(
        this.contract.network,
        this.contract.address,
        this.last_id,
        timestamps[0],
        timestamps[1],
        status,
        entries
      )
        .then(res => {
          if (!res) return;
          if (seqno !== this.operationsSeqNo) return;
          this.prepareOperations(res.operations);
          this.contract.downloadedOperations = res.operations.length == 0;
          this.last_id = res.last_id;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.operationsLoading = false));
    },
    getMempool() {
      if (this.contract == null)
        return;
      
      getContractMempool(this.contract.network, this.contract.address)
        .then(res => {
          this.contract.mempool = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.mempoolLoading = false));
    },
    getDisplayedMempool() {
      if (this.contract.mempool == null)
        return [];
      
      let mempoolOperations = this.contract.mempool;

      // Apply operation filters
      if (this.status.length > 0) {
        mempoolOperations = mempoolOperations.filter(o => this.status.includes(o.status));
      }
      if (this.entrypoints.length > 0) {
        mempoolOperations = mempoolOperations.filter(o => this.entrypoints.includes(o.entrypoint));
      }
      if (this.dates.length > 0) {
        let timestamps = this.getTimestamps();
        mempoolOperations = mempoolOperations.filter(function(op) {
          const ts = dayjs(op.timestamp).unix() * 1000;
          return ts >= timestamps[0] && ts < timestamps[1];
        });
      }

      // Ensure no duplicates (tune the number if needed) and proper cut
      if (this.contract.operations.length > 0) {
        const lastTimestamp = this.contract.operations[this.contract.operations.length - 1].timestamp;
        const lastHashes = this.contract.operations.slice(0, 15).map(o => o.hash);
        mempoolOperations = mempoolOperations.filter(o => o.timestamp >= lastTimestamp && !lastHashes.includes(o.hash));
      }

      return mempoolOperations;
    },
    prepareOperations(data) {
      data.forEach(element => {
        if (element.internal) {
          this.contract.operations[
            this.contract.operations.length - 1
          ].internal_operations.push(element);
        } else {
          element.internal_operations = [];
          this.contract.operations.push(element);
        }
      });
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getOperations(++this.operationsSeqNo);
      }
    },
    clearFilters() {
      this.status = [];
      this.dates = [];
      this.datesBuf = [];
      this.datesModal = false;
      this.entrypoints = [];
      this.last_id = null;
    },
    fetchOperations() {
      this.clearFilters();
      if (this.contract.operations === undefined) {
        this.contract.downloadedOperations = false;
        this.contract.operations = [];
        this.operationsLoading = true;
        this.getOperations(++this.operationsSeqNo);
      } else {
        this.operationsLoading = false;
      }
      if (this.contract.mempool === undefined) {
        this.contract.mempool = [];
        this.mempoolLoading = true;
        this.getMempool();
      } else {
        this.mempoolLoading = false;
      }
    },
    updateOperations() {
      if (!this.operationsLoading) {
        this.operationsLoading = true;
        this.last_id = null;  // trigger computed field `operations`
        this.contract.downloadedOperations = false;
        this.contract.operations = [];
        this.getOperations(++this.operationsSeqNo);
      }
    }
  },
  watch: {
    contract: "fetchOperations",
    status: "updateOperations",
    entrypoints: "updateOperations",
    dates: "updateOperations"
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>
