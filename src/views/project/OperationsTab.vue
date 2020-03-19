<template>
  <v-container fluid>
    <v-overlay :value="loading" color="white" absolute>
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>
    <div v-if="!loading">
      <v-row class="px-lg-4 pb-lg-2">
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
          <v-dialog
            ref="fromDialog"
            v-model="datesModal"
            :return-value.sync="dates"
            persistent
            width="300px"
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
              <v-btn text color="primary" @click="$refs.fromDialog.save(datesBuf)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col class="my-3 d-flex align-start justify-end" cols="3">
          <v-btn x-small text @click="clearFilters" class="toolbar-btn">
            <v-icon>mdi-close</v-icon>
            <span>clear filters</span>
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
        <span class="title grey--text">No operations found for your request</span>
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
      if (this.dates.length !== 2) return "";
      return this.dates.join(" — ");
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
    entrypoints: []
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
    getDates() {
      let date1 = (this.dates.length == 2 ? dayjs(this.dates[0]).unix() * 1000 : 0) || 0;
      let date2 = (this.dates.length == 2 ? dayjs(this.dates[1]).unix() * 1000 : 0) || 0;
      return [date1 < date2 ? date1 : date2, date2 > date1 ? date2 : date1]
    },
    getOperations() {
      if (this.contract == null || this.contract.downloadedOperations)
        return;

      const onChainStatuses = ['applied', 'failed', 'skipped', 'backtracked'];
      let status = this.status.filter(s => onChainStatuses.includes(s));
      if (status.length === 0 && this.status.length > 0) {
        this.operationsLoading = false;
        return;
      }
      let entries = this.entrypoints;
      let dates = this.getDates();

      getContractOperations(
        this.contract.network,
        this.contract.address,
        this.last_id,
        dates[0],
        dates[1],
        status,
        entries
      )
        .then(res => {
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
      if (this.status.length > 0) {
        mempoolOperations = mempoolOperations.filter(o => this.status.includes(o.status));
      }

      if (this.contract.operations.length > 0) {
        const lastTimestamp = this.contract.operations[this.contract.operations.length - 1].timestamp;
        mempoolOperations = mempoolOperations.filter(o => o.timestamp >= lastTimestamp);
      }

      // TODO: filter by entrypoints

      let dates = this.getDates();
      if (dates[0] !== 0 && dates[1] !== 0) {
        mempoolOperations = mempoolOperations.filter(function(op) {
          const ts = dayjs(op.timestamp).unix() * 1000;
          return ts >= dates[0] && ts < dates[1];
        });
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
        this.getOperations();
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
        this.getOperations();
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
        this.getOperations();
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
