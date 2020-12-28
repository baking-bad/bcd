<template>
  <div>
    <v-card flat outlined>
      <v-card-text class="pa-0 pt-6 data">
        <SchemaHeader />
        <SchemaForm />
        <SchemaAlertData />
        <SchemaAlertSuccess />
      </v-card-text>
    </v-card>
    <SchemaResultOPG />
    <SchemaCmdLine />
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
// import { BeaconWallet } from "@taquito/beacon-wallet";
import { ThanosWallet } from "@thanos-wallet/dapp";
import { DAppClient } from '@airgap/beacon-sdk'

import InternalOperation from "@/components/InternalOperation.vue";
import RawJsonViewer from "@/components/RawJsonViewer.vue";
import Michelson from "@/components/Michelson.vue";
import SchemaForm from "@/components/SchemaForm";
import SchemaResultOPG from "@/components/SchemaResultOPG";
import SchemaCmdLine from "@/components/SchemaCmdLine";
import SchemaAlertSuccess from "@/components/SchemaAlertSuccess";
import SchemaAlertData from "@/components/SchemaAlertData";
import SchemaHeader from "@/components/SchemaHeader";

export default {
  name: "Schema",
  components: {
    SchemaHeader,
    SchemaAlertData,
    SchemaAlertSuccess,
    SchemaCmdLine,
    SchemaResultOPG,
    SchemaForm,
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

    this.importActions = [
      {
        text: "Beacon",
        icon: "mdi-lighthouse",
        callback: async () => this.importSource("beacon"),
      },
    ];

    this.networks = Object.keys(this.config.rpc_endpoints);
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
    async setExecuteActions() {
      this.executeActions = [
        {
          text: "Simulate",
          icon: "mdi-play-circle-outline",
          callback: this.isParameter ? () => this.simulateOperation() : null,
        },
        {
          text: "Raw JSON",
          icon: "mdi-code-json",
          callback: this.isParameter
            ? () => this.generateParameters(true, true)
            : this.isDeploy
            ? null
            : () => this.prepareContractToFork(true),
        },
        {
          text: "Tezos-client",
          icon: "mdi-console-line",
          callback: this.isParameter
            ? () => this.generateParameters(false, true)
            : null,
        },
        {
          text: "Beacon",
          icon: "mdi-lighthouse",
          callback: this.isParameter
            ? async () => this.callContract("beacon")
            : this.isDeploy
            ? async () => this.makeDeploy("beacon", this.script)
            : async () => this.fork("beacon"),
        },
      ];

      try {
        if (await ThanosWallet.isAvailable()) {
          this.executeActions.push({
            text: "Thanos",
            icon: "mdi-hand-right",
            callback: async () =>
              this.isParameter
                ? this.callContract("thanos")
                : this.isDeploy
                ? async () => this.makeDeploy("thanos", this.script)
                : async () => this.fork("thanos"),
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
      const rpcUrl = this.config.rpc_endpoints[network];

      if (provider === "beacon") {
        let wallet = new BeaconWallet({ name: appName });
        const networkMap = { sandboxnet: "custom" };
        const type = networkMap[network] || network;
        await wallet.client.setActiveAccount(undefined);
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
          rpc: this.config.rpc_endpoints[this.network],
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
        let data = await this.api.prepareToFork({
          network: this.network,
          address: this.address,
          storage: this.model,
        });
        await this.deploy(provider, data.code, data.storage);
      } catch (err) {
        this.alertData = err.message;
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
    async makeDeploy(provider) {
      if (this.execution) return;

      this.execution = true;
      try {
        let data = await this.api.prepareToFork({
          script: JSON.stringify(this.script),
          storage: this.model,
        });
        await this.deploy(provider, data.code, data.storage);
      } catch (err) {
        this.alertData = err.message;
        console.log(err);
      } finally {
        this.execution = false;
      }
    },
    async deploy(provider, code, storage) {
      let wallet = await this.getWallet(provider, this.selectedNetwork);
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
          this.alertData = err.message;
          console.log(err);
        });
    },
    getRandomContract(props) {
      this.show = false;
      this.api
        .search(props.schema.tag, ["contract"], 0, [this.network], [], {}, 0)
        .then((res) => {
          if (res.items) {
            this.model[props.fullKey] = res.items[0].value;
          }
        })
        .catch((err) => {
          this.alertData = err.message;
          console.log(err);
        })
        .finally(() => (this.show = true));
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