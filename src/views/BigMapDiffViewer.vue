<template>
  <v-container fluid class="pa-0">
    <v-toolbar flat class="bigmap-toolbar">
      <v-breadcrumbs large class="px-2 hash" :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mr-2">
        <ExpandableSearch></ExpandableSearch>
      </div>
    </v-toolbar>

    <v-row class="pa-8 ma-0" v-if="loading || total > 0">
      <v-col cols="8">
        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
        >
          <v-card flat tile outlined class="px-4 pt-2 pb-4 mb-4" v-if="key">
            <span class="overline">Key</span>
            <v-treeview
              :items="keyTree"
              :active.sync="activeKey"
              hoverable
              open-all
              transition
              activatable
              open-on-click
              return-object
              class="storage"
            >
              <template v-slot:label="{ item }">
                <span class="grey--text text--darken-2">{{ item.name }}</span>&nbsp;
                <span :class="item.type">{{ item.value }}</span>
              </template>
            </v-treeview>
          </v-card>
          <v-card flat tile outlined v-if="selectedValue" class="px-4 pb-4 pt-2">
            <span class="overline">Value</span>
            <v-treeview
              :items="selectedValue.tree"
              :open="selectedValue.open"
              :active.sync="activeValue"
              hoverable
              open-all
              transition
              activatable
              open-on-click
              return-object
              class="storage"
            >
              <template v-slot:label="{ item }">
                <span class="grey--text text--darken-2">{{ item.name }}</span>&nbsp;
                <span :class="item.type">{{ item.value }}</span>
              </template>
            </v-treeview>
          </v-card>
          <v-card flat outlined v-else-if="selectedValue === null">
            <v-card-text class="pa-4">
              <div class="d-flex flex-row justify-start align-center">
                <v-icon large>mdi-playlist-remove</v-icon>
                <span class="subtitle-1 ml-5">Value was removed</span>
              </div>
            </v-card-text>
          </v-card>
          <v-card flat outlined v-else-if="selectedValue === undefined">
            <v-card-text class="pa-4">
              <div class="d-flex flex-row justify-start align-center">
                <v-icon large>mdi-playlist-check</v-icon>
                <span class="subtitle-1 ml-5">Select a level</span>
              </div>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" class="pt-3">
        <v-card tile elevation="1">
          <v-list class="ma-0 pa-0">
            <v-list-item-group v-model="selectedItem" mandatory color="primary">
              <template v-for="(item, i) in diffs">
                <v-divider :key="`${i}-divider`" v-if="i != 0" />
                <v-list-item :key="i" class="px-6">
                  <v-list-item-icon>
                    <v-icon v-if="(page - 1) * diffsPerPage + i + 1 == total">mdi-playlist-plus</v-icon>
                    <v-icon v-else-if="!diffs[i].value">mdi-playlist-remove</v-icon>
                    <v-icon v-else>mdi-playlist-edit</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="overline ml-5">{{ formatDate(item.timestamp) }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text class="overline grey--text">
                      {{ item.level }}
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-pagination
          v-if="total > diffsPerPage"
          v-model="page" 
          :length="Math.ceil(total / diffsPerPage)" 
          class="mt-4">
        </v-pagination>
      </v-col>
    </v-row>
    <ErrorState v-else />
    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="$route.params.network" />
  </v-container>
</template>

<script>
import dayjs from "dayjs";

import { mapActions } from "vuex";

import { getTree } from "@/utils/diff.js";

import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import ExpandableSearch from "@/components/ExpandableSearch.vue"
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "BigMapDiffViewer",
  components: {
    TreeNodeDetails,
    ExpandableSearch,
    ErrorState
  },
  computed: {
    selectedValue() {
      if (this.selectedItem < 0 || this.diffs.length - 1 < this.selectedItem)
        return undefined;
      if (this.diffs[this.selectedItem].value === null) return null;

      let tree = getTree(this.diffs[this.selectedItem].value, true);
      let open = tree.map(x => this.getChangedItems(x), this).flat();
      return { tree, open };
    },
    active() {
      if (this.activeValue.length > 0) {
        return this.activeValue[0];
      }
      if (this.activeKey.length > 0) {
        return this.activeKey[0];
      }
      return null;
    },
    keyTree() {
      if (!this.key) return null;
      return getTree(this.key, true);
    }
  },
  data: () => ({
    loading: true,
    diffs: [],
    key: null,
    total: 0,
    page: 1,
    diffsPerPage: 10,
    breadcrumbs: [],
    selectedItem: -1,
    showTreeNodeDetails: false,
    activeValue: [],
    activeKey: []
  }),
  mounted() {
    this.$nextTick(() => {
      const params = this.$route.params;
      this.breadcrumbs = [
        {
          text: this.capitalize(params.network),
          disabled: true,
          href: "breadcrumbs_link_0"
        },
        {
          text: params.address,
          disabled: false,
          to: {
            name: "project",
            params: {
              address: params.address,
              network: params.network
            }
          }
        },
        {
          text: 'Storage',
          disabled: false,
          to: {
            name: "storage",
            params: {
              address: params.address,
              network: params.network
            }
          }
        },
        {
          text: `Big Map ${params.ptr}`,
          disabled: false,
          exact: true,
          to: {
            name: "bigmap",
            params: {
              network: params.network,
              address: params.address,
              ptr: params.ptr
            }
          }
        },
        {
          text: params.keyhash,
          disabled: true,
          href: "breadcrumbs_link_4"
        },
      ];
    });
  },
  created() {
    this.requestData();
  },
  methods: {
    ...mapActions(["showError"]),
    capitalize(text) {
      return text.length > 0 ? text.slice(0, 1).toUpperCase() + text.slice(1) : text;
    },
    requestData() {
      this.loading = true;
      this.api.getContractBigMapByKeyHash(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.ptr,
        this.$route.params.keyhash,
        (this.page - 1) * this.diffsPerPage
      )
        .then(res => {
          this.diffs = res.values;
          this.key = res.key;
          this.total = res.total;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getTree(data) {
      return getTree(data);
    },
    getChangedItems(item) {
      let res = item.children.map(x => this.getChangedItems(x), this).flat();
      res.push(item);
      return res;
    },
    formatDate(value) {
      let d = dayjs(value);
      if (value) {
        if (d.year() < dayjs().year()) return d.format("MMM D HH:mm, YYYY");
        if (d.add(1, "days").isBefore(dayjs())) return d.format("MMM D HH:mm");
        return d.fromNow();
      }
    },
  },
  watch: {
    $route: "requestData",
    active(newVal) {
      if (newVal !== null) this.showTreeNodeDetails = true;
    },
    showTreeNodeDetails(newVal) {
      if (!newVal) {
        this.activeKey = [];
        this.activeValue = [];
      }
    },
    page(newVal) {
      if (newVal && newVal > 0 && newVal <= this.total) {
        this.requestData();
      }
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

.key-hash {
  font-size: 0.9em;
  margin-left: 38px;
}
</style>
