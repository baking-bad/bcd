<template>
  <v-container fluid>
    <v-skeleton-loader :loading="loading" height="300" type="image, image, image">
      <v-row v-if="contract && contract.full_entrypoints && contract.full_entrypoints.length > 0">
        <v-col cols="8">
          <div v-if="selectedItem">
            <v-card tile elevation="2">
              <v-card-title class="builder-title py-2 px-5" primary-title>
                <span class="hash">
                  <span v-if="contract.alias">{{ contract.alias }}::</span>
                  {{ selectedItem.name }}()
                </span>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-form class="pa-5 pr-3">
                  <div v-if="selectedItem.schema">
                    <v-jsf v-model="model" :schema="selectedItem.schema"></v-jsf>
                  </div>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn
                      class="mr-4"
                      outlined
                      dense
                      small
                      color="primary"
                      @click="loadData()"
                      :loading="loadingData"
                      :disabled="loadingData || isRunCode"
                    >Build parameters</v-btn>
                    <v-btn
                      class="mr-2"
                      outlined
                      dense
                      small
                      color="primary"
                      @click="runCode()"
                      :loading="isRunCode"
                      :disabled="loadingData || isRunCode"
                    >Simulate</v-btn>
                  </div>
                </v-form>
                <v-divider></v-divider>
                <div v-if="micheline" class="pa-5 pb-0 d-flex">
                  <v-btn
                    small
                    depressed
                    class="toolbar-btn mr-4"
                    @click="formatAsMichelson = !formatAsMichelson"
                  >
                    <v-icon
                      class="mr-1"
                      small
                    >{{ formatAsMichelson ? 'mdi-code-braces' : 'mdi-code-parentheses' }}</v-icon>
                    <span
                      class="overline"
                    >switch to {{ formatAsMichelson ? 'michelson' : 'micheline' }}</span>
                  </v-btn>
                  <v-snackbar color="light-green darken-1" v-model="clipboard_ok" top>
                    Copied to clipboard!
                    <v-btn text @click="clipboard_ok = false">OK</v-btn>
                  </v-snackbar>
                  <v-btn
                    v-if="micheline && formatAsMichelson"
                    v-clipboard="JSON.stringify(micheline)"
                    v-clipboard:success="onmichelineCopy"
                    small
                    depressed
                    class="toolbar-btn"
                  >
                    <v-icon class="mr-1" small>mdi-content-copy</v-icon>
                    <span class="overline">Copy as string</span>
                  </v-btn>
                  <v-btn
                    v-if="!formatAsMichelson"
                    small
                    depressed
                    class="toolbar-btn"
                    @click="fullscreenData = true"
                  >
                    <v-icon class="mr-1" small>mdi-fullscreen</v-icon>
                    <span class="overline">Fullscreen</span>
                  </v-btn>
                </div>
                <v-expand-transition mode="out-in">
                  <div v-show="alertData || micheline || michelson" class="pa-5">
                    <v-alert
                      v-if="alertData"
                      border="left"
                      dense
                      outlined
                      type="error"
                      dark
                      class="ma-0"
                    >{{ alertData }}</v-alert>
                    <vue-json-pretty
                      class="json-viewer"
                      v-else-if="micheline && !formatAsMichelson"
                      :data="micheline"
                      :highlightMouseoverNode="true"
                    ></vue-json-pretty>
                    <v-card
                      flat
                      outlined
                      tile
                      v-else-if="michelson && formatAsMichelson"
                      class="pa-3"
                    >
                      <Michelson :code="michelson"></Michelson>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
        <v-col cols="4">
          <v-card elevation="1">
            <v-navigation-drawer floating permanent width="500" style="max-height: 85vh;">
              <v-expansion-panels
                flat
                accordion
                mandatory
                active-class="entrypoint-selected"
                v-model="selected"
              >
                <v-expansion-panel
                  v-for="(item, i) in contract.full_entrypoints"
                  :key="i"
                  class="entrypoint-panel"
                >
                  <v-expansion-panel-header>
                    <div class="d-flex">
                      <span class="hash">{{ item.name }}</span>
                      <v-icon class="ml-auto mr-4" v-if="callStat[item.name]" small>mdi-clock-fast</v-icon>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex flex-column parameters">
                      <div v-for="(def, i) in item.typedef" :key="i" class="mb-2">
                        <span v-if="i === 0">parameter&nbsp;</span>
                        <span v-else-if="def.name">{{ def.name }}&nbsp;</span>
                        <span class="primary--text" v-html="highlightType(def.type)"></span>
                        <div v-for="(arg, j) in def.args" :key="i + j" class="pl-4">
                          <span>{{ arg.key }}&nbsp;</span>
                          <span class="primary--text" v-html="highlightType(arg.value)"></span>
                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-navigation-drawer>
          </v-card>
        </v-col>
      </v-row>
      <v-card
        v-else
        class="d-flex flex-column align-center justify-center mt-12 transparent"
        :elevation="0"
      >
        <v-icon size="100">mdi-chat-sleep-outline</v-icon>
        <span class="headline">Failed to fetch entrypoints</span>
      </v-card>

      <v-dialog v-model="fullscreenData" fullscreen>
        <v-card>
          <v-card-title class="headline" primary-title>
            <span>Operation parameters</span>
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

      <v-dialog v-model="showOPG">
        <v-card>
          <v-card-title class="headline" primary-title>
            <span>Result of code execution</span>
            <v-spacer></v-spacer>
            <v-btn icon text @click="showOPG = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="ma-0 pa-0">
            <OPG :newOPG="traceOperations" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import VueJsonPretty from "vue-json-pretty";
