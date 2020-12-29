<template>
  <div>
    <v-card flat outlined>
      <v-card-text class="pa-0 pt-6 data">
        <SchemaHeader
            v-if="title"
            :title="title"
            :is-storage="true"
            :storage-html="helpers.shortcut(name)"
            :storage-name="name"
            :fill-types="fillTypes"
            @selectedFillType="setSelectedFillType"
            @modelChange="setModel"
        />
        <SchemaForm
            :show="show"
            :schema="schema"
            :schema-model="model"
            :schema-selected-fill-type="selectedFillType"
            :schema-selected-network="selectedNetwork"
            :fill-types="fillTypes"
            :header="header"
            :is-deploy="isDeploy"
            :is-storage="isStorage"
            :networks="networks"
            :settings="settings"
            :importing="importing"
            :import-actions="importActions"
            :execution="execution"
            :execute-actions="executeActions"
            @selectedNetwork="setSelectedNetwork"
            @settingsChange="setSettings"
        />
        <SchemaAlertData
            v-if="alertData"
            :alert-data="alertData"
            @dismiss="showAlertData('')"
        />
        <SchemaAlertOpHashSuccess
            v-show="injectedOpHash"
            :injected-op-hash="injectedOpHash"
            :network="network"
        />
        <SchemaAlertCustomSuccess
            v-if="successText"
            :success-text="successText"
            @dismiss="showSuccessMessage('')"
          />
      </v-card-text>
    </v-card>
    <SchemaResultOPG
      :showResult="showResultOPG"
      :simulated-operation="simulatedOperation"
      :settings="settings"
      :gas-limit="gasLimit"
      :storage-limit="storageLimit"
      @resultOPGchange="setResultOPG"
    />
    <SchemaCmdLine
      :showCmd="showCmdline"
      :tezos-client-cmdline="tezosClientCmdline"
      :show-clipboard-ok="showClipboardOK"
      @cmdLineChange="setCmdline"
    />
    <RawJsonViewer
      :show.sync="showRawJSON"
      :raw="parametersJSON"
      :type="isStorage || isDeploy ? 'script' : 'parameters'"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { Tezos } from "@taquito/taquito";
import Vue from 'vue';
import RawJsonViewer from "@/components/RawJsonViewer.vue";
import SchemaForm from "./schemaForm/SchemaForm";
import SchemaResultOPG from "./schemaDialog/SchemaResultOPG";
import SchemaCmdLine from "./schemaDialog/SchemaCmdLine";
import SchemaAlertOpHashSuccess from "./schemaAlert/SchemaAlertOpHashSuccess";
import SchemaAlertData from "./schemaAlert/SchemaAlertData";
import SchemaHeader from "./schemaComponents/SchemaHeader";
import SchemaAlertCustomSuccess from "./schemaAlert/SchemaAlertCustomSuccess";
import { DAppClient, TezosOperationType } from '@airgap/beacon-sdk'

