<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="ma-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="ma-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="ma-3"></v-skeleton-loader>
    <v-card class="ma-3 transparent" v-else-if="entrypoints.length > 0">
      <v-expansion-panels focusable tile hover accordion v-model="panel">
        <v-expansion-panel v-for="(item,i) in entrypoints" :key="i">
          <v-expansion-panel-header ripple class="hash">{{ item.name }}</v-expansion-panel-header>
          <v-expansion-panel-content color="white">
            <div class="d-flex flex-column py-5 parameters">
              <span class="overline ml-3">Parameter</span>
              <v-treeview :items="getTreeObject(item.parameters)" hoverable open-all transition>
                <template v-slot:label="{ item }">
                  <span>{{ item.name }}:</span>&nbsp;
                  <span :class="item.type">{{ item.value }}</span>
                </template>
              </v-treeview>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card
      v-else
      class="d-flex flex-column align-center justify-center mt-12 transparent"
      :elevation="0"
    >
      <v-icon size="100">mdi-chat-sleep-outline</v-icon>
      <span class="headline">Entrypoints are not found</span>
    </v-card>
  </v-container>
</template>

<script>
import { getContractEntrypoints } from "@/api/index.js";

export default {
  name: "EntrypointsTab",
  props: {
    contract: Object
  },
  data: () => ({
    entrypoints: [],
    panel: 0,
    loading: true
  }),
  created() {
    this.getEntrypoints(this.contract);
  },
  methods: {
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
              item.value = data[x].type;
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
    getEntrypoints(contract) {
      if (contract == null) return;
      getContractEntrypoints(contract.network, contract.address)
        .then(res => {
          this.entrypoints = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style lang="scss" scoped>
.parameters {
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