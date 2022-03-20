<template>
  <div v-if="token" class="py-2 px-7 mr-6 metadata-base">
    <v-row no-gutters>
      <v-col cols="3">
        <v-list-item class="pl-1">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Token ID</v-list-item-subtitle>
            <div class="d-flex">
              <v-list-item-title class="key-hash">{{ token.token_id }}</v-list-item-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    icon
                    @click="
                      () => {
                        $clipboard(token.token_id);
                        showClipboardOK();
                      }
                    "
                  >
                    <v-icon class="text--secondary">mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                Copy Token ID
              </v-tooltip>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="6">
        <v-list-item v-if="ipfsURI" class="pl-1">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Metadata URI</v-list-item-subtitle>
            <div class="d-flex">
              <v-list-item-title class="hash">{{ ipfsURI }}</v-list-item-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    icon
                    class="mr-2"
                    @click="
                      () => {
                        $clipboard(ipfsURI);
                        showClipboardOK();
                      }
                    "
                  >
                    <v-icon class="text--secondary">mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                Copy address
              </v-tooltip>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="3" class="d-flex align-center justify-end">
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
                v-if="isTreeViewable(item)"
              >
                <v-treeview
                  :items="item.children ? makeView(item.children) : makeView(JSON.parse(getValueFromName(item.name)))"
                  :open-on-click="false"
                  open-all
                  expand-icon=""
                >
                  <template v-slot:label="{ item }">
                    <div @click.exact.stop.prevent="showTreeInfo(item)">
                      <span class="key">
                        {{item.name.split(':')[0].trim()}}:
                      </span>
                      <span
                          class="value"
                      >
                        {{getValue(item.name)}}
                       </span>
                    </div>
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
import {mapActions} from "vuex";

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
      showRaw: false,
      ignoredKeys: [
        'level',
        'timestamp',
        'contract',
        'network',
        'token_id',
        'extras',
      ]
    }
  },
  methods: {
    ...mapActions(["showClipboardOK"]),
    isTreeViewable(item) {
      return this.isObjectValue(this.getValueFromName(item.name));
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
        return Object.fromEntries(
          Object.entries(this.token)
            .filter(([key]) => -1 == this.ignoredKeys.indexOf(key)));
      } else {
        return null;
      }
    },
    treeView() {
      return makeTreeview(this.tokenInfo)
    },
    ipfsURI() {
      return this.token.extras? this.token.extras["@@empty"] : null;
    },
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
.key-hash {
  max-width: 50%;
}
.hash {
  max-width: 33%;
}
.metadata-base {
  background-color: var(--v-data-base);
  border: 1px solid var(--v-border-base);
}
</style>
