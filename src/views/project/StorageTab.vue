<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <v-card tile class="ma-3 pa-3" v-else-if="storage">
      <v-treeview :items="items" hoverable open-all transition class="storage">
        <template v-slot:label="{ item }">
          <span>{{ item.name }}:</span>&nbsp;
          <span :class="item.type">{{ item.value }}</span>
        </template>
      </v-treeview>
    </v-card>
  </v-container>
</template>

<script>
import { getContractStorage } from "@/api/index.js";
import dayjs from "dayjs";

export default {
  name: "StorageTab",
  props: {
    contract: Object
  },
  computed: {
    items() {
      return this.getTreeObject(this.storage);
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
    getTreeObject(data) {
      let res = [];
      for (const x in data) {
        let item = {
          name: x,
          children: [],
          value: "null",
          type: "value"
        };
        if (typeof data[x] === "object") {
          if (data[x] != null) {
            if (data[x].type !== undefined) {
              item.value = this.getValue(data[x]);
            } else {
              if (Array.isArray(data[x])) item.value = `list`;
              else item.value = `${Object.keys(data[x]).length} items`;
              item.type = "object";
              item.children = this.getTreeObject(data[x]);
            }
          }
        } else {
          item.value = data[x];
        }
        res.push(item);
      }
      return res;
    },
    getStorage(contract) {
      if (contract == null) return;
      getContractStorage(contract.network, contract.address)
        .then(res => {
          this.storage = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
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