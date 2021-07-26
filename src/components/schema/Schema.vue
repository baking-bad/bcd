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
            @getRandomContract="getRandomContract"
            @executeAction="stopGettingWallet"
            @selectedNetwork="setSelectedNetwork"
            @settingsChange="setSettings"
            @selectedFillType="setSelectedFillType"
            @modelChange="setModel"
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
import Vue from 'vue';
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";
import SchemaForm from "./schemaForm/SchemaForm";
import SchemaResultOPG from "./schemaDialog/SchemaResultOPG";
import SchemaCmdLine from "./schemaDialog/SchemaCmdLine";
import SchemaAlertOpHashSuccess from "./schemaAlert/SchemaAlertOpHashSuccess";
import SchemaHeader from "./schemaComponents/SchemaHeader";
import SchemaAlertCustomSuccess from "./schemaAlert/SchemaAlertCustomSuccess";
import { DAppClient, TezosOperationType, AbortedBeaconError, BroadcastBeaconError, defaultEventCallbacks } from '@airgap/beacon-sdk'

const walletsToIcons = {
  "Temple - Tezos Wallet (ex. Thanos)": "mdi-alpha-t",
  "Spire": "mdi-alpha-s",
  "Galleon": "mdi-alpha-g",
  "Kukai": "mdi-alpha-k",
  "default": "mdi-alpha-w",
};

