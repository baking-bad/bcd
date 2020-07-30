<template>
  <div>
    <v-card flat outlined>
      <v-card-title class="py-2 px-5 sidebar">
        <span class="hash secondary--text">{{ name }}</span>
      </v-card-title>
      <v-card-text class="pa-0 pt-1 data">
        <v-form class="pa-6 pr-4">
          <div v-if="schema" class="pl-6 pt-4 pr-4 pb-4 mr-2 mb-6 canvas">
            <div class="mb-6">
              <span class="caption font-weight-medium text-uppercase text--disabled">{{ header }}</span>
            </div>

            <div class="mb-6">
              <v-btn-toggle
                v-model="selectedFillType"
                color="primary"
                dense
                mandatory
                v-if="isStorage"
              >
                <v-btn small value="empty">Empty</v-btn>
                <v-btn small value="current">Current</v-btn>
              </v-btn-toggle>
            </div>

            <v-skeleton-loader :loading="!show" type="article" transition="fade-transition">
              <v-jsf v-model="model" :schema="schema" v-if="show">
                <template slot="custom-codemirror" slot-scope="{value, label, on}">
                  <label class="codemirror-label">{{ label }}</label>
                  <div class="mb-6 ba-1" style="border-radius: 3px;">
                    <Michelson v-on="on" :code="value" mutable></Michelson>
                  </div>
                </template>
              </v-jsf>
              <div v-else></div>
            </v-skeleton-loader>
          </div>
          <div class="px-6 pt-4 pb-0 mr-2 mb-6 canvas optional-settings">
            <div class="mb-6">
              <span
                class="caption font-weight-medium text-uppercase text--disabled"
              >Optional settings</span>
            </div>
            <div class="mb-6">
              <v-btn-toggle
                v-model="selectedNetwork"
                color="primary"                
                dense
                mandatory
                v-if="isStorage"
              >
                <v-btn :value="n" :key="n" v-for="n in networks" small>{{ n }}</v-btn>
              </v-btn-toggle>
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
                  <v-btn
                    text
                    small
                    :loading="importing"
                    style="margin-top: 6px;"
                    class="ml-4 text--secondary"
                    v-bind="attrs"
                    v-on="on"
                  >
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
                <v-btn
                  outlined
                  :loading="execution"
                  class="px-6"
                  color="accent"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>Execute</span>
                  <v-icon small class="ml-1">mdi-creation</v-icon>
                </v-btn>
              </template>
              <v-list>
                <template v-for="(item, index) in executeActions">
                  <v-list-item :key="index" @click="item.callback()" v-if="item.callback">
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                    <v-list-item-avatar>
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-avatar>
                  </v-list-item>
                </template>
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
    <v-dialog v-model="showResultOPG" width="1200" scrollable>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center pa-4">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Simulation result</span>
          <div
            v-if="simulatedOperation && settings.source"
            class="d-flex flex-column align-center ml-10"
          >
            <span class="overline">gas limit</span>
            <span class="hash" style="font-size: 14px; line-height: 14px;">{{ gasLimit }}</span>
          </div>
          <div
            v-if="simulatedOperation && settings.source"
            class="d-flex flex-column align-center ml-10"
          >
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { Tezos } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { ThanosWallet } from "@thanos-wallet/dapp";

import InternalOperation from "@/components/InternalOperation.vue";
import RawJsonViewer from "@/components/RawJsonViewer.vue";
import Michelson from "@/components/Michelson.vue";

