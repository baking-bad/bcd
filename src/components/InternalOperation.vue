<template>
  <div class="pb-2 data">
    <v-row v-if="!data.internal && data.counter" no-gutters class="px-4 py-1 sidebar">
      <v-col cols="2">
        <InfoItem title="Counter" :subtitle="String(data.counter)" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Burned" :subtitle="(burned || 0) | uxtz" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Fee" :subtitle="(data.fee || 0) | uxtz" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Gas limit" :subtitle="String(data.gas_limit || 0)" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Storage limit" :subtitle="(data.storage_limit) || 0 | bytes" />
      </v-col>
      <v-col cols="2" v-if="address" class="py-0 d-flex justify-end align-center">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" v-if="!data.mempool && data.id" icon class="mr-2 text--secondary" @click="getRawJSON">
              <v-icon>mdi-code-json</v-icon>
            </v-btn>
          </template>
          <span>View raw JSON</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon class="mr-2 text--secondary" @click="getRawJSON">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy operation hash</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" :href="`/${data.network}/opg/${data.hash}`" target="_blank" icon class="mr-2 text--secondary">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <span>View operation group</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-4 pt-4">
      <v-col cols="11">
        <span v-if="data.internal" class="mr-2 hash font-weight-thin">internal</span>
        <span v-if="data.entrypoint" class="hash secondary--text">{{ data.entrypoint }}</span>
        <span v-else class="hash accent--text">{{ data.kind }}</span>
        <v-chip
          class="ml-3 overline"
          :color="statusColor"
          small
          outlined
          label
        >{{ data.status }}</v-chip>
      </v-col>
      <v-col cols="1" class="py-0 d-flex justify-end align-center" v-if="hasParameters || hasStorageDiff">
        <v-btn v-if="showParams" text small @click="showParams = !showParams" class="text--secondary">
          <v-icon small class="mr-1">mdi-file-tree</v-icon><span>Hide details</span>
        </v-btn>
        <v-btn v-else text small @click="showParams = !showParams">
          <v-icon small class="mr-1">mdi-file-tree</v-icon><span>Show details</span>
        </v-btn>      
      </v-col>
      <v-col cols="2">
        <AccountBox
          v-if="data.source"
          :title="sourceHeader"
          :address="data.source"
          :alias="data.source_alias"
          :highlighted="data.source == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2">
        <AccountBox
          :title="destinationHeader"
          :address="data.destination"
          :alias="data.destination_alias"
          :highlighted="data.destination == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Amount" :subtitle="(isNaN(data.amount) ? 0 : data.amount) | uxtz" />
      </v-col>
      <v-col cols="2" v-if="data.delegate">
        <AccountBox
          title="Delegate"
          :address="data.delegate"
          :alias="data.delegate_alias"
          :highlighted="false"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2" v-if="!data.mempool && data.result && data.result.consumed_gas">
        <InfoItem title="Consumed Gas" :subtitle="consumedGas" />
      </v-col>
      <v-col cols="2" v-if="!data.mempool && data.result && data.status === 'applied'">
        <InfoItem title="Paid storage diff" :subtitle="paidStorageDiff" />
      </v-col>
      <v-col cols="2" v-if="!data.mempool && data.result && data.result.allocated_destination_contract">
        <InfoItem title="Allocation fee" :subtitle="allocationFee | uxtz" />
      </v-col>      
    </v-row>

    <v-expand-transition>
      <div v-show="showParams" class="px-4 pb-2">
        <v-row v-if="errors" no-gutters>
          <v-col>
            <OperationAlert :errors="errors" :operationId="data.id" />
          </v-col>
        </v-row>
        <v-row class="my-1 parameters px-2 py-3 canvas" v-if="hasParameters || hasStorageDiff" no-gutters>
          <v-col cols="6">
            <div v-if="hasParameters">
              <span class="overline ml-3">Parameter</span>
              <v-treeview
                :items="parameters"
                :active.sync="activeParameter"
                hoverable
                open-all
                transition
                activatable
                open-on-click
                return-object
              >
                <template v-slot:label="{ item }">
                  <div class="tree-label">
                    <span :class="item.name.startsWith('@') ? 'accent--text' : ''">{{ item.name }}:</span>&nbsp;
                    <span :class="item.type">{{ item.value }}</span>
                  </div>
                </template>
              </v-treeview>
            </div>
          </v-col>
          <v-col cols="6">
            <div v-if="hasStorageDiff">
              <span class="overline ml-3">Storage</span>&nbsp;
              <span class="grey--text caption" v-if="data.result">{{ data.result.storage_size | bytes}}</span>
              <v-treeview
                :items="storage.tree"
                :open="storage.open"
                :active.sync="activeStorage"
                hoverable
                transition
                activatable
                open-on-click
                return-object
              >
                <template v-slot:label="{ item }">
                  <div :class="`${item.kind} pl-1 tree-label`">
                    <span v-if="hasAddress(item.name)">
                      <span>{{ item.name }}:</span>
                      <v-btn
                        @click.prevent.stop="handleAddress(item.name)"
                        target="_blank"
                        tile
                        x-small
                        text
                      >
                        <v-icon class="accent--text" x-small>mdi-open-in-new</v-icon>
                      </v-btn>
                    </span>
                    <span v-else>
                      <span class="key">{{ item.name }}:&nbsp;</span>
                      <span v-if="item.value_type === 'big_map'" 
                            class="accent--text">big_map&nbsp;</span>
                    </span>
                    <span v-if="item.value_type === 'big_map' && item.children.length === 0"
                          class="text--secondary">0 diffs</span>
                    <span v-else :class="item.type">{{ item.value }}</span>
                  </div>
                </template>
              </v-treeview>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <v-dialog v-model="showRaw" fullscreen>
      <v-card>
        <v-card-title class="headline" primary-title>
          <span>Raw JSON viewer</span>
          <v-spacer></v-spacer>
          <v-btn icon text @click="showRaw = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-progress-linear v-if="loadingRaw" indeterminate color="primary"></v-progress-linear>
        <v-card-text class="mt-5">
          <vue-json-pretty v-if="!loadingRaw" :data="rawJson" :highlightMouseoverNode="true"></vue-json-pretty>
        </v-card-text>
      </v-card>
    </v-dialog>

    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="data.network" />
  </div>
