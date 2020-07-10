<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="8 pr-4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <v-card flat outlined v-if="selectedItem">
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
                    <v-text-field
                      v-model="settings.source"
                      outlined
                      dense
                      label="Source"
                      placeholder="Tz address"
                    ></v-text-field>
                    <v-text-field
                      v-model="settings.sender"
                      outlined
                      dense
                      label="Sender (optional)"
                      placeholder="KT address, allows to simulate internal operation"
                    ></v-text-field>
                  </div>
                </div>
                <v-text-field
                  id="amount"
                  v-model="settings.amount"
                  outlined
                  dense
                  label="Transaction amount"
                  type="number"
                  placeholder="In mutez (10^-6 tez)"
                  class="mr-2"
                ></v-text-field>
                <div class="d-flex">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined :loading="execution" color="accent" v-bind="attrs" v-on="on">
                        <span>Execute</span>
                        <v-icon small class="ml-1">mdi-creation</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in executeActions"
                        :key="index"
                        @click="item.callback()"
                      >
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                        <v-list-item-avatar>
                          <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-form>
              <div v-show="alertData" class="pa-6 pt-0">
                <v-alert type="error" prominent text class="ma-0">
                  <span class="text--primary">{{ alertData }}</span>
                </v-alert>
              </div>
              <div v-show="injectedOpHash" class="pa-6 pt-0">
                <v-alert type="success" prominent text class="ma-0">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text--primary">Operation has been sucessfully injected</span>
                    <v-btn
                      text
                      class="text--secondary hash"
                      style="text-transform: none;"
                      :to="`/${network}/opg/${injectedOpHash}`"
                      target="_blank"
                    ><span v-html="helpers.shortcut(injectedOpHash)"></span></v-btn>
                  </div>
                </v-alert>
              </div>
            </v-card-text>
          </v-card>
          <div v-else></div>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="4" class="pl-4">
        <v-skeleton-loader
          :loading="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        >
          <v-card flat outlined style="max-width: 500px;">
            <v-navigation-drawer floating permanent style="max-height: 80vh; width: 100%;">
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
                        <span v-if="i === 0" class="font-weight-light">parameter&nbsp;</span>
                        <span v-else-if="def.name" class="font-weight-light">{{ def.name }}&nbsp;</span>
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
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-dialog v-model="showResultOPG" width="1200" scrollable>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center pa-4">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Simulation result</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="showResultOPG = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <InternalOperation :data="simulatedOperation" />
          <template v-for="(intop, intid) in simulatedOperation.internal_operations">
            <v-divider :key="'divider' + intid"></v-divider>
            <InternalOperation :data="intop" :mainOperation="simulatedOperation" :key="intid" />
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCmdline" width="800" scrollable>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center pa-4">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Tezos-client</span>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-4 text--secondary"
            v-clipboard="() => (tezosClientCmdline)"
            v-clipboard:success="showClipboardOK"
            text
          >
            <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
          </v-btn>
          <v-btn icon small @click="showCmdline = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <pre>{{ tezosClientCmdline }}</pre>
        </v-card-text>
      </v-card>
    </v-dialog>
    <RawJsonViewer :show.sync="showRawJSON" :raw="parametersJSON" />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { Tezos } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { ThanosWallet } from "@thanos-wallet/dapp";

import InternalOperation from "@/components/InternalOperation.vue";
import RawJsonViewer from "@/components/RawJsonViewer.vue";