export default {
  name: "Schema",
  components: {
    InternalOperation,
    RawJsonViewer,
    Michelson,
  },
  props: {
    value: Object,
    schema: Object,
    name: String,
    address: String,
    network: String,
    binPath: String,
    header: String,
    isStorage: Boolean,
  },
  data: () => ({
    show: true,
    selectedNetwork: null,
    selectedFillType: "current",
    networks: [],
    importActions: [],
    executeActions: [],
    execution: false,
    importing: false,
    alertData: null,
    injectedOpHash: null,
    simulatedOperation: {},
    showRawJSON: false,
    showCmdline: false,
    showResultOPG: false,
    showSimulationSettings: false,
    tezosClientCmdline: null,
    parametersJSON: null,
    settings: {
      source: null,
      sender: null,
      amount: null,
    },
    model: {},
  }),
  async created() {
    this.model = this.value;
    this.setExecuteActions();

    this.importActions = [
      {
        text: "Beacon",
        icon: "mdi-lighthouse",
        callback: async () => this.importSource("beacon"),
      },
    ];

    this.networks = Object.keys(this.config.RPC_ENDPOINTS);
    this.selectedNetwork = this.network;
  },
  computed: {
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
    },
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    async setExecuteActions() {
      this.executeActions = [
        {
          text: "Simulate",
          icon: "mdi-play-circle-outline",
          callback: this.isStorage ? null : () => this.simulateOperation(),
        },
        {
          text: "Raw JSON",
          icon: "mdi-code-json",
          callback: this.isStorage
            ? () => this.prepareContractToFork(true)
            : () => this.generateParameters(true, true),
        },
        {
          text: "Tezos-client",
          icon: "mdi-console-line",
          callback: this.isStorage
            ? null
            : () => this.generateParameters(false, true),
        },
        {
          text: "Beacon",
          icon: "mdi-lighthouse",
          callback: this.isStorage
            ? async () => this.fork("beacon")
            : async () => this.callContract("beacon"),
        },
      ];

      try {
        if (await ThanosWallet.isAvailable()) {
          this.executeActions.push({
            text: "Thanos",
            icon: "mdi-hand-right",
            callback: async () =>
              this.isStorage
                ? this.fork("thanos")
                : this.callContract("thanos"),
          });
          this.importActions.push({
            text: "Thanos",
            icon: "mdi-hand-right",
            callback: async () => this.importSource("thanos"),
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    generateParameters(rawJSON = false, show = false) {
      if (this.execution) return;

      this.execution = true;

      return this.api
        .getContractEntrypointData(
          this.network,
          this.address,
          this.binPath,
          this.value,
          rawJSON ? "" : "michelson"
        )
        .then((res) => {
          if (rawJSON) {
            this.parametersJSON = res;
            this.showRawJSON = show;
          } else {
            const arg = String(res).replace(/\n|\s+/gm, " ");
            const amount = this.settings.amount || 0;
            const src = this.settings.source || "%YOUR_ADDRESS%";
            const entrypoint = this.name;
            this.tezosClientCmdline = `transfer ${amount} from ${src} to ${this.address} --entrypoint '${entrypoint}' --arg '${arg}'`;
            this.showCmdline = show;
          }
          return res;
        })
        .catch((err) => {
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
      if (this.execution) return;

      this.execution = true;

      this.api
        .getContractEntrypointTrace(
          this.network,
          this.address,
          this.binPath,
          this.value,
          this.settings.source,
          this.settings.amount
        )
        .then((res) => {
          if (res) {
            this.simulatedOperation = res[0];
            if (res.length > 1) {
              this.simulatedOperation.internal_operations = res.slice(1);
            }
            this.showResultOPG = true;
          }
        })
        .catch((err) => {
          if (err.response) {
            this.alertData = err.response.data.message;
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => (this.execution = false));
    },
    async getWallet(provider, network) {
      const appName = "Better Call Dev";
      const rpcUrl = this.config.RPC_ENDPOINTS[network];

      if (provider === "beacon") {
        let wallet = new BeaconWallet({ name: appName });
        const networkMap = { sandboxnet: "custom" };
        const type = networkMap[network] || network;
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount && activeAccount.network.type !== type) {
          await wallet.client.setActiveAccount(undefined);
        }
        await wallet.requestPermissions({ network: { type, rpcUrl } });
        return wallet;
      } else if (provider === "thanos") {
        let wallet = new ThanosWallet(appName);
        const networkMap = { sandboxnet: "sandbox" };
        await wallet.connect(networkMap[network] || network);
        return wallet;
      } else {
        throw `Unsupported provider: ${provider}`;
      }
    },
    async importSource(provider) {
      this.importing = true;
      try {
        let wallet = await this.getWallet(provider, this.network);
        this.settings.source = await wallet.getPKH();
      } catch (err) {
        this.alertData = err.message;
        console.log(err);
      } finally {
        this.importing = false;
      }
    },
    async callContract(provider) {
      let parameter = await this.generateParameters(true);
      if (!parameter) return;

      this.execution = true;
      try {
        let wallet = await this.getWallet(provider, this.network);
        Tezos.setProvider({
          rpc: this.config.RPC_ENDPOINTS[this.network],
          wallet,
        });
        const result = await Tezos.wallet
          .transfer({
            to: this.address,
            amount: parseInt(this.settings.amount || "0"),
            parameter: JSON.parse(JSON.stringify(parameter)),
            mutez: true,
          })
          .send();
        this.injectedOpHash = result.opHash;
      } catch (err) {
        this.alertData = err.message;
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
    prepareContractToFork(show) {
      if (this.execution) return;

      this.execution = true;
      this.api
        .prepareToFork(this.network, this.address, this.model)
        .then((res) => {
          if (!res) return;
          this.parametersJSON = res;
          this.showRawJSON = show;
        })
        .catch((err) => {
          if (err.response) {
            this.alertData = err.response.data.message;
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => (this.execution = false));
    },
    async fork(provider) {
      if (this.execution) return;

      this.execution = true;
      try {
        let data = await this.api.prepareToFork(
          this.network,
          this.address,
          this.model
        );
        let wallet = await this.getWallet(provider, this.selectedNetwork);
        Tezos.setProvider({
          rpc: this.config.RPC_ENDPOINTS[this.selectedNetwork],
          wallet,
        });
        Tezos.wallet
          .originate({
            code: data.code,
            init: data.storage,
          })
          .send()
          .then((originationOp) => {
            this.injectedOpHash = originationOp.opHash;
          })
          .catch((err) => {
            this.alertData = err.message;
            console.log(err);
          });
      } catch (err) {
        this.alertData = err.message;
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
  },
  watch: {
    execution: function (newValue) {
      if (newValue) {
        this.alertData = null;
        this.injectedOpHash = null;
      }
    },
    name: function () {
      this.alertData = null;
      this.parametersJSON = null;
      this.tezosClientCmdline = null;
      this.simulatedOperation = {};
    },
    model: {
      deep: true,
      handler: function (newValue) {
        let val = Object.assign(this.value, newValue);
        this.$emit("input", val);
      },
    },
    selectedFillType: function (newValue) {
      this.show = false;
      this.api
        .getContractStorageSchema(this.network, this.address, newValue)
        .then((res) => {
          if (!res) return;
          this.model = res.default_model;
          this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.show = true;
        });
    },
  },
};
</script>

<style>
.v-btn-toggle {
  flex-direction: column;
}

.vjsf-property fieldset,
.optional-settings fieldset {
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
  opacity: 0.7;
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

.v-card__actions > .v-btn.v-btn--contained.v-size--default.primary {
  background-color: var(--v-canvas--base) !important;
  box-shadow: none !important;
  margin-right: 5px;
}

.codemirror-label {
  font-size: 12px;
  z-index: 100;
  position: absolute;
  transform: translateY(-12px) translateX(12px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  min-height: 6px;
}

.v-btn-toggle {
  flex-direction: row;
}
</style>