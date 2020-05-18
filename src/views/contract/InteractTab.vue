<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="8 pr-4">
        <v-skeleton-loader v-if="loading" type="card-heading, image" />
        <div v-else-if="selectedItem">
          <v-card flat outlined>
            <v-card-title class="py-2 px-5 sidebar">
              <span class="hash secondary--text">{{ selectedItem.name }}</span>
            </v-card-title>
            <v-card-text class="pa-0 pt-1 data">
              <v-form class="pa-6 pr-4">
                <div v-if="selectedItem.schema">
                  <v-jsf v-model="model" :schema="selectedItem.schema"></v-jsf>
                </div>
                <v-btn
                  text
                  small
                  class="text--secondary mb-6"
                  @click="showSimulationSettings = !showSimulationSettings"
                >
                  Simulation settings
                  <v-icon v-if="showSimulationSettings" small class="ml-1">mdi-chevron-up</v-icon>
                  <v-icon v-else small class="ml-1">mdi-chevron-down</v-icon>
                </v-btn>
                <div v-show="showSimulationSettings">
                  <div class="d-flex flex-column pr-2">
                    <v-text-field outlined dense label="Source" placeholder="Tz address"></v-text-field>
                    <v-text-field
                      outlined
                      dense
                      label="Sender"
                      placeholder="Any address, equals to source by default"
                    ></v-text-field>
                    <v-text-field outlined dense label="Amount" placeholder="In mutez (10^-6 tez)"></v-text-field>
                  </div>
                </div>
                <div class="d-flex">
                  <v-btn
                    outlined
                    small
                    color="accent"
                    @click="simulateOperation()"
                    :loading="simulating"
                    :disabled="simulating || generating"
                  >
                    <v-icon small class="mr-1">mdi-play-circle-outline</v-icon>Simulate operation
                  </v-btn>
                  <v-btn
                    text
                    small
                    @click="generateParameters(formatAsMichelson, true)"
                    :loading="generating"
                    :disabled="simulating || generating"
                    class="ml-4"
                  >
                    <v-icon small class="mr-1">mdi-code-tags</v-icon>Generate parameters
                  </v-btn>
                </div>
              </v-form>
              <template v-if="paramsMicheline || paramsMichelson">
                <v-divider></v-divider>
                <div class="py-4 px-6 d-flex align-center">
                  <span class="title font-weight-regular">Parameters</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    text
                    class="mr-4 text--secondary"
                    @click="formatAsMichelson = !formatAsMichelson"
                  >
                    <v-icon
                      class="mr-1"
                      small
                    >{{ formatAsMichelson ? 'mdi-code-braces' : 'mdi-code-parentheses' }}</v-icon>
                    <span>switch to {{ formatAsMichelson ? 'michelson' : 'micheline' }}</span>
                  </v-btn>
                  <v-btn
                    class="text--secondary"
                    @click="() => {
                      $clipboard(formatAsMichelson ? paramsMichelson : JSON.stringify(paramsMicheline)); 
                      showClipboardOk = true
                    }"
                    small
                    text
                  >
                    <v-icon class="mr-1" small>mdi-content-copy</v-icon>
                    <span>Copy as string</span>
                  </v-btn>
                </div>
              </template>
              <v-expand-transition mode="out-in">
                <div v-show="alertData || paramsMicheline || paramsMichelson" class="pa-6 pt-0">
                  <v-alert v-if="alertData" type="error" prominent text class="ma-0">
                    <span class="text--primary">{{ alertData }}</span>
                  </v-alert>
                  <vue-json-pretty
                    class="json-viewer"
                    v-else-if="paramsMicheline && !formatAsMichelson"
                    :data="paramsMicheline"
                    :highlightMouseoverNode="true"
                  ></vue-json-pretty>
                  <v-card
                    flat
                    outlined
                    tile
                    v-else-if="paramsMichelson && formatAsMichelson"
                    class="pa-0"
                  >
                    <Michelson :code="paramsMichelson"></Michelson>
                  </v-card>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
      <v-col cols="4" class="pl-4">
        <v-skeleton-loader
          v-if="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        ></v-skeleton-loader>
        <v-card v-else flat outlined>
          <v-navigation-drawer floating permanent width="500" style="max-height: 80vh;">            
            <v-expansion-panels
              flat
              accordion
              mandatory
              active-class="entrypoint-selected"
              v-model="selected"
            >
              <v-expansion-panel
                v-for="(item, i) in entrypoints"
                :key="i"
                :class="i > 0 ? 'bt-1' : ''"
                class="entrypoint-panel"
              >
                <v-expansion-panel-header>
                  <div class="d-flex">
                    <span class="hash">{{ item.name }}</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex flex-column parameters">
                    <div v-for="(def, i) in item.typedef" :key="i" class="mb-2">
                      <span v-if="i === 0">parameter&nbsp;</span>
                      <span v-else-if="def.name">{{ def.name }}&nbsp;</span>
                      <span class="tree--text" v-html="highlightType(def.type)"></span>
                      <div v-for="(arg, j) in def.args" :key="i + j" class="pl-4">
                        <span>{{ arg.key }}&nbsp;</span>
                        <span class="tree--text" v-html="highlightType(arg.value)"></span>
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
    <v-snackbar color="light-green darken-1" v-model="showClipboardOk" :timeout="2000" top>
      Copied to clipboard!
      <v-btn text @click="showClipboardOk = false">OK</v-btn>
    </v-snackbar>
    <v-dialog v-model="showResultOPG" width="1200">
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center pa-4">
          <span class="title text--secondary">Simulation result</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="showResultOPG = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <InternalOperation :data="simulatedOperation" />
          <template v-for="(intop, intid) in simulatedOperation.internal_operations">
            <v-divider :key="'divider' + intid"></v-divider>
            <InternalOperation :data="intop" :mainOperation="op" :key="intid" />
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import VueJsonPretty from "vue-json-pretty";
import Michelson from "@/components/Michelson.vue";
import InternalOperation from "@/components/InternalOperation.vue";

