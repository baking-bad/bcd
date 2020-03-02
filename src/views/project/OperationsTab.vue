<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <div v-else-if="allOperations.length > 0">
      <v-toolbar flat class="mb-5 transparent">
        <v-spacer></v-spacer>
        <v-btn small text @click="sortAsc = !sortAsc" class="toolbar-btn">
          <v-icon v-if="!sortAsc">mdi-sort-ascending</v-icon>
          <v-icon v-else>mdi-sort-descending</v-icon>&nbsp;
          <span>Sorting</span>
        </v-btn>
        <v-btn
          small
          text
          @click="showMempool = !showMempool"
          class="toolbar-btn"
          :disabled="mempool.length == 0"
        >
          <v-icon v-if="showMempool">mdi-minus-network-outline</v-icon>
          <v-icon v-else>mdi-plus-network-outline</v-icon>&nbsp;
          <span>Mempool</span>
        </v-btn>
      </v-toolbar>
      <v-expansion-panels multiple popout tile>
        <template v-for="(item) in allOperations">
          <Operation :data="item" :key="item.hash + String(item.counter)" :address="$route.params.address" />
        </template>
      </v-expansion-panels>
      <span v-intersect="onDownloadPage"></span>
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
import Operation from "@/components/Operation.vue";
import { getContractOperations } from "@/api/index.js";
import { getContractMempool } from "@/api/index.js";

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
      return this.operationsLoading && this.mempoolLoading;
    },
    allOperations() {
      if (this.loading) return [];

      if (!this.showMempool) {
        let res = this.operations.slice();
        if (this.sortAsc) return res.reverse();
        return res;
      }

      if (!this.sortAsc)
        return this.operations
          .concat(this.mempool)
          .sort(this.compareOperations)
          .reverse();

      return this.operations.concat(this.mempool).sort(this.compareOperations);
    }
  },
  data: () => ({
    operationsLoading: true,
    mempoolLoading: true,
    downloaded: false,
    operations: [],
    mempool: [],
    showMempool: false,
    sortAsc: false,
    last_id: ""
  }),
  created() {
    this.fetchOperations();
  },
  methods: {
    compareOperations(a, b) {
      let d1 = dayjs(a.timestamp);
      let d2 = dayjs(b.timestamp);
      if (d1.isBefore(d2)) {
        return -1;
      }
      if (d1.isAfter(d2)) {
        return 1;
      }
      return 0;
    },
    getOperations() {
      if (!this.downloaded) {
        getContractOperations(
          this.$route.params.network,
          this.$route.params.address,
          this.last_id
        )
          .then(res => {
            this.prepareOperations(res.operations);
            this.downloaded = res.operations.length == 0;
            this.last_id = res.last_id;
          })
          .catch(err => console.log(err))
          .finally(() => (this.operationsLoading = false));
      }
    },
    getMempool() {
      this.mempoolLoading = true;
      getContractMempool(this.$route.params.network, this.$route.params.address)
        .then(res => {
          this.mempool = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.mempoolLoading = false));
    },
    prepareOperations(data) {
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
    onDownloadPage(entries) {
      if (entries[0].isIntersecting) {
        this.getOperations(this.contract);
      }
    },
    fetchOperations() {
      this.operations = [];
      this.mempool = [];
      this.offset = 0;
      this.operationsLoading = true;
      this.mempoolLoading = true;
      this.downloaded = false;
      this.getOperations();
      this.getMempool();
    }
  },
  watch: {
    $route: "fetchOperations"
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>