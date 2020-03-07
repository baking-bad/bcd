<template>
  <div class="elevation-1 white">
    <v-toolbar flat>
      <div>
        <v-toolbar-title>Big Map Viewer</v-toolbar-title>
        <span class="grey--text hash">{{ $route.params.address }} (Ptr {{ $route.params.ptr }})</span>
      </div>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>
    <v-row>
      <v-col class="6">
        <v-data-table
          class="px-4"
          :loading="loading"
          loading-text="Loading... Please wait"
          :items="bigmap"
          hide-default-header
          :headers="headers"
          :search="search"
          :items-per-page="15"
          :custom-filter="fileterItems"
          @click:row="showBigMapDiffDetails"
        >
          <template v-slot:item.key="{ item }">
            <div style="cursor:pointer">
              <span class="overline ml-3">Last action at {{ item.data.level }} level</span>
              <v-treeview :items="getTree(item.data.key)" open-all transition class="storage">
                <template v-slot:label="{ item }">
                  <span>{{ item.name }}:</span>&nbsp;
                  <span :class="item.type">{{ item.value }}</span>
                </template>
              </v-treeview>
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col sm="auto">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="5">
        <v-card :elevation="0" v-if="selectedBigMapDiff">
          <v-card-title class="hash key-hash">{{ selectedBigMapDiff.key_hash }}</v-card-title>
          <v-card-text>
            <div class="bmd-value">
              <span class="overline ml-3">Value at {{ selectedBigMapDiff.level }} level</span>
              <v-treeview
                :items="getTree(selectedBigMapDiff.value)"
                open-all
                transition
                class="storage"
                v-if="selectedBigMapDiff.value !== null"
              >
                <template v-slot:label="{ item }">
                  <span>{{ item.name }}:</span>&nbsp;
                  <span :class="item.type">{{ item.value }}</span>
                </template>
              </v-treeview>
              <p v-else class="ml-3 mb-0">Has been removed</p>
            </div>
            <div v-if="actions.length > 0" class="mt-7">
              <v-subheader>Actions</v-subheader>
              <v-list>
                <template v-for="(item, idx) in actions">
                  <v-list-item :key="idx" @click="selectedBigMapDiff = item">
                    <v-list-item-content>
                      <v-list-item-subtitle>At {{ item.level }} level</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text class="red--text" v-if="item.value === null">remove</v-list-item-action-text>
                      <v-list-item-action-text class="primary--text" v-else>update</v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="actions.length + idx" v-if="idx < actions.length -1" />
                </template>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
        <v-card v-else :elevation="0">
          <v-card-text>Select one of big map items</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { getContractBigMap, getContractBigMapByKeyHash } from "@/api/index.js";
import { getTree } from "@/utils/tree.js";

export default {
  name: "BigMapViewer",
  data: () => ({
    loading: true,
    loadingDetails: true,
    search: "",
    bigmap: [],
    selectedBigMapDiff: null,
    actions: []
  }),
  computed: {
    headers() {
      return [
        {
          text: "Key",
          value: "key",
          sortable: false
        }
      ];
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
        .then(res => (this.actions = res))
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loadingDetails = false));
    },
    getTree(data) {
      return getTree(data);
    },
    showBigMapDiffDetails(item) {
      this.selectedBigMapDiff = item.data;
      this.getDetails();
    },
    fileterItems(value, search, item) {
      if (item.data.key_hash.includes(search)) return true;
      if (item.datakey !== null) {
        let key = JSON.stringify(item.data.key);
        if (key.includes(search)) return true;
      }
      if (item.data.value !== null) {
        let val = JSON.stringify(item.data.value);
        if (val.includes(search)) return true;
      }
      return false;
    }
  },
  watch: {
    $route: "requestData"
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

.bmd-value {
  border: 1px solid lightgrey;
  padding: 10px 0;
}

.key-hash {
  font-size: 16px !important;
}
</style>