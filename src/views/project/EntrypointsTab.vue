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
        <v-col cols="9">
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
                  <div v-if="schema">
                    <v-form>
                      <v-jsf v-model="model" :schema="schema"></v-jsf>
                      <div class="d-flex justify-space-between">
                        <v-btn
                          outlined
                          color="primary"
                          @click="loadData(selectedItem)"
                          :loading="loadingData"
                        >
                          <v-icon small left>mdi-code-braces</v-icon>build
                        </v-btn>
                        <div v-if="micheline">
                          <v-snackbar color="light-green darken-1" v-model="clipboard_ok">
                            Copied to clipboard!
                            <v-btn text @click="clipboard_ok = false">OK</v-btn>
                          </v-snackbar>
                          <v-btn
                            v-if="micheline"
                            v-clipboard="JSON.stringify(micheline)"
                            v-clipboard:success="onmichelineCopy"
                            small
                            depressed
                            class="toolbar-btn"
                          >
                            <v-icon class="mr-1" small>mdi-content-copy</v-icon>
                            <span class="overline">Copy one-liner</span>
                          </v-btn>
                          <v-btn small depressed class="toolbar-btn" @click="fullscreenData = true">
                            <v-icon class="mr-1" small>mdi-fullscreen</v-icon>
                            <span class="overline">Fullscreen</span>
                          </v-btn>
                          <v-btn
                            small
                            depressed
                            class="toolbar-btn"
                            @click="formatAsMichelson = !formatAsMichelson"
                          >
                            <v-icon
                              class="mr-1"
                              small
                            >{{ formatAsMichelson ? 'mdi-code-parentheses' : 'mdi-code-json' }}</v-icon>
                            <span
                              class="overline"
                            >{{ formatAsMichelson ? 'michelson' : 'micheline' }}</span>
                          </v-btn>
                        </div>
                      </div>
                    </v-form>
                    <v-expand-transition mode="out-in">
                      <div v-show="alertData || micheline || michelson" class="my-3">
                        <v-alert
                          v-if="alertData"
                          border="left"
                          dense
                          outlined
                          type="error"
                          dark
                        >{{ alertData }}</v-alert>
                        <vue-json-pretty
                          class="json-viewer"
                          v-else-if="micheline && !formatAsMichelson"
                          :data="micheline"
                          :highlightMouseoverNode="true"
                        ></vue-json-pretty>
                        <Michelson v-else-if="michelson && formatAsMichelson" :code="michelson"></Michelson>
                      </div>
                    </v-expand-transition>
                  </div>
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

      <v-dialog v-model="fullscreenData" fullscreen>
        <v-card>
          <v-card-title class="headline elevation-1" primary-title>
            <span>Entrypoint data</span>
            <v-spacer></v-spacer>
            <v-btn icon text @click="fullscreenData = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="mt-5">
            <vue-json-pretty v-if="micheline" :data="micheline" :highlightMouseoverNode="true"></vue-json-pretty>
          </v-card-text>
        </v-card>
      </v-dialog>
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

import VueJsonPretty from "vue-json-pretty";
import Michelson from "@/components/Michelson.vue";

export default {
  name: "EntrypointsTab",
  props: {
    contract: Object
  },
  components: {
    VueJsonPretty,
    Michelson
  },
  data: () => ({
    loading: true,
    loadingSchema: true,
    loadingData: false,
    model: {},
    schema: {},
    micheline: null,
    michelson: null,
    alertData: null,
    selected: -1,
    clipboard_ok: false,
    fullscreenData: false,
    formatAsMichelson: false
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
      if (
        this.contract == null ||
        this.contract.full_entrypoints !== undefined
      ) {
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
      if (
        this.contract == null ||
        this.contract.full_entrypoints === undefined
      ) {
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
        this.model,
        this.formatAsMichelson ? "michelson" : ""
      )
        .then(res => {
          if (!this.formatAsMichelson) {
            this.micheline = res;
          } else if (this.formatAsMichelson) {
            if (res instanceof String) {
              this.michelson = res;
            } else {
              this.michelson = String(res);
            }
          }
        })
        .catch(err => {
          this.alertData = err;
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
    },
    onmichelineCopy() {
      this.clipboard_ok = true;
    },
    loadData(item) {
      this.micheline = null;
      this.michelson = null;
      this.alertData = null;
      this.getData(item);
    }
  },
  watch: {
    contract: "getEntrypoints",
    selectedItem: function(newValue) {
      if (newValue === null) return;
      this.micheline = null;
      this.michelson = null;
      this.alertData = null;
      this.getSchema(newValue);
    },
    selectedTree() {
      this.openAllNodes();
    },
    formatAsMichelson() {
      if (
        (!this.formatAsMichelson && !this.micheline) ||
        (this.formatAsMichelson && !this.michelson)
      )
        this.getData();
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

.json-viewer {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  padding: 10px;
}

.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
  margin-right: 10px;
}
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>