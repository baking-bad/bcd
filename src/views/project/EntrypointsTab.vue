<template>
  <v-container fluid>
    <v-skeleton-loader :loading="loading" height="300" type="image, image, image" class="ma-3">
      <v-row v-if="contract && contract.full_entrypoints && contract.full_entrypoints.length > 0">
        <v-col cols="3">
          <v-list elevation="2" class="py-0">
            <v-list-item-group v-model="selected" mandatory color="primary">
              <template v-for="(item, i) in contract.full_entrypoints">
                <v-divider :key="`${i}-divider`" v-if="i != 0" />
                <v-list-item :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.miguel_name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col>
          <div v-if="selectedItem">
            <v-card>
              <v-card-text>
                <div class="d-flex flex-column parameters">
                  <div>
                    <span class="overline ml-3">Parameter</span>&nbsp;
                    <span class="primary--text">{{ selectedItem.miguel_type }}</span>
                  </div>
                  <v-treeview
                    ref="tree"
                    :items="selectedTree"
                    @input="openAllNodes"
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
              </v-card-text>
            </v-card>
            <v-card class="mt-6">
              <v-card-text>
                <div class="px-3">
                  <div class="mb-3">
                    <span class="overline">builder</span>&nbsp;
                  </div>
                  <v-overlay absolute :value="loadingSchema">
                    <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
                  </v-overlay>
                  <v-form v-if="schema">
                    <v-jsf v-model="model" :schema="schema"></v-jsf>
                    <v-btn outlined color="primary" @click="getData">
                      <v-icon small left>mdi-code-braces</v-icon>build
                    </v-btn>
                  </v-form>
                  <v-card
                    v-else
                    class="d-flex flex-column align-center justify-center my-6 transparent"
                    outlined
                    flat
                  >
                    <v-icon size="50" color="grey">mdi-code-braces</v-icon>
                    <span class="title grey--text">Void parameters</span>
                  </v-card>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-card
        v-else
        class="d-flex flex-column align-center justify-center mt-12 transparent"
        :elevation="0"
      >
        <v-icon size="100">mdi-chat-sleep-outline</v-icon>
        <span class="headline">Entrypoints are not found</span>
      </v-card>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import {
  getContractEntrypoints,
  getContractEntrypointSchema,
  getContractEntrypointData
} from "@/api/index.js";
import { getEntrypointTree } from "@/utils/tree.js";

export default {
  name: "EntrypointsTab",
  props: {
    contract: Object
  },
  data: () => ({
    loading: true,
    loadingSchema: true,
    loadingData: false,
    model: {},
    schema: {},
    entrypointData: null,
    selected: -1
  }),
  computed: {
    selectedItem() {
      if (this.selected < 0) return null;
      if (
        this.contract === null ||
        this.contract.full_entrypoints === undefined ||
        this.contract.full_entrypoints.length < this.selected
      ) {
        return null;
      }
      return this.contract.full_entrypoints[this.selected];
    },
    selectedTree() {
      if (this.selectedItem == null) return [];
      return this.tree(this.selectedItem.miguel_parameters);
    }
  },
  created() {
    this.getEntrypoints();
  },
  methods: {
    ...mapActions(["showError"]),
    tree(data) {
      return getEntrypointTree(data);
    },
    getEntrypoints() {
      this.loading = true;
      this.loadingSchema = true;
      if (this.contract == null || this.contract.full_entrypoints !== undefined) {
        this.loading = false;
        this.loadingSchema = false;
        return;
      }
      getContractEntrypoints(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
          this.contract.full_entrypoints = res;
          this.selected = 0;
          return getContractEntrypointSchema(
            this.contract.network,
            this.contract.address,
            this.contract.full_entrypoints[0].miguel_path
          );
        })
        .then(res => {
          this.schema = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
          this.loadingSchema = false;
        });
    },
    getSchema(item) {
      this.loadingSchema = true;
      if (this.contract == null || this.contract.full_entrypoints === undefined) {
        this.loadingSchema = false;
        return;
      }
      getContractEntrypointSchema(
        this.contract.network,
        this.contract.address,
        item.miguel_path
      )
        .then(res => {
          this.schema = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loadingSchema = false));
    },
    getData() {
      this.loadingData = true;
      if (
        this.contract == null ||
        this.contract.full_entrypoints === undefined
      ) {
        this.loadingData = false;
        return;
      }
      getContractEntrypointData(
        this.contract.network,
        this.contract.address,
        this.selectedItem.miguel_path,
        this.model
      )
        .then(res => {
          this.entrypointData = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loadingData = false));
    },
    showTree(parameters) {
      return (
        parameters !== undefined &&
        parameters !== null &&
        Object.keys(parameters).length > 1
      );
    },
    openAllNodes() {
      let tree = this.$refs["tree"];
      if (tree) {
        this.$nextTick(() => {
          tree.updateAll(true);
        });
      }
    }
  },
  watch: {
    contract: "getEntrypoints",
    selectedItem: function(newValue) {
      if (newValue === null) return;
      this.getSchema(newValue);
    },
    selectedTree() {
      this.openAllNodes();
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