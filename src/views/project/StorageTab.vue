<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <v-card tile class="ma-3 pa-3" v-else-if="storage">
      <v-treeview :items="items" hoverable open-all transition class="storage">
        <template v-slot:label="{ item }">
          <span>{{ item.name }}:</span>&nbsp;
          <span :class="item.type">{{ item.value }}</span>
        </template>
        <template v-slot:prepend="{ item, open }">
          <v-tooltip v-if="item.type === 'value'" left>
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on">{{ getTreeNodeIcon(item.value_type) }}</v-icon>
            </template>
            <span>{{item.value_type}}</span>
          </v-tooltip>
          <v-icon small v-else-if="open">mdi-folder-open</v-icon>
          <v-icon small v-else>mdi-folder</v-icon>
        </template>
      </v-treeview>
    </v-card>
  </v-container>
</template>

<script>
import { getContractStorage } from "@/api/index.js";
import { getTree } from "@/utils/tree.js";

import dayjs from "dayjs";

export default {
  name: "StorageTab",
  props: {
    contract: Object
  },
  computed: {
    items() {
      return getTree(this.storage);
    }
  },
  data: () => ({
    storage: null,
    panel: 0,
    loading: true
  }),
  created() {
    this.getStorage(this.contract);
  },
  methods: {
    getValue(item) {
      if (item.type === undefined || item.value === undefined) {
        return item;
      }
      if (item.type === "mutez") {
        return this.$options.filters.uxtz(item.value);
      } else if (item.type === "timestamp") {
        if (isNaN(parseInt(item.value, 10))) {
          return dayjs(item.value).format("D MMMM YYYY");
        } else {
          return dayjs(item.value * 1000).format("D MMMM YYYY HH:mm");
        }
      }
      return item.value;
    },
    getStorage(contract) {
      if (contract == null) return;
      getContractStorage(contract.network, contract.address)
        .then(res => {
          this.storage = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    },
    getTreeNodeIcon(valueType) {
      if (valueType === "address") {
        return "mdi-alphabetical-variant";
      } else if (valueType === "nat" || valueType == "int") {
        return "mdi-numeric";
      } else if (valueType === "bool") {
        return "mdi-format-bold";
      } else if (valueType === "bytes") {
        return "mdi-hexadecimal";
      } else if (valueType === "timestamp") {
        return "mdi-clock-outline";
      } else if (valueType === "mutez") {
        return "mdi-cash-100";
      } else if (valueType === "contract") {
        return "mdi-file-document-outline";
      } else if (valueType === "key") {
        return "mdi-key";
      } else if (valueType === "lambda") {
        return "mdi-lambda";
      }
      return "mdi-alphabetical";
    }
  }
};
</script>


<style lang="scss" scoped>
.storage {
  font-size: 12px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: #6ba13b;
  }
  .object {
    color: #bbb;
  }
}
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>