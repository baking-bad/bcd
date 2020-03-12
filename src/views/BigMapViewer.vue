<template>
  <v-container fluid>
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>Big Map Viewer</v-toolbar-title>
        <span class="grey--text hash">
          <router-link
            :to="{name: 'project', params:{address: $route.params.address, network: $route.params.network}}"
          >{{ $route.params.address }}</router-link>
          (Ptr {{ $route.params.ptr }})
        </span>
      </div>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search by key hash or key value"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>
    <v-row>
      <v-col cols="6">
        <v-data-table
          class="elevation-2 ml-4"
          :loading="loading"
          loading-text="Loading... Please wait"
          :items="bigmap"
          hide-default-header
          :headers="headers"
          :search="search"
          :items-per-page="15"
          no-data-text="No big map diff availiable"
          :hide-default-footer="bigmap.length == 0"
          :custom-filter="fileterItems"
          @click:row="showBigMapDiffDetails"
        >
          <template v-slot:item="{item}">
            <tr
              style="cursor:pointer"
              :class="isActive(item)"
              @click="showBigMapDiffDetails(item)"
              :key="item.data.key_hash"
            >
              <td class="px-0">
                <v-treeview :items="getTree(item.data.key)" open-all transition class="storage">
                  <template v-slot:label="{ item }">
                    <span :class="item.type">{{ item.value }}</span>&nbsp;
                    <span class="grey--text text--darken-2">{{ item.name }}</span>
                  </template>
                </v-treeview>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="6" v-if="bigmap.length > 0">
        <v-card :elevation="2" v-if="selectedBigMapDiff" class="mr-4 pa-2">
          <v-card-title class="hash key-hash">{{ selectedBigMapDiff.key_hash }}</v-card-title>
          <v-card-text>
            <div class="bmd-value">
              <span class="overline ml-3">Value at {{ selectedBigMapDiff.level }} level</span>
              <div v-if="selectedBigMapDiff.value !== null">
                <v-treeview
                  :items="tree"
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
                    <span :class="item.type">{{ item.value }}</span>
                  </template>
                </v-treeview>
              </div>
              <p v-else class="ml-3 mb-0">Has been removed</p>
            </div>
            <div v-if="actions.length > 0" class="mt-4">
              <v-list>
                <v-list-item-group v-model="selectedAction" active-class="primary--text">
                  <template v-for="(item, idx) in actions">
                    <v-list-item :key="idx">
                      <v-list-item-content>
                        <v-list-item-subtitle
                          class="red--text overline"
                          v-if="item.value === null"
                        >remove</v-list-item-subtitle>
                        <v-list-item-subtitle class="primary--text overline" v-else>update</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-list-item-action-text>at {{ item.level }} level</v-list-item-action-text>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider :key="actions.length + idx" v-if="idx < actions.length -1" />
                  </template>
                </v-list-item-group>
              </v-list>
            </div>
          </v-card-text>
          <v-fade-transition>
            <v-overlay v-if="loadingDetails" absolute>
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
          </v-fade-transition>
        </v-card>
        <v-card
          v-else
          :elevation="0"
          class="d-flex flex-column align-center justify-center mt-12 transparent"
        >
          <v-icon size="100" color="grey">mdi-code-braces</v-icon>
          <span class="headline grey--text">Select one of big map items</span>
        </v-card>
      </v-col>
    </v-row>
    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { getContractBigMap, getContractBigMapByKeyHash } from "@/api/index.js";
import { getTree } from "@/utils/tree.js";

import TreeNodeDetails from "@/components/TreeNodeDetails.vue";

export default {
  name: "BigMapViewer",
  components: {
    TreeNodeDetails
  },
  data: () => ({
    loading: true,
    loadingDetails: true,
    showTreeNodeDetails: false,
    activeField: [],
    search: "",
    bigmap: [],
    selectedBigMapDiff: null,
    selectedAction: 0,
    actions: []
  }),
  computed: {
    tree() {
      if (
        this.selectedBigMapDiff == null ||
        this.selectedBigMapDiff.value === ""
      )
        return [];
      return getTree(this.selectedBigMapDiff.value);
    },
    headers() {
      return [
        {
          text: "Key",
          value: "key",
          sortable: false
        }
      ];
    },
    active() {
      if (this.activeField.length > 0) {
        return this.activeField[0];
      }
      return null;
    }
  },
  created() {
    this.requestData();
  },
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      getContractBigMap(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.ptr
      )
        .then(res => (this.bigmap = res))
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getDetails() {
      if (this.selectedBigMapDiff === null) return;
      this.loadingDetails = true;
      getContractBigMapByKeyHash(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.ptr,
        this.selectedBigMapDiff.key_hash
      )
        .then(res => {
          this.actions = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loadingDetails = false));
    },
    showBigMapDiffDetails(item) {
      this.selectedBigMapDiff = item.data;
      this.getDetails();
    },
    fileterItems(value, search, item) {
      if (item.data.key_hash.includes(search)) return true;
      if (item.datakey !== null) {
        let key = JSON.stringify(item.data.key).toLowerCase();
        if (key.includes(search.toLowerCase())) return true;
      }
      return false;
    },
    getTree(data) {
      return getTree(data);
    },
    isActive(item) {
      if (
        this.selectedBigMapDiff &&
        item.data &&
        this.selectedBigMapDiff.key_hash === item.data.key_hash
      )
        return "filled-row";
      return "";
    }
  },
  watch: {
    $route: "requestData",
    selectedAction(newValue) {
      this.selectedBigMapDiff = this.actions[newValue];
    },
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

.filled-row {
  background-color: #dcedc8;
}

.bmd-value {
  border: 1px solid lightgrey;
  padding: 10px 0;
}

.key-hash {
  font-size: 0.9em;
}
</style>
