<template>
  <div v-if="token" class="py-2 px-7 mr-6 metadata-base">
    <v-row no-gutters>
      <v-col cols="2">
        <v-list-item class="pl-1">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Token ID</v-list-item-subtitle>
            <v-list-item-title class="key-hash">{{ token.token_id }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="6">
        <v-list-item v-if="token.supply" class="pl-1">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Total supply</v-list-item-subtitle>
            <v-list-item-title class="hash">{{ formatTokenAmount(token.supply) }}
              &nbsp;<span class="caption text-uppercase font-weight-regular text--secondary">{{ token.symbol ? token.symbol : '' }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="4" class="d-flex align-center justify-end">
        <v-btn small text @click="showRaw = true">
          <v-icon small class="mr-1">mdi-code-braces</v-icon>
          <span>Raw JSON</span>
        </v-btn>
      </v-col>
      <v-col cols="12" class="px-2 py-4 my-2 ba-1">
        <span class="overline ml-3">Token info</span>
        <v-treeview
          :items="treeView"
          hoverable
          transition
          open-on-click
          return-object
          class="no-padding-arrow beautify-fonts mt-2"
        >
          <template v-slot:label="{ item }">
            <div @click="showTreeInfo(item)">
              <span class="key">
                {{item.name.split(':')[0].trim()}}:
              </span>
              <span
                v-if="item.children || isObjectValue(getValueFromName(item.name))"
                class="value_white"
              >
                {{ getValue(item.name, item.children) }}
                <v-treeview
                  :items="item.children ? makeView(item.children) : makeView(JSON.parse(getValueFromName(item.name)))"
                  open-on-click
                  open-all
                  expand-icon=""
                >
                  <template v-slot:label="{ item }">
                    <span class="key">
                      {{item.name.split(':')[0].trim()}}:
                    </span>
                    <span
                        class="value"
                    >
                      {{getValue(item.name)}}
                    </span>
                  </template>
                </v-treeview>
              </span>
              <span
                  v-else
                  class="value"
              >
                {{ getValue(item.name, item.children) }}
              </span>
            </div>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
    <TreeNodeDetails
      v-model="showTreeNodeDetails"
      :data="dataTreeNode"
      :network="token.network"
    />
    <RawJsonViewer
        :show.sync="showRaw"
        type="token metadata"
        :raw="tokenInfo"
        :is-copiable-options="true"
    />
  </div>
</template>

<script>
import { makeTreeview } from '@/utils/parsing';
import TreeNodeDetails from "@/components/Dialogs/TreeNodeDetails";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer";

export default {
  name: "TokenMetadata",
  components: { TreeNodeDetails, RawJsonViewer },
  props: {
    token: Object,
  },
  data() {
    return {
      showTreeNodeDetails: false,
      dataTreeNode: {},
      showRaw: false
    }
  },
  methods: {
    formatTokenAmount(amount) {
      const decimals = this.token && this.token.decimals ? this.token.decimals : 0;
      return this.helpers
          .round(amount, decimals)
          .toLocaleString(undefined, { maximumFractionDigits: decimals })
    },
    showTreeInfo(item) {
      if (item.children) {
        return;
      }
      const splittedItem = item.name.split(':');
      const name = splittedItem[0].trim();
      const value = splittedItem.slice(1,).join(':').trim();
      this.dataTreeNode.val = value;
      this.dataTreeNode.name = name;
      this.dataTreeNode.realPrim = name;
      this.showTreeNodeDetails = true;
    },
    getValueFromName(name) {
      return name.split(':').slice(1,).join(':').trim();
    },
    isObjectValue(value) {
      try {
        if (typeof JSON.parse(value) === "object") {
          return true;
        }
      } catch (e) {
        return false;
      }

      return false;
    },
    getValue(name, children) {
      const value = this.getValueFromName(name);
      if (children && children.length > 0 || this.isObjectValue(value)) {
        return '';
      }
      return value;
    },
    makeView(obj) {
      return makeTreeview(obj);
    },
  },
  computed: {
    tokenInfo() {
      if (this.token) {
        return Object.assign({}, {
          name: this.token.name,
          symbol: this.token.symbol,
          decimals: this.token.decimals
        }, this.token.token_info);
      } else {
        return null;
      }
    },
    treeView() {
      return makeTreeview(this.tokenInfo)
    }
  }
}
</script>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>

<style lang="scss" scoped>
.v-treeview {
  font-size: 14px;
  font-weight: 400;
  font-family: "Roboto Mono", monospace;

  .key {
    opacity: 0.8;
  }
  .value {
    color: var(--v-tree-base);
  }
  .object {
    opacity: 0.8;
    font-weight: 300;
  }
}
.metadata-base {
  background-color: var(--v-data-base);
  border: 1px solid var(--v-border-base);
}
</style>
