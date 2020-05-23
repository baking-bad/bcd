<template>
  <v-expansion-panel class="bl-1 br-1 bt-1 bmd-panel" active-class="bmd-active-panel">
    <v-expansion-panel-header v-if="!single" class="px-4 pb-0 pt-1" ripple>
      <v-row no-gutters>
        <v-col cols="8" class="d-flex align-center justify-start text-truncate">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="hash">{{ diff.data.key_string }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <span class="key-string"></span>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="hash font-weight-light">{{ helpers.plural(diff.count, 'update') }}</v-list-item-title>
              <v-list-item-subtitle              
                class="hash error--text"
                v-if="!diff.data.value"
              >removed</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="hash font-weight-light">{{ diff.data.timestamp | formatDate }}</v-list-item-title>
              <v-list-item-subtitle class="hash font-weight-light">level {{ diff.data.level }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="pl-1 pt-2">
      <v-row no-gutters>
        <v-col cols=8>
          <v-list-item class="pl-1">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Key hash</v-list-item-subtitle>
              <v-list-item-title class="key-hash">{{ diff.data.key_hash }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
         <v-col cols="4" class="d-flex align-center justify-end">
          <v-btn
            v-if="!single"
            class="mr-4"
            small text
            :to="{
              name: 'big_map_history', 
              params: {
                network: network,
                address: address,
                ptr: ptr,
                keyhash: diff.data.key_hash
              }
            }"
          >
            <v-icon small class="mr-1">mdi-history</v-icon>
            <span>View history</span>
          </v-btn>
          <v-btn small text @click="getRawJSON">
            <v-icon small class="mr-1">mdi-code-braces</v-icon>
            <span>Raw JSON</span>
          </v-btn>
        </v-col>
        <v-col cols="12" class="bmd px-2 py-4 my-2 ba-1">
          <span class="overline ml-3">Key</span>
          <v-treeview
            :items="keyTree"
            :active.sync="activeKey"
            hoverable
            open-all
            transition
            activatable
            open-on-click
            return-object
          >
            <template v-slot:label="{ item }">
              <span>{{ item.name }}</span>&nbsp;
              <span :class="item.type">{{ item.value }}</span>
            </template>
          </v-treeview>
        </v-col>     
        <v-col cols="12" class="bmd px-2 py-4 my-2 ba-1" v-if="diff.data.value">
          <span class="overline ml-3">Value</span>
          <v-treeview
            :items="valueTree"
            :open="valueOpen"
            :active.sync="activeValue"
            hoverable
            open-all
            transition
            activatable
            open-on-click
            return-object
          >
            <template v-slot:label="{ item }">
              <span>{{ item.name }}</span>&nbsp;
              <span :class="item.type">{{ item.value }}</span>
            </template>
          </v-treeview>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="network" :address="address" />  
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
  </v-expansion-panel>
</template>

<script>
import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import VueJsonPretty from "vue-json-pretty";
import { getTree } from "@/utils/diff.js";

export default {
  name: "BigMapDiff",
  components: {
    TreeNodeDetails,
    VueJsonPretty
  },
  props: {
    ptr: String,
    diff: Object,
    network: String,
    address: String,
    single: Boolean
  },
  data: () => ({
    showTreeNodeDetails: false,
    activeKey: [],
    activeValue: [],
    showRaw: false,
    rawJson: null,
    loadingRaw: false
  }),
  computed: {
    active() {
      if (this.activeKey.length > 0) {
        return this.activeKey[0];
      }
      if (this.activeValue.length > 0) {
        return this.activeValue[0];
      }
      return null;
    },
    keyTree() {
      return getTree(this.diff.data.key, true);
    },
    valueTree() {
      return getTree(this.diff.data.value, true);
    },
    valueOpen() {
      return this.valueTree.map(x => this.getChangedItems(x), this).flat()
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
      this.rpc.getBigMapValue(this.network, this.diff.data.level, this.$route.params.ptr, this.diff.data.key_hash)
        .then(res => {
          this.rawJson = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loadingRaw = false));
    },
    getChangedItems(item) {
      let res = item.children.map(x => this.getChangedItems(x), this).flat();
      res.push(item);
      return res;
    },
  },
  watch: {
    active(newVal) {
      if (newVal !== null) this.showTreeNodeDetails = true;
    },
    showTreeNodeDetails(newVal) {
      if (!newVal) {
        this.activeKey = [];
        this.activeValue = [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.key-string {
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
}

.bmd {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;
  background: var(--v-canvas-base);
  border: none !important;

  .value {
    color: var(--v-tree-base);
  }
}

.key-hash {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;
}
.v-dialog > .v-card > .v-card__title {
  position: sticky;
  top: 0;
  z-index: 999;
  background: white;
  border-bottom: 1px solid #eee;
}

.bmd-panel {
  background-color: var(--v-data-base) !important;
}

.bmd-panel > .v-expansion-panel-header {
  background: var(--v-data-base);
}

.bmd-active-panel > .v-expansion-panel-header {
  background: var(--v-sidebar-base);
  opacity: .8;
}

.bmd-active-panel, .bmd-panel.v-expansion-panel--next-active {
  border-bottom: 1px solid var(--v-border-base);
}
</style>
