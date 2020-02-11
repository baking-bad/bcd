<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="my-3"></v-skeleton-loader>
    <div v-else-if="operations.length > 0">
      <template v-for="(item, idx) in operations">
        <Operation :data="item" :key="idx" class="my-3" :address="contract.address" />
      </template>
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

export default {
  name: "OperationsTab",
  props: {
    contract: Object
  },
  components: {
    Operation
  },
  data: () => ({
    loading: true,
    downloaded: false,
    operations: [],
    offset: 0
  }),
  mounted() {
    this.getOperations(this.contract);
  },
  methods: {
    getOperations(contract) {
      if (contract == null || contract === undefined) return;
      if (!this.downloaded) {
        getContractOperations(contract.network, contract.address, this.offset)
          .then(res => {
            this.prepareOperations(res);
            this.downloaded = res.length == 0;
            this.offset += res.length;
          })
          .catch(err => console.log(err))
          .finally(() => (this.loading = false));
      }
    },
    prepareOperations(data) {
      data.forEach(element => {
        if (element.internal) {
          this.operations[this.operations.length - 1].internal_operations.push(element);
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
    }
  },
  watch: {
    contract: function(value, old) {
      if (old != null && value.address == old.address) return;
      this.operations = [];
      this.offset = 0;
      this.getOperations(value);
    }
  }
};
</script>