<template>
  <div class="mb-5">
    <v-row>
      <v-col cols="12" class="py-0">
        <span class="operation-title">{{ header }}</span>
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
    <v-row>
      <v-col cols="4" v-if="data.source" class="py-0">
        <InfoItem title="Source" :subtitle="data.source" :selected="address == data.source" />
      </v-col>
      <v-col cols="4" v-if="data.destination" class="py-0">
        <InfoItem
          title="Destination"
          :subtitle="data.destination"
          :selected="address == data.destination"
        />
      </v-col>
      <v-col cols="3" class="py-0 d-flex flex-horizontal">
        <InfoItem title="Amount" :subtitle="data.amount | uxtz" v-if="data.amount" />
        <InfoItem title="Counter" :subtitle="String(data.counter)" v-if="data.counter" />
      </v-col>
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
      <v-expand-transition>
        <v-col cols="12" v-show="showParams">
          <v-row>
            <v-col cols="2" v-if="data.gas_limit">
              <InfoItem title="Gas limit" :subtitle="data.gas_limit| uxtz" />
            </v-col>
            <v-col cols="2" v-if="data.result.consumed_gas">
              <InfoItem title="Consumed Gas" :subtitle="data.result.consumed_gas | uxtz" />
            </v-col>
            <v-col cols="2" v-if="data.result.storage_size">
              <InfoItem title="Storage Size" :subtitle="String(data.result.storage_size)" />
            </v-col>
            <v-col cols="2" v-if="data.fee">
              <InfoItem title="Fee" :subtitle="data.fee | uxtz" />
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
              <span class="overline ml-3">Storage</span>
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
        </v-col>
      </v-expand-transition>
    </v-row>
  </div>
</template>

<script>
import InfoItem from "@/components/InfoItem.vue";
import { getTree } from "@/utils/tree.js";

export default {
  props: {
    data: Object,
    address: String
  },
  components: {
    InfoItem
  },
  computed: {
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
      if (this.data.result.status === 'applied') return 'green';
      if (this.data.result.status === 'backtracked') return 'orange';
      if (this.data.result.status === 'failed') return 'red';
      return 'light-grey';
    }
  },
  data: () => ({
    showParams: false
  })
};
</script>


<style lang="scss" scoped>
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
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>