export default {
  name: "Schema",
  components: {
    SchemaAlertCustomSuccess,
    SchemaHeader,
    SchemaAlertData,
    SchemaAlertOpHashSuccess,
    SchemaCmdLine,
    SchemaResultOPG,
    SchemaForm,
    RawJsonViewer,
  },
  props: {
    value: Object,
    schema: Object,
    name: String,
    address: String,
    network: String,
    binPath: String,
    header: String,
    title: String,
    type: String,
    script: Array,
  },
  data: () => ({
    show: true,
    selectedNetwork: null,
    selectedFillType: "empty",
    networks: [],
    importActions: [],
    executeActions: [],
    execution: false,
    importing: false,
    alertData: '',
    injectedOpHash: null,
    simulatedOperation: {},
    showRawJSON: false,
    showCmdline: false,
    showResultOPG: false,
    showSimulationSettings: false,
    tezosClientCmdline: null,
    parametersJSON: null,
    successText: '',
    settings: {
      source: null,
      sender: null,
      amount: null,
    },
    fillTypes: [
      {
        value: "empty",
        text: "Empty",
      },
    ],
    model: {},
  }),
  async created() {
    await this.setExecuteActions();
    this.setFillTypes();

    this.networks = Object.keys(this.config.rpc_endpoints);
    this.setSelectedNetwork(this.network);
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
    isStorage() {
      return this.type === "storage";
    },
    isParameter() {
      return this.type === "parameter";
    },
    isDeploy() {
      return this.type === "deploy";
    },
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    setSelectedFillType(val) {
      this.selectedFillType = val;
    },
    setModel(val) {
      Vue.set(this, 'model', val);
    },
    setSelectedNetwork(val) {
      this.selectedNetwork = val;
    },
    setSettings({key, val}) {
      Vue.set(this.settings, key, val);
    },
    setResultOPG(val) {
      this.showResultOPG = val;
    },
    setCmdline(val) {
      this.showCmdline = val;
    },
    simulateActionCallback() {
      return this.isParameter ? () => this.simulateOperation() : null;
    },
    showSuccessMessage(text) {
      this.successText = text;
    },
    showAlertData(text) {
      this.alertData = text;
    },
    rawJsonActionCallback() {
      if (this.isParameter) {
        return () => this.generateParameters(true, true)
      } else if (this.isDeploy) {
        return null;
      }
      return () => this.prepareContractToFork(true);
    },
    tezosClientActionCallback() {
      return this.isParameter
          ? () => this.generateParameters(false, true)
          : null;
    },
    beaconClientActionCallback() {
      if (this.isParameter) {
        return async () => this.callContract();
      } else if (this.isDeploy) {
        return async () => this.makeDeploy(this.script);
      }

      return async () => this.fork();
    },
    async setExecuteActions() {
      this.executeActions = [
        {
          text: "Simulate",
          icon: "mdi-play-circle-outline",
          callback: this.simulateActionCallback()
        },
        {
          text: "Raw JSON",
          icon: "mdi-code-json",
          callback: this.rawJsonActionCallback()
        },
        {
          text: "Tezos-client",
          icon: "mdi-console-line",
          callback: this.tezosClientActionCallback()
        },
        {
          text: "DApp Client",
          icon: "mdi-lighthouse",
          callback: this.beaconClientActionCallback()
        },
      ];
    },
    getWalletEventHandlers() {
      return {
        PERMISSION_REQUEST_SUCCESS: {
          handler: () => {
            return null;
          },
        },
        PERMISSION_REQUEST_ERROR: {
          handler: () => {
            this.importing = false;
          }
        },
        OPERATION_REQUEST_ERROR: {
          handler: () => {
            this.showAlertData('The operations was aborted.');
          }
        },
        SIGN_REQUEST_ERROR: {
          handler: () => {
            this.showAlertData('The operations was aborted.');
          }
        },
        BROADCAST_REQUEST_ERROR: {
          handler: () => {
            this.showAlertData('Problem with broadcasting operation...');
          }
        },
        INTERNAL_ERROR: {
          handler: () => {
            this.showAlertData('Internal error 😔');
          }
        },
        UNKNOWN: {
          handler: () => {
            this.showAlertData('Unknown error 😔');
          }
        },
        CHANNEL_CLOSED: {
          handler: () => {
            this.showAlertData('Channel closed.');
          }
        },
        NO_PERMISSIONS: {
          handler: () => {
            this.showAlertData('No permissions.');
          }
        },
        LOCAL_RATE_LIMIT_REACHED: {
          handler: () => {
            this.showAlertData('No permissions.');
          }
        },
        OPERATION_REQUEST_SUCCESS: {
          handler: (data) => {
            const link = `https://${data.account.network.type}.tzkt.io/${data.output.transactionHash}`;
            const successMessage = `The transaction
               has successfully been <a href="${link}">broadcasted</a>
                to the network.`;
            this.showSuccessMessage(successMessage);
          }
        }
      }
    },
    setFillTypes() {
      if (this.isDeploy) return;
      this.fillTypes.push({
        value: this.isStorage ? "current" : "latest",
        text: this.isStorage ? "Current" : "Latest call",
      });
    },
    generateParameters(rawJSON = false, show = false) {
      if (this.execution) return;

      this.execution = true;

      return this.api
        .getContractEntrypointData(
          this.network,
          this.address,
          this.binPath,
          this.model,
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
            this.setCmdline(show);
          }
          return res;
        })
        .catch((err) => {
          if (err.response) {
            this.showAlertData(err.response.data.message);
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
          this.model,
          this.settings.source,
          this.settings.amount
        )
        .then((res) => {
          if (res) {
            this.simulatedOperation = res[0];
            if (res.length > 1) {
              this.simulatedOperation.internal_operations = res.slice(1);
            }
            this.setResultOPG(true);
          }
        })
        .catch((err) => {
          if (err.response) {
            this.showAlertData(err.response.data.message);
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => (this.execution = false));
    },
    async getWallet(network) {
      const appName = "Better Call Dev";
      const rpcUrl = this.config.rpc_endpoints[network];
      let wallet = new DAppClient({
        name: appName,
        eventHandlers: this.getWalletEventHandlers(),
      });
      const networkMap = { sandboxnet: "custom" };
      const type = networkMap[network] || network;
      await wallet.setActiveAccount(undefined);
      await wallet.requestPermissions({ network: { type, rpcUrl } });
      return wallet;
    },
    async callContract() {
      let parameter = await this.generateParameters(true);
      if (!parameter) return;

      this.execution = true;
      try {
        let client = await this.getWallet(this.network);
        const operation = {
          kind: TezosOperationType.TRANSACTION,
          to: this.address,
          amount: String(parseInt(this.settings.amount || "0")),
          parameters: JSON.parse(JSON.stringify(parameter)),
        }
        const result = await client.requestOperation({
          operationDetails: [operation]
        });
        this.injectedOpHash = result.opHash;
      } catch (err) {
        await err;
        this.showAlertData(err.message);
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
    prepareContractToFork(show) {
      if (this.execution) return;

      this.execution = true;
      this.api
        .prepareToFork({
          network: this.network,
          address: this.address,
          storage: this.model,
        })
        .then((res) => {
          if (!res) return;
          this.parametersJSON = res;
          this.showRawJSON = show;
        })
        .catch((err) => {
          if (err.response) {
            this.showAlertData(err.response.data.message);
          } else {
            this.showError(err);
          }
          console.log(err);
        })
        .finally(() => (this.execution = false));
    },
    async fork() {
      if (this.execution) return;

      this.execution = true;
      try {
        let data = await this.api.prepareToFork({
          network: this.network,
          address: this.address,
          storage: this.model,
        });
        await this.deploy(data.code, data.storage);
      } catch (err) {
        this.showAlertData(err.message);
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
    async makeDeploy() {
      if (this.execution) return;

      this.execution = true;
      try {
        let data = await this.api.prepareToFork({
          script: JSON.stringify(this.script),
          storage: this.model,
        });
        await this.deploy(data.code, data.storage);
      } catch (err) {
        this.showAlertData(err.message);
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
    async deploy(code, storage) {
      let wallet = await this.getWallet(this.selectedNetwork);
      Tezos.setProvider({
        rpc: this.config.rpc_endpoints[this.selectedNetwork],
        wallet,
      });
      Tezos.wallet
        .originate({
          code: code,
          init: storage,
        })
        .send()
        .then((originationOp) => {
          this.injectedOpHash = originationOp.opHash;
          this.$emit("onDeploy", originationOp);
        })
        .catch((err) => {
          this.showAlertData(err.message);
          console.log(err);
        });
    },
    getRandomContract(props) {
      this.show = false;
      this.api
        .search(props.schema.tag, ["contract"], 0, [this.network], [], {}, 0)
        .then((res) => {
          if (res.items) {
            Vue.set(this.model, props.fullKey, res.items[0].value);
          }
        })
        .catch((err) => {
          this.showAlertData(err.message);
          console.log(err);
        })
        .finally(() => (this.show = true));
    },
  },
  watch: {
    execution: function (newValue) {
      if (newValue) {
        this.showAlertData('');
        this.injectedOpHash = null;
      }
    },
    name: function () {
      this.showAlertData('');
      this.parametersJSON = null;
      this.tezosClientCmdline = null;
      this.simulatedOperation = {};
      this.selectedFillType = "empty";
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
      if (this.isStorage || this.isDeploy) {
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
      } else {
        this.api
          .getContractEntrypointSchema(
            this.network,
            this.address,
            this.name,
            newValue
          )
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
      }
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
  background-color: var(--v-canvas-base) !important;
  color: var(--v-text-base) !important;
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