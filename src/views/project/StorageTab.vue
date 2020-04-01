<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <div v-else-if="contract.storage">
      <!-- <v-toolbar flat class="mb-2 transparent">
        <v-btn small depressed class="toolbar-btn">
          <v-icon class="mr-1" small>mdi-code-braces</v-icon>
          <span class="overline">Switch to Michelson</span>
        </v-btn>
      </v-toolbar> -->
      <v-card tile class="ma-3 pa-3">
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
            <span v-else>{{ item.name }}:&nbsp;</span>
            <span :class="item.type" v-if="item.value_type !== 'big_map'">{{ item.value }}</span>
            <v-btn
              :to="{ name: 'bigmap', params: { address: contract.address, ptr: item.value, newtork: contract.network}}"
              tile
              x-small
              color="secondary"
              v-else
            >
              <v-icon class="grey--text text--darken-1" x-small left>mdi-vector-link</v-icon>
              <span class="grey--text text--darken-4">Big Map {{ item.value }}</span>
            </v-btn>
          </template>
        </v-treeview>
        <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="contract.network" />
      </v-card>
    </div>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { getTzKTLink } from "@/utils/tzkt.js";

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
          if (!res) return;
          this.contract.storage = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    hasAddress(s) {
      return s !== undefined && /(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/.test(s);
    },
    handleAddress(s) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith('KT')) {
        let routeData = this.$router.resolve({ path: `/${this.contract.network}/${address}` });
        window.open(routeData.href, '_blank');
      } else {
        let href = getTzKTLink(this.contract.network, address);
        window.open(href, '_blank');
      }
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
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
} 
</style>

<style>
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>