export default {
  name: "InteractTab",
  props: {
    address: String,
    network: String
  },
  components: {
    InternalOperation,
    RawJsonViewer
  },
  data: () => ({
    loading: true,
    execution: false,
    entrypoints: [],
    selected: -1,
    model: {},
    settings: {
      source: null,
      sender: null,
      amount: null
    },
    executeActions: [],
    alertData: null,
    parametersJSON: null,
    simulatedOperation: {},
    tezosClientCmdline: null,
    injectedOpHash: null,
    showRawJSON: false,
    showCmdline: false,
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
    this.getEntrypoints(this.$route.query.entrypoint);

    this.executeActions = [
      {
        text: "Simulate",
        icon: "mdi-play-circle-outline",
        callback: () => this.simulateOperation()
      },
      {
        text: "Raw JSON",
        icon: "mdi-code-json",
        callback: () => this.generateParameters(true, true)
      },
      {
        text: "Tezos-client",
        icon: "mdi-console-line",
        callback: () => this.generateParameters(false, true)
      },
      {
        text: "Beacon",
        icon: "mdi-lighthouse",
        callback: async () => this.callContract("beacon")
      }
    ];

    ThanosWallet.isAvailable()
      .then(available => {
        if (available) {
          this.executeActions.push({
            text: "Thanos",
            icon: "mdi-hand-right",
            callback: async () => this.callContract("thanos")
          });
        }
      })
      .catch(err => console.log(err));
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    getEntrypoints(selectedName = undefined) {
      this.loading = true;
      this.api
        .getContractEntrypoints(this.network, this.address)
        .then(res => {
          if (!res) return;
          this.entrypoints = res.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          const idx = this.entrypoints.findIndex(
            element => element.name === selectedName
          );
          this.selected = Math.max(0, idx);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    generateParameters(rawJSON = false, show = false) {
      if (this.execution || !this.selectedItem) return;

      this.execution = true;

      return this.api
        .getContractEntrypointData(
          this.network,
          this.address,
          this.selectedItem.bin_path,
          this.model,
          rawJSON ? "" : "michelson"
        )
        .then(res => {
          if (rawJSON) {
            this.parametersJSON = res;
            if (show) this.showRawJSON = true;
          } else {
            const arg = String(res).replace(/\n|\s+/gm, " ");
              this.tezosClientCmdline = `
              transfer ${this.settings.amount || 0} 
              from ${this.settings.source || "%YOUR_ADDRESS%"} 
              to ${this.address} 
              --entrypoint '${this.selectedItem.name}' 
              --arg '${arg}'
            `;
            if (show) this.showCmdline = true;
          }
          return res;
        })
        .catch(err => {
          if (err.response) {
            this.alertData = err.response.data.message;
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => (this.execution = false));
    },
    simulateOperation() {
      if (this.execution || !this.selectedItem) return;

      this.execution = true;

      this.api
        .getContractEntrypointTrace(
          this.network,
          this.address,
          this.selectedItem.bin_path,
          this.model,
          this.settings.source,
          this.settings.sender,
          this.settings.amount
        )
        .then(res => {
          if (res) {
            this.simulatedOperation = res[0];
            if (res.length > 1) {
              this.simulatedOperation.internal_operations = res.slice(1);
            }
            this.showResultOPG = true;
          }
        })
        .catch(err => {
          if (err.response) {
            this.alertData = err.response.data.message;
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => (this.execution = false));
    },
    highlightType(expr) {
      return expr.replace(/(\$\w+)/g, '<span class="accent--text">$1</span>');
    },
    async callContract(provider) {
      let parameter = await this.generateParameters(true);
      if (!parameter) return;

      const appName = "Better Call Dev";
      const rpcUrl = this.config.RPC_ENDPOINTS[this.network];

      this.execution = true;

      try {
        let wallet = null;

        if (provider === "beacon") {
          wallet = new BeaconWallet({ name: appName });
          const activeAccount = await wallet.client.getActiveAccount();
          if (activeAccount && activeAccount.network.type !== this.network) {
            await wallet.client.setActiveAccount(undefined);
          }
          await wallet.requestPermissions({
            network: { type: this.network, rpcUrl: rpcUrl }
          });
        } else if (provider === "thanos") {
          wallet = new ThanosWallet(appName);
          await wallet.connect(this.network);
        } else {
          console.log(`Unsupported provider: ${provider}`);
          return;
        }

        Tezos.setProvider({ rpc: rpcUrl, wallet });

        const result = await Tezos.wallet
          .transfer({
            to: this.address,
            amount: parseInt(this.settings.amount || "0"),
            parameter: JSON.parse(JSON.stringify(parameter)),
            mutez: true
          })
          .send();

        this.injectedOpHash = result.opHash;
      } catch (err) {
        this.alertData = err.message;
        console.log(err);
      } finally {
        this.execution = false;
      }
    }
  },
  watch: {
    address: "getEntrypoints",
    selectedItem: function(newValue) {
      if (newValue === null) return;
      if (this.$route.query.entrypoint != newValue.name) {
        this.$router.replace({ query: { entrypoint: newValue.name } });
      }
      this.alertData = null;
      this.parametersJSON = null;
      this.tezosClientCmdline = null;
      this.simulatedOperation = {};
      this.model = Object.assign({}, newValue.default_model);
    },
    execution: function(newValue) {
      if (newValue) {
        this.alertData = null;
        this.injectedOpHash = null;
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
</style>