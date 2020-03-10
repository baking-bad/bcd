<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <div v-else>
      <v-row class="px-4 pb-4">
        <v-col cols="12" md="6" lg="3">
          <v-select
            v-model="status"
            :items="['applied', 'failed', 'backtracked', 'skipped']"
            chips
            small-chips
            label="Status"
            multiple
            hide-details
          >
            <template v-slot:selection="{ item, index }">
              <v-chip small v-if="index < 1">
                <span>{{ item }}</span>
              </v-chip>
              <span v-if="index === 1 " class="grey--text caption">(+{{ status.length - 1 }} others)</span>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6" lg="2">
          <v-dialog
            ref="fromDialog"
            v-model="fromModal"
            :return-value.sync="from"
            persistent
            width="300px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="from" label="Date from" readonly hide-details v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="from" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="fromModal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.fromDialog.save(from)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="6" lg="2">
          <v-dialog
            ref="toDialog"
            v-model="toModal"
            :return-value.sync="to"
            persistent
            width="300px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="to" label="Date to" readonly hide-details v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="to" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="toModal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.toDialog.save(to)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-select
            v-model="entrypoints"
            :items="contract.entrypoints"
            chips
            small-chips
            label="Entrypoints"
            multiple
            hide-details
          >
            <template v-slot:selection="{ item, index }">
              <v-chip small v-if="index < 1">
                <span>{{ item }}</span>
              </v-chip>
              <span
                v-if="index === 1 "
                class="grey--text caption"
              >(+{{ entrypoints.length - 1 }} others)</span>
            </template>
          </v-select>
        </v-col>
        <v-col class="my-3 d-flex align-start justify-end" cols="12" lg="2">
          <v-btn
            small
            text
            @click="showMempool = !showMempool"
            class="toolbar-btn"
            :disabled="contract.mempool === undefined || contract.mempool.length == 0"
          >
            <v-icon v-if="showMempool">mdi-minus-network-outline</v-icon>
            <v-icon v-else>mdi-plus-network-outline</v-icon>&nbsp;
            <span>Mempool</span>
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="operations !== undefined && operations.length > 0">
        <v-expansion-panels multiple popout tile>
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
      if (this.last_id === null) return [];
      if (this.showMempool) {
        return this.contract.operations
          .concat(this.contract.mempool)
          .sort(this.compareOperations);
      }

      return this.contract.operations;
    }
  },
  data: () => ({
    operationsLoading: true,
    mempoolLoading: true,
    showMempool: false,
    last_id: "",
    status: ["applied", "failed", "backtracked", "skipped"],
    from: "",
    fromModal: false,
    to: "",
    toModal: false,
    entrypoints: []
  }),
  created() {
    this.entrypoints = this.contract.entrypoints;
    this.fetchOperations();
  },
  methods: {
    ...mapActions(["showError"]),
    compareOperations(a, b) {
      if (a.level < b.level) {
        return -1;
      }
      if (a.level > b.level) {
        return 1;
      }
      return 0;
    },
    getOperations() {
      if (this.contract == null || this.contract.downloadedOperations) return;

      let entries =
        this.entrypoints.length != this.contract.entrypoints.length
          ? this.entrypoints.length
          : [];
      let status = this.status.length != 4 ? this.status : [];
      let dateTo = (this.to != "" ? dayjs(this.to).unix() * 1000 : 0) || 0;
      let dateFrom = (this.from != "" ? dayjs(this.from).unix() * 1000 : 0) || 0;
      getContractOperations(
        this.contract.network,
        this.contract.address,
        this.last_id,
        dateFrom,
        dateTo,
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
      if (this.contract == null) return;
      if (this.contract.mempool !== undefined) {
        this.mempoolLoading = false;
        return;
      }
      this.mempoolLoading = true;
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
    fetchOperations() {
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
    }
  },
  watch: {
    contract: "fetchOperations",
    status: function() {
      if (!this.operationsLoading) {
        this.operationsLoading = true;
        this.contract.downloadedOperations = false;
        this.contract.operations = [];
        this.last_id = null;
        this.getOperations();
      }
    },
    entrypoints: function() {
      if (!this.operationsLoading) {
        this.operationsLoading = true;
        this.contract.downloadedOperations = false;
        this.contract.operations = [];
        this.last_id = null;
        this.getOperations();
      }
    },
    from: function() {
      if (!this.operationsLoading) {
        this.operationsLoading = true;
        this.contract.downloadedOperations = false;
        this.contract.operations = [];
        this.last_id = null;
        this.getOperations();
      }
    },
    to: function() {
      if (!this.operationsLoading) {
        this.operationsLoading = true;
        this.contract.downloadedOperations = false;
        this.contract.operations = [];
        this.last_id = null;
        this.getOperations();
      }
    }
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>
