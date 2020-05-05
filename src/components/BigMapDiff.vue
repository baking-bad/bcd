<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="px-4 pb-0 pt-1" ripple>
      <template v-slot:default="{ open }">
        <v-row no-gutters>
          <v-col cols="8" class="d-flex align-center justify-start text-truncate">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle v-if="open" class="overline grey--text">Key hash</v-list-item-subtitle>
                <v-list-item-subtitle v-if="open" class="hash">{{ diff.data.key_hash }}</v-list-item-subtitle>
                <v-list-item-title v-if="!open" class="key-string">{{ diff.data.key_string }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <span class="key-string"></span>
          </v-col>
          <v-col cols="2" class="d-flex align-center">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="overline">{{ diff.data.timestamp | formatDate }}</v-list-item-title>
                <v-list-item-subtitle class="overline grey--text">{{ diff.data.level }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="2" class="d-flex align-center">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="overline">{{ plural(diff.count, 'update') }}</v-list-item-title>
                <v-list-item-subtitle
                  class="overline red--text"
                  v-if="!diff.data.value"
                >removed</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="pl-1">
      <v-row no-gutters>
        <v-col cols="7" class="bmd pa-2 my-2">
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
              <span class="grey--text text--darken-2">{{ item.name }}</span>&nbsp;
              <span :class="item.type">{{ item.value }}</span>
            </template>
          </v-treeview>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" class="my-1">
          <v-btn small depressed @click="getRawJSON">
            <v-icon x-small>mdi-code-braces</v-icon>
            <span class="overline ml-1">Raw JSON</span>
          </v-btn>
        </v-col>
        <v-col cols="2" class="my-1">
          <v-btn
            small depressed
            :to="{name: 'bigmapdiff', 
            params: {
              network: $route.params.network,
              address: $route.params.address,
              ptr: $route.params.ptr,
              keyhash: diff.data.key_hash
              }
            }"
          >
            <v-icon x-small>mdi-history</v-icon>
            <span class="overline ml-1">View history</span>
          </v-btn>
        </v-col>
        <v-col cols="7" class="bmd pa-2 my-2" v-if="diff.data.value">
          <span class="overline ml-3">Value</span>
          <v-treeview
            :items="valueTree"
            :active.sync="activeValue"
            hoverable
            open-all
            transition
            activatable
            open-on-click
            return-object
          >
            <template v-slot:label="{ item }">
              <span class="grey--text text--darken-2">{{ item.name }}</span>&nbsp;
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
import { plural } from "@/utils/plural.js";
import { getTree } from "@/utils/diff.js";

export default {
  name: "BigMapDiff",
  components: {
    TreeNodeDetails,
    VueJsonPretty
  },
  props: {
    diff: Object,
    network: String,
    address: String
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
    }
  },
  methods: {
    plural(count, word) {
      return plural(count, word);
    },
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
  color: #444;
}

.bmd {
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

.key-hash {
  font-size: 0.9em;
  margin-left: 38px;
}
.v-dialog > .v-card > .v-card__title {
  position: sticky;
  top: 0;
  z-index: 999;
  background: white;
  border-bottom: 1px solid #eee;
}
</style>