import Michelson from "@/components/Michelson.vue";
import OPG from "@/views/OPG.vue";

export default {
  name: "EntrypointsTab",
  props: {
    contract: Object
  },
  components: {
    VueJsonPretty,
    Michelson,
    OPG
  },
  data: () => ({
    loading: true,
    loadingData: false,
    isRunCode: false,
    model: {},
    callStat: {},
    micheline: null,
    michelson: null,
    alertData: null,
    selected: -1,
    clipboard_ok: false,
    fullscreenData: false,
    formatAsMichelson: false,
    showOPG: false,
    traceOperations: null
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
    }
  },
  created() {
    this.callStat = {};
    this.fetchCallStat(this.contract.operations);
    this.getEntrypoints();
  },
  methods: {
    ...mapActions(["showError"]),
    fetchCallStat(operations) {
      if (operations) {
        for (var i = 0; i < operations.length; i++) {
          const entry = operations[i].entrypoint;
          if (entry && operations[i].destination === this.contract.address) {
            if (entry in this.callStat) {
              this.callStat[entry] += 1;
            } else {
              this.callStat[entry] = 1;
            }
          }
          this.fetchCallStat(operations[i].internal_operations);
        }
      }
    },
    sortEntrypoints(entrypoints) {
      const stat = this.callStat;
      return entrypoints.sort(function(a, b) {
        const d = (stat[b.name] || 0) - (stat[a.name] || 0);
        if (d === 0) {
          return a.name.localeCompare(b.name);
        } else {
          return d;
        }
      });
    },
    getEntrypoints() {
      this.loading = true;
      if (
        this.contract == null ||
        this.contract.full_entrypoints !== undefined
      ) {
        this.loading = false;
        if (this.contract.full_entrypoints) {
          this.contract.full_entrypoints = this.sortEntrypoints(
            this.contract.full_entrypoints
          );
        }
        return;
      }
      this.api
        .getContractEntrypoints(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
          this.contract.full_entrypoints = this.sortEntrypoints(res);
          this.selected = 0;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
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

      this.api
        .getContractEntrypointData(
          this.contract.network,
          this.contract.address,
          this.selectedItem.bin_path,
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
    onmichelineCopy() {
      this.clipboard_ok = true;
    },
    loadData() {
      this.micheline = null;
      this.michelson = null;
      this.alertData = null;
      this.getData();
    },
    highlightType(expr) {
      return expr.replace(/(\$\w+)/g, '<span class="purple--text">$1</span>');
    },
    runCode() {
      this.isRunCode = true;
      if (
        this.contract == null ||
        this.contract.full_entrypoints === undefined
      ) {
        this.isRunCode = false;
        return;
      }

      this.traceOperations = null;
      this.api
        .getContractEntrypointTrace(
          this.contract.network,
          this.contract.address,
          this.selectedItem.bin_path,
          this.model
        )
        .then(res => {
          this.traceOperations = res;
          this.showOPG = true;
        })
        .catch(err => {
          this.alertData = err;
        })
        .finally(() => (this.isRunCode = false));
    }
  },
  watch: {
    contract: "getEntrypoints",
    selectedItem: function(newValue) {
      if (newValue === null) return;
      this.micheline = null;
      this.michelson = null;
      this.alertData = null;
    },
    formatAsMichelson() {
      if (
        (!this.formatAsMichelson && !this.micheline) ||
        (this.formatAsMichelson && !this.michelson)
      ) {
        this.getData();
      }
    }
  }
};
</script>

<style>
.v-btn-toggle {
  flex-direction: column;
}
</style>

<style lang="scss" scoped>
.builder-title {
  border-bottom: 1px solid #ddd;
  background: rgb(250, 250, 250);
}

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
  border: 1px solid #ddd;
  padding: 15px;
}

.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
  margin-right: 10px;
}

.entrypoint-panel {
  border-bottom: 1px solid #eee;
}
.v-expansion-panel.entrypoint-selected {
  background-color: rgb(250, 250, 250);
}

.v-dialog > .v-card > .v-card__title {
  position: sticky;
  top: 0;
  z-index: 999;
  background: white;
  border-bottom: 1px solid #eee;
}
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>