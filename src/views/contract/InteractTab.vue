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
                <div v-if="selectedItem.schema" class="pl-6 pt-4 pr-4 pb-0 mr-2 mb-6 canvas">
                  <div class="mb-6">
                    <span class="caption font-weight-medium text-uppercase text--disabled">Parameters</span>
                  </div>
                  <v-jsf v-model="model" :schema="selectedItem.schema"></v-jsf>
                </div>
                <div class="px-6 pt-4 pb-0 mr-2 mb-6 canvas optional-settings">
                  <div class="mb-6">
                    <span class="caption font-weight-medium text-uppercase text--disabled">Optional settings</span>
                  </div>
                  <div class="d-flex">
                    <v-text-field
                      id="source"
                      name="source"
                      v-model="settings.source"
                      outlined
                      dense
                      label="source"
                      placeholder="address"
                    ></v-text-field>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn text small :loading="importing" style="margin-top: 6px;" class="ml-4 text--secondary" v-bind="attrs" v-on="on">
                          <v-icon small class="mr-1">mdi-import</v-icon>
                          <span>Import</span>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in importActions"
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
                  <v-text-field
                    id="amount"
                    name="amount"
                    v-model="settings.amount"
                    outlined
                    dense
                    label="amount"
                    type="number"
                    placeholder="mutez"
                  ></v-text-field>
                </div>
                <div class="d-flex align-center">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined :loading="execution" class="px-6" color="accent" v-bind="attrs" v-on="on">
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
                    >
                      <span v-html="helpers.shortcut(injectedOpHash)"></span>
                    </v-btn>
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
          <div v-if="simulatedOperation && settings.source" class="d-flex flex-column align-center ml-10">
            <span class="overline">gas limit</span>
            <span class="hash" style="font-size: 14px; line-height: 14px;">{{ gasLimit }}</span>
          </div>
          <div v-if="simulatedOperation && settings.source" class="d-flex flex-column align-center ml-10">
            <span class="overline">storage limit</span>
            <span class="hash" style="font-size: 14px; line-height: 14px;">{{ storageLimit }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon small @click="showResultOPG = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <InternalOperation :data="simulatedOperation" noheader />
          <template v-for="(intop, intid) in simulatedOperation.internal_operations">
            <v-divider :key="'divider' + intid"></v-divider>
            <InternalOperation :data="intop" :mainOperation="simulatedOperation" :key="intid" />
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCmdline" width="800" scrollable :retain-focus="false">
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center py-2">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Tezos-client</span>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-4 text--secondary"
            v-clipboard="() => tezosClientCmdline"
            v-clipboard:success="showClipboardOK"
            text
          >
            <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
          </v-btn>
          <v-btn icon small @click="showCmdline = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <span class="hash">{{ tezosClientCmdline }}</span>
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
    importing: false,
    entrypoints: [],
    selected: -1,
    model: {},
    settings: {
      source: null,
      sender: null,
      amount: null
    },
    executeActions: [],
    importActions: [],
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
    },
    storageLimit() {
      let val = this.simulatedOperation.burned || 0;
      const internal = this.simulatedOperation.internal_operations || [];
      if (internal) {
        for (let i = 0; i < internal.length; i++) {
          val += internal[i].burned || 0;
        }
      }
      return val;
    },
    gasLimit() {
      let val = 0;
      const result = this.simulatedOperation.result;
      if (result) {
        val = result.consumed_gas || 0;
        const internal = this.simulatedOperation.internal_operations || [];
        for (let i = 0; i < internal.length; i++) {
          if (internal[i].result) {
            val += internal[i].result.consumed_gas || 0;
          }
        }
      }
      return val;
    }
  },
  async created() {
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

    this.importActions = [
      {
        text: "Beacon",
        icon: "mdi-lighthouse",
        callback: async () => this.importSource("beacon")
      }
    ]

    try {
      if (await ThanosWallet.isAvailable()) {
        this.executeActions.push({
          text: "Thanos",
          icon: "mdi-hand-right",
          callback: async () => this.callContract("thanos")
        });
        this.importActions.push({
          text: "Thanos",
          icon: "mdi-hand-right",
          callback: async () => this.importSource("thanos")
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    applyStyles(node) {
      if (!node) return;
      if (node.type) {
        const defaultTitle = {
          "contract": "callback"
        }
        node["x-props"] = { 
          outlined: true,
          dense: true,
          placeholder: node.prim,
          label: node.title || defaultTitle[node.prim] || ""
        }   
      }
      if (node.properties) {
        for (var prop in node.properties) {
          this.applyStyles(node.properties[prop]);
        }
      }
      if (node.oneOf) {
        for (var option in node.oneOf) {
          this.applyStyles(node.oneOf[option]);
        }
      }
      if (node.items) {
        this.applyStyles(node.items);
      }
    },  
    getEntrypoints(selectedName = undefined) {
      this.loading = true;
      this.api
        .getContractEntrypoints(this.network, this.address)
        .then(res => {
          if (!res) return;
          this.entrypoints = res.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          this.entrypoints.forEach(e => this.applyStyles(e.schema));
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
            const amount = this.settings.amount || 0;
            const src = this.settings.source || "%YOUR_ADDRESS%";
            const entrypoint = this.selectedItem.name;
            this.tezosClientCmdline = `transfer ${amount} from ${src} to ${this.address} --entrypoint '${entrypoint}' --arg '${arg}'`;
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
    async getWallet(provider) {
      const appName = "Better Call Dev";
      const rpcUrl = this.config.RPC_ENDPOINTS[this.network];

      if (provider === "beacon") {
        let wallet = new BeaconWallet({ name: appName });
        const networkMap = { "sandboxnet": "custom" }
        const type = networkMap[this.network] || this.network;
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount && activeAccount.network.type !== type) {
          await wallet.client.setActiveAccount(undefined);
        }
        await wallet.requestPermissions({ network: { type, rpcUrl } });
        return wallet;

      } else if (provider === "thanos") {
        let wallet = new ThanosWallet(appName);
        const networkMap = { "sandboxnet": "sandbox" }
        await wallet.connect(networkMap[this.network] || this.network);
        return wallet;
        
      } else {
        throw `Unsupported provider: ${provider}`;
      }
    },
    async importSource(provider) {
      this.importing = true;      
      try {
        let wallet = await this.getWallet(provider);
        this.settings.source = await wallet.getPKH();
      } catch (err) {
        this.alertData = err.message;
        console.log(err)
      } finally {
        this.importing = false;
      }
    },
    async callContract(provider) {
      let parameter = await this.generateParameters(true);
      if (!parameter) return;

      this.execution = true;
      try {
        let wallet = await this.getWallet(provider)
        Tezos.setProvider({ rpc: this.config.RPC_ENDPOINTS[this.network], wallet });
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

.vjsf-property fieldset, .optional-settings fieldset {
  background-color: var(--v-data-base) !important;
  border: 1px solid var(--v-border-base) !important;
}

/* fixing "+" button */
.vjsf-property > .layout > .v-btn {
  box-shadow: none !important;
  background-color: transparent !important;
  border-radius: 3px !important;
  width: unset !important;
  height: unset !important;
  margin: 10px 0;
  padding-left: 10px;
  padding-right: 15px;
}
.vjsf-property .v-btn__content .v-icon {
  color: var(--v-text-base) !important;
  opacity: .7;
}
.vjsf-property > .layout > .v-btn > .v-btn__content::after {
  content: "add" !important;
  color: var(--v-text-base) !important;
}

.vjsf-property .v-subheader {
  padding-left: 10px !important;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}
/* end fixing "+" button */

</style>

<style lang="scss" scoped>
.parameters {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: var(--v-tree-base);
  }
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