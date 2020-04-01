<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="ma-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="ma-3"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" height="123" type="image" class="ma-3"></v-skeleton-loader>
    <v-card class="ma-3 transparent" v-else-if=" contract.full_entrypoints.length > 0">
      <v-expansion-panels focusable tile hover accordion v-model="panel">
        <v-expansion-panel v-for="(item, idx) in contract.full_entrypoints" :key="item.miguel_name">
          <v-expansion-panel-header ripple class="hash">
            <span>{{ item.miguel_name }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="white">
            <div class="d-flex flex-column py-5 parameters">
              <div>
                <span class="overline ml-3">Parameter</span>&nbsp;
                <span class="primary--text">{{ item.miguel_type }}</span>
              </div>
              <v-treeview
                :ref="'tree-' + idx"
                v-if="showTree(item.miguel_parameters)"
                :items="tree(item.miguel_parameters)"
                hoverable
                open-all
                transition
                open-on-click
              >
                <template v-slot:label="{ item }">
                  <span>{{ item.name }}</span>&nbsp;
                  <span
                    :class="item.type === 'value' ? 'primary--text': 'grey--text'"
                  >{{ item.value }}</span>
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
import { mapActions } from "vuex";

import { getContractEntrypoints } from "@/api/index.js";
import { getEntrypointTree } from "@/utils/tree.js";

export default {
  name: "EntrypointsTab",
  props: {
    contract: Object
  },
  data: () => ({
    panel: 0,
    loading: true
  }),
  created() {
    this.getEntrypoints();
  },
  methods: {
    ...mapActions(["showError"]),
    tree(data) {
      return getEntrypointTree(data);
    },
    getEntrypoints() {
      if (this.contract == null) return;
      if (this.contract.full_entrypoints !== undefined) {
        this.loading = false;
        return;
      }
      getContractEntrypoints(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
          this.contract.full_entrypoints = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    showTree(parameters) {
      return (
        parameters !== undefined &&
        parameters !== null &&
        Object.keys(parameters).length > 1
      );
    }
  },
  watch: {
    contract: "getEntrypoints",
    panel: function(newValue) {
      let tree = this.$refs["tree-" + newValue];
      if (tree) {
        this.$nextTick(() => {
          tree[0].updateAll(true);
        });
      }
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