</template>

<script>
import InfoItem from "@/components/InfoItem.vue";
import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import OperationAlert from "@/components/OperationAlert.vue";
import AccountBox from "@/components/AccountBox.vue";
import VueJsonPretty from "vue-json-pretty";

import { getTree } from "@/utils/diff.js";

export default {
  props: {
    data: Object,
    address: String,
    mainOperation: Object
  },
  components: {
    InfoItem,
    TreeNodeDetails,
    VueJsonPretty,
    OperationAlert,
    AccountBox
  },
  data: () => ({
    activeStorage: [],
    activeParameter: [],
    showParams: false,
    showTreeNodeDetails: false,
    showRaw: false,
    rawJson: null,
    loadingRaw: false
  }),
  created() {
    this.showParams =
      this.data.errors !== undefined ||
      this.data.destination === this.address ||
      this.address === undefined;
  },
  computed: {
    active() {
      if (this.activeStorage.length > 0) {
        return this.activeStorage[0];
      }
      if (this.activeParameter.length > 0) {
        return this.activeParameter[0];
      }
      return null;
    },
    errors() {
      if (!this.data.errors) return [];
      return this.data.errors;
    },
    source() {
      if (this.data.source_alias) {
        return this.data.source_alias;
      }
      if (this.data.source) {
        return this.data.source;
      }
      return "unset";
    },
    destination() {
      if (this.data.destination_alias) {
        return this.data.destination_alias;
      }
      if (this.data.destination) {
        return this.data.destination;
      }
      return "unset";
    },
    sourceHeader() {
      if (!this.data.internal) return "Source";
      return "Sender";
    },
    destinationHeader() {
      if (this.data.kind === "transaction") {
        return "Destination";
      } else if (this.data.kind === "delegation") {
        return "Delegate";
      } else if (this.data.kind === "origination") {
        return "Originated Contract";
      } else if (this.data.kind === "reveal") {
        return "Public Key";
      }
      return "Destination";
    },
    gasLimit() {
      if (this.data.internal) {
        return this.mainOperation.gas_limit;
      }
      return this.data.gas_limit;
    },
    storageLimit() {
      if (this.data.internal) {
        return this.mainOperation.storage_limit;
      }
      return this.data.storage_limit;
    },
    consumedGas() {
      if (this.data.result && this.data.result.consumed_gas) {
        let s = `${this.data.result.consumed_gas}`;
        if (this.gasLimit > 0) {
          s += ` (${(
            (this.data.result.consumed_gas * 100) /
            this.gasLimit
          ).toFixed(0)}%)`;
        }
        return s;
      }
      return "0 (0%)";
    },
    allocationFee() {
      if (this.data.result && this.data.result.allocated_destination_contract) {
        return 257000;
      }
      return 0;
    },
    paidStorageDiff() {
      if (this.data.result && this.data.result.paid_storage_size_diff) {
        let s = this.$options.filters.bytes(
          this.data.result.paid_storage_size_diff
        );
        if (this.storageLimit > 0) {
          s += ` (${(
            (this.data.result.paid_storage_size_diff * 100) /
            this.storageLimit
          ).toFixed(0)}%)`;
        }
        return s;
      }
      return this.$options.filters.bytes(0) + " (0%)";
    },
    parameters() {
      return getTree(this.data.parameters, true);
    },
    storage() {
      let tree = getTree(this.data.storage_diff, true);
      let open = tree.map(x => this.getChangedItems(x), this).flat();
      return { tree, open };
    },
    hasParameters() {
      return (
        this.data != null &&
        this.data !== undefined &&
        this.data.parameters != null &&
        this.data.parameters !== undefined
      );
    },
    hasStorageDiff() {
      return (
        this.data != null &&
        this.data !== undefined &&
        this.data.storage_diff != null &&
        this.data.storage_diff !== undefined
      );
    },
    statusColor() {
      if (this.data.status === "applied") return "success";
      if (this.data.status === "backtracked") return "warning";
      if (this.data.status === "failed") return "error";
      if (this.data.status === "pending") return "secondary";
      if (this.data.status === "lost") return "secondary";
      if (this.data.status === "branch_refused") return "error";
      if (this.data.status === "refused") return "error";
      return "secondary";
    },
    burned() {
      let val = this.data.burned || 0;
      if (!this.data.internal && !this.data.mempool && this.data.internal_operations) {
        for (let i = 0; i < this.data.internal_operations.length; i++) {
          val += this.data.internal_operations[i].burned || 0;
        }
      }
      return val;
    },
  },
  methods: {
    getRawJSON() {
      if (this.rawJson != null) {
        this.showRaw = true;
        return;
      }
      this.showRaw = true;
      this.loadingRaw = true;
      this.rpc
        .getOperation(this.data.network, this.data.level, this.data.hash)
        .then(res => {
          this.rawJson = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loadingRaw = false));
    },
    getChangedItems(item) {
      let res = item.children.map(x => this.getChangedItems(x), this).flat();
      if (item.kind || res.length > 0) res.push(item);
      return res;
    },
    hasAddress(s) {
      if (s !== undefined && /(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/.test(s)) {
        return s.startsWith("KT") || this.tzkt.supports(this.data.network);
      }
      return false;
    },
    handleAddress(s) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith("KT")) {
        let routeData = this.$router.resolve({
          path: `/${this.data.network}/${address}`
        });
        window.open(routeData.href, "_blank");
      } else {
        let href = this.tzkt.resolve(this.data.network, address);
        window.open(href, "_blank");
      }
    }
  },
  watch: {
    active(newVal) {
      if (newVal !== null) this.showTreeNodeDetails = true;
    },
    showTreeNodeDetails(newVal) {
      if (!newVal) {
        this.activeStorage = [];
        this.activeParameter = [];
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.address {
  font-size: 13px;
}

.parameters {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: var(--v-tree-base);
  }
  .object {
    opacity: .7;
  }
}

.added-tree-item {
  background-color: #4CAF5025;
  .value {
    color: var(--v-success-base);
  }
}
.removed-tree-item {
  background-color: #F4433625;
  .value {
    color: var(--v-error-base);
  }
}
.edited-tree-item {
  background-color: #FFC10725;
  .value {
    color: var(--v-warning-base);
  }
}

.v-dialog > .v-card > .v-card__title {
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>

<style>
.tree-label {
  font-size: 95% !important;
}
.v-treeview-node__root {
  min-height: 20px !important;
}
.vjs-tree .vjs-value__string {
  color: var(--v-tree-base);
}
</style>