export default {
  name: "InteractTab",
  props: {
    address: String,
    network: String
  },
  components: {
    VueJsonPretty,
    Michelson,
    InternalOperation
  },
  data: () => ({
    loading: true,
    entrypoints: [],
    selected: -1,
    generating: false,
    simulating: false,
    model: {},
    formatAsMichelson: false,
    paramsMicheline: null,
    paramsMichelson: null,
    simulatedOperation: {},
    alertData: null,
    showClipboardOk: false,
    showResultOPG: false,
    showSimulationSettings: false
  }),
  computed: {
    selectedItem() {
      if (this.selected < 0 || this.entrypoints.length < this.selected)
        return null;
      return this.entrypoints[this.selected];
    }
  },
  created() {
    this.getEntrypoints();
  },
  methods: {
    ...mapActions(["showError"]),
    getEntrypoints() {
      this.loading = true;
      this.api
        .getContractEntrypoints(this.network, this.address)
        .then(res => {
          if (!res) return;
          this.entrypoints = res.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
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
    generateParameters(formatAsMichelson = false, overwrite = false) {
      if (this.generating || !this.selectedItem) return;
      if (this.paramsMichelson && formatAsMichelson && !overwrite) return;
      if (this.paramsMicheline && !formatAsMichelson && !overwrite) return;

      this.generating = true;
      this.api
        .getContractEntrypointData(
          this.network,
          this.address,
          this.selectedItem.bin_path,
          this.model,
          formatAsMichelson ? "michelson" : ""
        )
        .then(res => {
          if (!formatAsMichelson) {
            this.paramsMicheline = res;
          } else if (formatAsMichelson) {
            if (res instanceof String) {
              this.paramsMichelson = res;
            } else {
              this.paramsMichelson = String(res);
            }
          }
        })
        .catch(err => {
          this.alertData = err;
        })
        .finally(() => (this.generating = false));
    },
    simulateOperation() {
      if (this.simulating || !this.selectedItem) return;
      this.simulating = true;
      this.api
        .getContractEntrypointTrace(
          this.network,
          this.address,
          this.selectedItem.bin_path,
          this.model
        )
        .then(res => {
          if (res) {
            this.simulatedOperation = res[0];
            if (res.length > 1) {
              this.simulatedOperation.internal_operations = res.slice(1);
            }
            console.log(this.simulatedOperation);
            this.showResultOPG = true;
          }
        })
        .catch(err => {
          this.alertData = err;
        })
        .finally(() => (this.simulating = false));
    },
    highlightType(expr) {
      return expr.replace(/(\$\w+)/g, '<span class="accent--text">$1</span>');
    }
  },
  watch: {
    address: "getEntrypoints",
    selectedItem: function(newValue) {
      if (newValue === null) return;
      this.paramsMicheline = null;
      this.paramsMichelson = null;
      this.alertData = null;
      this.model = Object.assign({}, newValue.default_model);
    },
    formatAsMichelson(newValue) {
      this.generateParameters(newValue, false);
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
.parameters {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: var(--v-tree-base);
  }
}

.json-viewer {
  max-height: 400px;
  overflow-y: auto;
  background: var(--v-canvas-base);
  padding: 15px;
}

.entrypoint-panel > .v-expansion-panel-header {
  background-color: var(--v-sidebar-base);
}

.v-expansion-panel.entrypoint-selected {
  background-color: var(--v-data-base);
  & > .v-expansion-panel-header {
    background-color: var(--v-data-base);
  }
}
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
.vjs-tree.is-mouseover {
  background-color: #99999930;
}
</style>