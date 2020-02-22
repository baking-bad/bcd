<template>
  <div class="my-3">
    <v-row no-gutters v-if="!data.internal">
      <v-col cols="2" v-if="data.fee">
        <InfoItem title="Fee" :subtitle="data.fee | uxtz" />
      </v-col>
      <v-col cols="2" v-if="data.gas_limit">
        <InfoItem title="Gas limit" :subtitle="data.gas_limit | mutez" />
      </v-col>
      <v-col cols="2" v-if="data.storage_limit">
        <InfoItem title="Storage limit" :subtitle="data.storage_limit | bytes" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1" class="py-0 d-flex justify-end align-center" v-if="!data.mempool">
        <v-btn small text color="grey" class="d-flex align-center" @click="getRawJSON">
          <span class="overline">Raw JSON</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
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
        >{{ data.result.status }}</v-chip>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col cols="4">
        <InfoItem
          :title="sourceHeader"
          :subtitle="source"
          :selected="source == this.address"
          :to="getLinkObject(source)"
          :href="getTzKTLink(source)"
        />
      </v-col>
      <v-col cols="4">
        <InfoItem
          :title="destinationHeader"
          :subtitle="destination"
          :selected="destination == this.address"
          :to="getLinkObject(destination)"
          :href="getTzKTLink(destination)"
        />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Amount" :subtitle="amount | uxtz" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1" class="py-0 d-flex justify-end align-center" v-if="hasDetails">
        <v-btn
          text
          small
          @click="showParams = !showParams"
          color="grey"
          class="d-flex align-center"
        >
          <span class="overline">{{btnText}} details</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="showParams">
        <v-row>
          <v-col cols="2" v-if="data.result.consumed_gas">
            <InfoItem title="Consumed Gas" :subtitle="consumedGas" />
          </v-col>
          <v-col cols="2" v-if="data.result.paid_storage_size_diff">
            <InfoItem title="Paid storage diff" :subtitle="paidStorageDiff" />
          </v-col>
        </v-row>
        <v-row class="parameters mx-1">
          <v-col cols="6" v-if="hasParameters">
            <span class="overline ml-3">Parameter</span>
            <v-treeview :items="parameters" hoverable open-all transition>
              <template v-slot:label="{ item }">
                <span>{{ item.name }}:</span>&nbsp;
                <span :class="item.type">{{ item.value }}</span>
              </template>
            </v-treeview>
          </v-col>
          <v-col cols="6" v-if="hasStorageDiff">
            <span class="overline ml-3">Storage</span>&nbsp;
            <span class="grey--text caption">{{ data.result.storage_size | bytes}}</span>
            <v-treeview :items="storage" hoverable open-all transition>
              <template v-slot:label="{ item }">
                <div :class="`${item.kind} pl-1`">
                  <span>{{ item.name }}:</span>&nbsp;
                  <span :class="item.type">{{ item.value }}</span>
                </div>
              </template>
            </v-treeview>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <v-dialog v-model="showRaw" width="700">
      <v-card>
        <v-card-title class="headline secondary" primary-title>
          <span>Raw JSON</span>
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
  </div>
</template>

<script>
import InfoItem from "@/components/InfoItem.vue";
import { getTree } from "@/utils/tree.js";
import { getOperation } from "@/api/node.js";
import VueJsonPretty from "vue-json-pretty";

export default {
  props: {
    data: Object,
    address: String
  },
  components: {
    InfoItem,
    VueJsonPretty
  },
  computed: {
    source() {
      if (this.data.source) {
        return this.data.source;
      }
      return "unset";
    },
    destination() {
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
    consumedGas() {
      if (this.data.result.consumed_gas) {
        let s = this.$options.filters.mutez(this.data.result.consumed_gas);
        if (this.data.gas_limit > 0) {
          s += ` (${(
            (this.data.result.consumed_gas * 100) /
            this.data.gas_limit
          ).toFixed(0)}%)`;
        }
        return s;
      }
      return "0";
    },
    paidStorageDiff() {
      if (this.data.result.paid_storage_size_diff) {
        let s = this.$options.filters.bytes(
          this.data.result.paid_storage_size_diff
        );
        if (this.data.storage_limit > 0) {
          s += ` (${(
            (this.data.result.paid_storage_size_diff * 100) /
            this.data.storage_limit
          ).toFixed(0)}%)`;
        }
        return s;
      }
      return "0";
    },
    amount() {
      if (isNaN(this.data.amount)) return 0;
      return this.data.amount;
    },
    entryName() {
      if (this.address == this.data.destination) {
        if (
          this.data.parameters != null &&
          this.data.parameters !== undefined
        ) {
          let keys = Object.keys(this.data.parameters);
          if (keys.length == 1) {
            let name = keys[0];
            if (this.data.parameters[name] !== undefined) return name;
          }
          return "__entry__0";
        }
      }
      return null;
    },
    header() {
      if (this.entryName != null) {
        return `Call ${this.entryName}`;
      }
      if (this.data.internal) {
        return `Internal ${this.data.kind}`;
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
      return getTree(this.data.parameters);
    },
    storage() {
      return getTree(this.data.storage_diff);
    },
    hasDetails() {
      return this.hasParameters || this.hasStorageDiff;
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
      if (this.data.result.status === "applied") return "green";
      if (this.data.result.status === "backtracked") return "orange";
      if (this.data.result.status === "failed") return "red";
      if (this.data.result.status === "lost") return "red";
      if (this.data.result.status === "branch_refused") return "red";
      if (this.data.result.status === "refused") return "red";
      return "light-grey";
    },
    headerClass() {
      if (this.entryName != null) return "overline call";
      return `overline ${this.data.kind}`;
    }
  },
  data: () => ({
    showParams: false,
    showTreeNodeDetails: false,
    selectedNode: null,
    showRaw: false,
    rawJson: null,
    loadingRaw: false
  }),
  methods: {
    getLinkObject(address) {
      if (address.startsWith("KT") && address != this.address) {
        return {
          name: "project",
          params: {
            address: address,
            network: this.data.network
          }
        };
      }
    },
    getTzKTLink(address) {
      if (address.startsWith("tz")) {
        if (this.data.network === "mainnet")
          return `https://tzkt.io/${address}`;
        else if (this.data.network === "babylonnet")
          return `https://babylon.tzkt.io/${address}`;
        else if (this.data.network === "carthagenet")
          return `https://carthage.tzkt.io/${address}`;
      }
    },
    getRawJSON() {
      if (this.rawJson != null) {
        this.showRaw = true;
        return;
      }
      this.showRaw = true;
      this.loadingRaw = true;
      getOperation(this.data.network, this.data.level, this.data.hash)
        .then(res => {
          this.rawJson = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loadingRaw = false));
    }
  }
};
</script>


<style lang="scss" scoped>
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
  background-color: #f8d7da;
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
</style>

<style>
.v-treeview-node__label {
  white-space: unset;
}
.v-treeview-node__root {
  min-height: 20px !important;
}
.vjs-tree .vjs-value__string {
  color: green;
}
</style>