export default {
  name: "Schema",
  components: {
    SchemaAlertCustomSuccess,
    SchemaHeader,
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
    wallet: null,
    execution: false,
    importing: false,
    injectedOpHash: null,
    simulatedOperation: {},
    showRawJSON: false,
    showCmdline: false,
    showResultOPG: false,
    showSimulationSettings: false,
    tezosClientCmdline: null,
    parametersJSON: null,
    isGettingWalletProgress: false,
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
    this.setExecuteActions();
    this.setFillTypes();

    this.networks = Object.keys(this.config.rpc_endpoints);
    this.setSelectedNetwork(this.network);

    this.resetBeaconActiveAccount();
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
    stopGettingWallet() {
      if (this.isGettingWalletProgress) {
        this.execution = false;
        this.importing = false;
      }
    },
    resetBeaconActiveAccount() {
      localStorage.setItem('beacon:active-peer', '');
      localStorage.setItem('beacon:active-account', '');
    },
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
    beaconClientActionCallback(isLast) {
      if (this.isParameter) {
        return async () => {
          await this.callContract(isLast);
        }
      } else if (this.isDeploy) {
        return async () => {
          await this.makeDeploy(isLast);
        }
      }

      return async () => {
        await this.fork(isLast);
      }
    },
    beaconWalletGetAddress(isLast) {
      return async () => {
        if (isLast) {
          const lastAccount = this.getLastUsedAccount();
          return lastAccount.address;
        } else {
          const client = this.wallet ? this.wallet : await this.getWallet();
          await this.getNewPermissions(false);
          const account = await client.getActiveAccount();
          return account.address;
        }
      }
    },
    setExecuteActions() {
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
          text: "Wallet",
          icon: this.getIconForWalletName(),
          callback: this.beaconClientActionCallback(false)
        },
      ];
      this.importActions.push(
          {
            text: "Wallet",
            icon: "mdi-lighthouse",
            callback: this.beaconWalletGetAddress(false)
          }
      );
      const accounts = localStorage.getItem('beacon:accounts');
      if (accounts && JSON.parse(accounts).length > 0) {
        this.addLastUsedOption();
      }
    },
    getIconForWalletName(name) {
      return name in walletsToIcons ? walletsToIcons[name] : walletsToIcons.default;
    },
    removeLastUsedOptions() {
      this.executeActions = this.executeActions.filter(item => !item.isLastOption);
      this.importActions = this.importActions.filter(item => !item.isLastOption);
    },
    getLastUsedWalletInfo() {
      const lastAccount = this.getLastUsedAccount();
      const peers = localStorage.getItem('beacon:postmessage-peers-dapp');
      if (!peers) {
        return {
          text: "Last used wallet",
          icon: this.getIconForWalletName()
        }
      } else {
        const text = JSON.parse(peers)
            .find(item => item.extensionId === lastAccount.origin.id)
            .name;
        const icon = this.getIconForWalletName(text);
        return { text, icon }
      }
    },
    addLastUsedOption() {
      const { text, icon } = this.getLastUsedWalletInfo();
      this.removeLastUsedOptions();
      this.executeActions.push({
        text,
        icon,
        isLastOption: true,
        callback: this.beaconClientActionCallback(true)
      });
      this.importActions.push(
          {
            text,
            icon,
            isLastOption: true,
            callback: this.beaconWalletGetAddress(true)
          }
      );
    },
    getWalletEventHandlers() {
      return {
        PERMISSION_REQUEST_SUCCESS: {
          handler: async (data) => {
            this.addLastUsedOption();
            await defaultEventCallbacks.PERMISSION_REQUEST_SUCCESS(data);
          }
        },
        OPERATION_REQUEST_SUCCESS: {
          handler: async (data) => {
            const link = `/${data.account.network.type}/opg/${data.output.transactionHash}`;
            const successMessage = `The transaction
               has successfully been <a href="${link}">broadcasted</a>
                to the network.`;
            this.showSuccessMessage(successMessage);
            await defaultEventCallbacks.OPERATION_REQUEST_SUCCESS(data);
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
          this.name,
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
          this.showError(err.response ? err.response.data.message : err);
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
          this.name,
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
          this.showError(err.response ? err.response.data.message : err);
        })
        .finally(() => (this.execution = false));
    },
    getLastUsedAccount() {
      const accounts = localStorage.getItem('beacon:accounts');
      const parsedAccounts = JSON.parse(accounts);
      const connectionTimes = parsedAccounts.map(item => item.connectedAt);
      const recentConnectionTime = Math.max(...connectionTimes);
      return parsedAccounts.find(item => item.connectedAt === recentConnectionTime);
    },
    async getWallet() {
      this.wallet = new DAppClient({
        name: "Better Call Dev",
        eventHandlers: this.getWalletEventHandlers(),
      });
      return this.wallet;
    },
    async getNewPermissions(isLast) {
      this.isGettingWalletProgress = true;
      const rpcUrl = this.config.rpc_endpoints[this.selectedNetwork];
      const networkMap = { sandboxnet: "custom" };
      const type = networkMap[this.selectedNetwork] || this.selectedNetwork;
      if (!isLast) {
        await this.wallet.clearActiveAccount();
      } else {
        this.wallet.setActiveAccount(this.getLastUsedAccount());
      }
      await this.wallet.requestPermissions({ network: { type, rpcUrl } });
      this.isGettingWalletProgress = false;
    },
    async getClient(isLast) {
      let client;
      if (this.wallet && !isLast) {
        await this.getNewPermissions(isLast);
        client = this.wallet ? this.wallet : await this.getWallet();
      } else {
        client = this.wallet ? this.wallet : await this.getWallet();
        await this.getNewPermissions(isLast);
      }
      return client;
    },
    async callContract(isLast) {
      let parameter = await this.generateParameters(true);
      if (!parameter) return;

      this.execution = true;
      try {
        let client = await this.getClient(isLast);
        const result = await client.requestOperation({
          operationDetails: [{
            kind: TezosOperationType.TRANSACTION,
            destination: this.address,
            amount: String(parseInt(this.settings.amount || "0")),
            parameters: {
              entrypoint: this.name,
              value: JSON.parse(JSON.stringify(parameter))
            },
          }]
        });
        this.injectedOpHash = result.opHash;
      } catch (err) {
        await err;
        this.showError(err.description);
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
          this.showError(err.response ? err.response.data.message : err);
        })
        .finally(() => (this.execution = false));
    },
    async fork(isLast) {
      if (this.execution) return;

      this.execution = true;
      try {
        let data = await this.api.prepareToFork({
          network: this.network,
          address: this.address,
          storage: this.model,
        });
        await this.deploy(isLast, data.code, data.storage);
      } catch (err) {
        this.showError(this.makeHumanableErrorMessage(err));
      } finally {
        this.execution = false;
      }
    },
    makeHumanableErrorMessage(err) {
      if (err instanceof AbortedBeaconError) {
        return `Connection with the wallet has been aborted.`;
      } else if (err instanceof BroadcastBeaconError) {
        return `Something is wrong with either the network or the transaction.`
      }
      return err.message;
    },
    async makeDeploy(isLast) {
      if (this.execution) return;

      this.execution = true;
      try {
        let data = await this.api.prepareToFork({
          script: JSON.stringify(this.script),
          storage: this.model,
        });
        await this.deploy(isLast, data.code, data.storage);
      } catch (err) {
        this.showError(err.description);
      } finally {
        this.execution = false;
      }
    },
    async deploy(isLast, code, storage) {
      const client = await this.getClient(isLast);
      const operation = {
        kind: TezosOperationType.ORIGINATION,
        script: {
          code,
          storage
        },
        balance: this.settings.amount ? String(this.settings.amount) : "0",
      }
      try {
        const result = await client.requestOperation({
          operationDetails: [operation]
        });
        this.injectedOpHash = result.opHash;
        this.$emit("onDeploy", result);
      } catch (err) {
        this.showError(this.makeHumanableErrorMessage(err));
      }
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
          this.showError(err.message);
        })
        .finally(() => (this.show = true));
    },
  },
  watch: {
    execution: function (newValue) {
      if (newValue) {
        this.injectedOpHash = null;
      }
    },
    name: function () {
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
            this.$set(this, 'model', res.default_model);
          })
          .catch((err) => {
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
            this.$set(this, 'model', res.default_model);
          })
          .catch((err) => {
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
.vjsf-property fieldset,
.optional-settings fieldset {
  background-color: var(--v-data-base) !important;
  border: 1px solid var(--v-border-base) !important;
}

/* fixing "+" button */
.vjsf-property .v-input__slot button.v-btn {
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
.vjsf-property .v-input__slot .v-btn > .v-btn__content::after {
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
