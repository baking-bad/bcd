<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <div v-else-if="operations !== undefined && operations.length > 0">
      <v-toolbar flat class="mb-5 transparent">
        <v-spacer></v-spacer>
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
      </v-toolbar>
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
      <v-icon size="100">mdi-chat-sleep-outline</v-icon>
      <span class="headline">No operations yet</span>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import Operation from "@/components/Operation.vue";
import { getContractOperations, getContractMempool } from "@/api/index.js";

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
    last_id: ""
  }),
  created() {
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

      getContractOperations(
        this.contract.network,
        this.contract.address,
        this.last_id
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
    contract: "fetchOperations"
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>