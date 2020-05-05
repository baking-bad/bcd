<template>
  <div class="pb-2">
    <v-row v-if="!data.internal" no-gutters class="pl-4 pr-6 py-1 mb-1 operation-info">
      <v-col v-if="!address">
        <InfoItem title="Time" :subtitle="formatDate(data.timestamp)" />
      </v-col>
      <v-col v-if="!address">
        <InfoItem title="Level" :subtitle="String(data.level)" />
      </v-col>
      <v-col v-if="!address">
        <InfoItem title="Counter" :subtitle="String(data.counter)" />
      </v-col>
      <v-col>
        <InfoItem title="Fee" :subtitle="(data.fee || 0) | uxtz" />
      </v-col>
      <v-col>
        <InfoItem title="Burned" :subtitle="(burned || 0) | uxtz" />
      </v-col>
      <v-col>
        <InfoItem title="Gas limit" :subtitle="String(data.gas_limit || 0)" />
      </v-col>
      <v-col>
        <InfoItem title="Storage limit" :subtitle="(data.storage_limit) || 0 | bytes" />
      </v-col>
      <v-spacer v-if="address"></v-spacer>
      <v-col cols="1" v-if="!data.mempool && address" class="py-0 d-flex justify-end align-center pr-8">
        <v-btn small depressed class="d-flex align-center" :href="opgHref" target="_blank">
          <v-icon x-small>mdi-open-in-new</v-icon>
          <span class="overline ml-1">In new tab</span>
        </v-btn>
      </v-col>
      <v-col cols="1" v-if="!data.mempool" class="py-0 d-flex justify-end align-center">
        <v-btn small depressed class="d-flex align-center" @click="getRawJSON">
          <v-icon x-small>mdi-code-braces</v-icon>
          <span class="overline ml-1">Raw JSON</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-5">
      <v-col cols="12" class="title">
        <span :class="headerClass">{{ header }}</span>
        <v-chip
          class="ml-3"
          :color="statusColor"
          outlined
          x-small
          label
          dense
          tile
        >{{ data.status }}</v-chip>
      </v-col>
      <v-col cols="4" class="pr-4">
        <AccountBox
          :title="sourceHeader"
          :address="data.source"
          :alias="data.source_alias"
          :highlighted="data.source == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="4" class="pr-4">
        <AccountBox
          :title="destinationHeader"
          :address="data.destination"
          :alias="data.destination_alias"
          :highlighted="data.destination == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2" class="pr-4">
        <InfoItem title="Amount" :subtitle="amount | uxtz" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1" class="py-0 d-flex justify-end align-center" v-if="hasDetails">
        <v-btn
          :text="showParams"
          :depressed="!showParams"
          :color="showParams ? 'grey' : ''"
          small
          @click="showParams = !showParams"
          class="d-flex align-center"
        >
          <span class="overline">{{btnText}} details</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="showParams" class="px-5 pb-2">
        <v-row v-if="errors" no-gutters>
          <v-col>
            <OperationAlert :errors="errors" :operationId="data.id"/>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="!data.mempool">
          <v-col cols="2" v-if="data.result.consumed_gas">
            <InfoItem title="Consumed Gas" :subtitle="consumedGas" />
          </v-col>
          <v-col cols="3" v-if="data.status === 'applied'">
            <InfoItem title="Paid storage diff" :subtitle="paidStorageDiff" />
          </v-col>
          <v-col cols="2" v-if="data.result.allocated_destination_contract">
            <InfoItem title="Allocation fee" :subtitle="allocationFee | uxtz" />
          </v-col>
        </v-row>
        <v-row class="my-1 parameters px-2 py-3" v-if="hasParameters || hasStorageDiff" no-gutters>
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
                    <span :class="item.name.startsWith('@') ? 'purple--text' : ''">{{ item.name }}:</span>&nbsp;
                    <span :class="item.type">{{ item.value }}</span>
                  </div>
                </template>
              </v-treeview>
            </div>
          </v-col>
          <v-col cols="6">
            <div v-if="hasStorageDiff">
              <span class="overline ml-3">Storage</span>&nbsp;
              <span class="grey--text caption">{{ data.result.storage_size | bytes}}</span>
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
                        <v-icon class="purple--text" x-small>mdi-open-in-new</v-icon>
                      </v-btn>
                    </span>
                    <span v-else>
                      <span>{{ item.name }}:&nbsp;</span>
                      <span v-if="item.value_type === 'big_map'" 
                            class="purple--text">big_map&nbsp;</span>
                    </span>
                    <span v-if="item.value_type === 'big_map' && item.children.length === 0"
                          :class="item.type">0 diffs</span>
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
import dayjs from "dayjs";

