<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <v-card tile class="ma-3 pa-3" v-else-if="contract.storage">
      <v-treeview
        :items="items"
        hoverable
        open-all
        transition
        activatable
        open-on-click
        return-object
        class="storage"
        :active.sync="activeField"
      >
        <template v-slot:label="{ item }">
          <span>{{ item.name }}:</span>&nbsp;
          <span :class="item.type" v-if="item.value_type !== 'big_map'">{{ item.value }}</span>
          <v-btn
            :to="{ name: 'bigmap', params: { address: contract.address, ptr: item.value, newtork: contract.network}}"
            text
            tile
            x-small
            color="primary"
            v-else
          >
            <v-icon x-small left>mdi-vector-link</v-icon>
            Big Map {{ item.value }}
          </v-btn>
        </template>
        <template v-slot:prepend="{ item, open }">
          <v-tooltip v-if="item.type === 'value'" left>
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on">{{ getTreeNodeIcon(item.value_type) }}</v-icon>
            </template>
            <span>{{item.value_type}}</span>
          </v-tooltip>
          <v-icon small v-else-if="open">mdi-folder-open</v-icon>
          <v-icon small v-else>mdi-folder</v-icon>
        </template>
      </v-treeview>
      <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" />
    </v-card>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import ErrorState from "@/components/ErrorState.vue";

import { getContractStorage } from "@/api/index.js";
import { getTree } from "@/utils/diff.js";

import dayjs from "dayjs";

export default {
  name: "StorageTab",
  components: {
    TreeNodeDetails,
    ErrorState
  },
  props: {
    contract: Object
  },
  computed: {
    items() {
      return getTree(this.contract.storage, true);
    },
    active() {
      if (this.activeField.length > 0) {
        return this.activeField[0];
      }
      return null;
    }
  },
  data: () => ({
    panel: 0,
    loading: true,
    showTreeNodeDetails: false,
    activeField: []
  }),
  created() {
    this.getStorage();
  },
  methods: {
    ...mapActions(["showError"]),
    getValue(item) {
      if (item.type === undefined || item.value === undefined) {
        return item;
      }
      if (item.type === "mutez") {
        return this.$options.filters.uxtz(item.value);
      } else if (item.type === "timestamp") {
        if (isNaN(parseInt(item.value, 10))) {
          return dayjs(item.value).format("D MMMM YYYY");
        } else {
          return dayjs(item.value * 1000).format("D MMMM YYYY HH:mm");
        }
      }
      return item.value;
    },
    getStorage() {
      if (this.contract == null) return;
      if (this.contract.storage !== undefined) {
        this.loading = false;
        return;
      }
      getContractStorage(this.contract.network, this.contract.address)
        .then(res => {
          this.contract.storage = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getTreeNodeIcon(valueType) {
      if (valueType === "address") {
        return "mdi-alphabetical-variant";
      } else if (valueType === "nat" || valueType == "int") {
        return "mdi-numeric";
      } else if (valueType === "bool") {
        return "mdi-format-bold";
      } else if (valueType === "bytes") {
        return "mdi-hexadecimal";
      } else if (valueType === "timestamp") {
        return "mdi-clock-outline";
      } else if (valueType === "mutez") {
        return "mdi-cash-100";
      } else if (valueType === "contract") {
        return "mdi-file-document-outline";
      } else if (valueType === "key") {
        return "mdi-key";
      } else if (valueType === "lambda") {
        return "mdi-lambda";
      } else if (valueType === "big_map") {
        return "mdi-code-braces";
      }
      return "mdi-alphabetical";
    }
  },
  watch: {
    contract: "getStorage",
    active(newVal) {
      if (newVal !== null) this.showTreeNodeDetails = true;
    },
    showTreeNodeDetails(newVal) {
      if (!newVal) this.activeField = [];
    }
  }
};
</script>


<style lang="scss" scoped>
.storage {
  font-size: 12px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: #6ba13b;
  }
  .object {
    color: #bbb;
  }
}
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>