import InfoItem from "@/components/InfoItem.vue";
import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import OperationAlert from "@/components/OperationAlert.vue";
import AccountBox from "@/components/AccountBox.vue"
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
      if (this.data.result.consumed_gas) {
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
      if (this.data.result.allocated_destination_contract) {
        return 257000;
      }
      return 0;
    },
    paidStorageDiff() {
      if (this.data.result.paid_storage_size_diff) {
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
    amount() {
      if (isNaN(this.data.amount)) return 0;
      return this.data.amount;
    },
    header() {
      if (this.data.internal) {
        if (this.data.entrypoint) {
          return `Internal call ${this.data.entrypoint}`;
        }
        return `Internal ${this.data.kind}`;
      }
      if (this.data.entrypoint) {
        return `Call ${this.data.entrypoint}`;
      }
      return this.data.kind;
    },
    btnText() {
      if (this.showParams) {
        return "hide";
      }
      return "show";
    },
    parameters() {
      return getTree(this.data.parameters, true);
    },
    storage() {
      let tree = getTree(this.data.storage_diff, true);
      let open = tree.map(x => this.getChangedItems(x), this).flat();
      return { tree, open };
    },
    hasDetails() {
      return (
        this.hasParameters ||
        this.hasStorageDiff ||
        (this.data.result &&
          (this.data.result.errors ||
            this.data.result.consumed_gas ||
            this.data.result.paid_storage_size_diff ||
            this.data.result.allocated_destination_contract))
      );
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
      if (this.data.status === "applied") return "green";
      if (this.data.status === "backtracked") return "orange";
      if (this.data.status === "failed") return "red";
      if (this.data.status === "pending") return "grey";
      if (this.data.status === "lost") return "black";
      if (this.data.status === "branch_refused") return "red";
      if (this.data.status === "refused") return "red";
      return "grey";
    },
    headerClass() {
      if (this.data.entrypoint) return "overline call";
      return `overline ${this.data.kind}`;
    },
    burned() {
      let val = this.data.burned || 0;
      if (!this.data.internal && !this.data.mempool) {
        for (let i = 0; i < this.data.internal_operations.length; i++) {
          val += this.data.internal_operations[i].burned || 0;
        }
      }

      return val;
    },
    opgHref() {
      let routeData = this.$router.resolve({
        name: "opg",
        params: { hash: this.data.hash }
      });
      return routeData.href;
    }
  },
  methods: {
    getRawJSON() {
      if (this.rawJson != null) {
        this.showRaw = true;
        return;
      }
      this.showRaw = true;
      this.loadingRaw = true;
      this.rpc.getOperation(this.data.network, this.data.level, this.data.hash)
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
      if (address.startsWith('KT')) {
        let routeData = this.$router.resolve({ path: `/${this.data.network}/${address}` });
        window.open(routeData.href, '_blank');
      } else {
        let href = this.tzkt.resolve(this.data.network, address);
        window.open(href, '_blank');
      }
    },
    formatDate(value) {
      let d = dayjs(value);
      if (value) {
        if (d.year() < dayjs().year()) return d.format("MMM D HH:mm, YYYY");
        if (d.add(1, "days").isBefore(dayjs())) return d.format("MMM D HH:mm");
        return d.fromNow();
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
.operation-info {
  background: rgb(250, 250, 250);
  border-left: 4px solid rgb(230, 230, 230);
}

.address {
  font-size: 13px;
}

.internal {
  border-left: 1px solid lightgrey;
}
.operation-body {
  .operation-title {
    font-size: 13px;
    text-transform: uppercase;
  }
}

.parameters {
  border: 1px solid #ddd;
  font-size: 12px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: #6ba13b;
  }
  .object {
    color: #bbb;
  }
}

.added-tree-item {
  background-color: #dcedc8;
}
.removed-tree-item {
  background-color: #ffedef;
  color: #721c24;
}
.edited-tree-item {
  background-color: #fff3cd;
  color: #856404;

  .value {
    color: black;
  }
}

.title {
  .call {
    color: #8b008b;
  }
  .delegation,
  .origination {
    color: navy;
  }
  color: #76a34e;
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
.tree-label {
  font-size: 95% !important;
}
.v-treeview-node__root {
  min-height: 20px !important;
}
.vjs-tree .vjs-value__string {
  color: green;
}
</style>