<template>
  <v-container fluid class="pt-5">
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>Big Map Viewer</v-toolbar-title>
        <v-breadcrumbs large class="px-0" :items="breadcrumbs"></v-breadcrumbs>
      </div>
    </v-toolbar>

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <div v-if="diffs.length > 0" class="pt-2">
        <v-row>
          <v-col cols="6">
            <v-subheader class="mt-0 pt-0 overline">Key</v-subheader>
            <v-card flat outlined class="py-5" v-if="key">
              <v-treeview
                :items="keyTree.tree"
                :open="keyTree.open"
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
            <v-list>
              <v-list-item-group v-model="selectedItem" mandatory color="primary">
                <template v-for="(item, i) in diffs">
                  <v-divider :key="`${i}-divider`" v-if="i != 0" />
                  <v-list-item :key="i">
                    <v-list-item-content>
                      <v-list-item-title class="overline">{{ item.timestamp | formatDate }}</v-list-item-title>
                      <v-list-item-subtitle class="overline grey--text">{{ item.level }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <span
                        :class="item.value ? 'primary--text overline' : 'red--text overline'"
                      >{{ item.value ? 'Updated' : 'Removed'}}</span>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
            <span v-intersect="onDownloadPage" v-if="!downloaded"></span>
          </v-col>
          <v-col cols="6">
            <v-subheader class="mt-0 pt-0 overline">Value</v-subheader>
            <v-card flat outlined v-if="selectedValue" class="py-5">
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
              <v-card-text class="pa-10">
                <div class="d-flex flex-row justify-center align-center">
                  <v-icon size="40">mdi-table-row-remove</v-icon>
                  <span class="headline ml-5">Value was removed</span>
                </div>
              </v-card-text>
            </v-card>
            <v-card flat outlined v-else-if="selectedValue === undefined">
              <v-card-text class="pa-10">
                <div class="d-flex flex-row justify-center align-center">
                  <v-icon size="40">mdi-code-braces</v-icon>
                  <span class="headline ml-5">Select one of item to explore it</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-card
        height="60vh"
        v-else
        class="d-flex flex-column align-center mt-12 transparent message-card"
        :elevation="0"
      >
        <v-card flat outlined>
          <v-card-text class="pa-10">
            <div class="d-flex flex-row justify-start align-center">
              <v-icon size="40">mdi-cloud-search-outline</v-icon>
              <span class="headline ml-5">Your search did not match</span>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-skeleton-loader>
    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="$route.params.network" />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { getContractBigMapByKeyHash } from "@/api/index.js";
import { getTree } from "@/utils/diff.js";
import { plural } from "@/utils/plural.js";

import TreeNodeDetails from "@/components/TreeNodeDetails.vue";

export default {
  name: "BigMapDiffViewer",
  components: {
    TreeNodeDetails
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
      let tree = getTree(this.key, true);
      let open = tree.map(x => this.getChangedItems(x), this).flat();
      return { tree, open };
    }
  },
  data: () => ({
    loading: true,
    downloaded: false,
    diffs: [],
    key: null,
    breadcrumbs: [],
    selectedItem: -1,
    showTreeNodeDetails: false,
    activeValue: [],
    activeKey: []
  }),
  mounted() {
    this.$nextTick(() => {
      this.breadcrumbs = [
        {
          text: this.$route.params.address,
          disabled: false,
          to: {
            name: "project",
            params: {
              address: this.$route.params.address,
              network: this.$route.params.network
            }
          }
        },
        {
          text: `Big map ${this.$route.params.ptr}`,
          disabled: false,
          href: `/bigmap/${this.$route.params.network}/${this.$route.params.address}/${this.$route.params.ptr}`
        },
        {
          text: `${this.$route.params.keyhash}`,
          disabled: true,
          href: "breadcrumbs_link_2"
        }
      ];
    });
  },
  created() {
    this.requestData();
  },
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      getContractBigMapByKeyHash(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.ptr,
        this.$route.params.keyhash,
        this.diffs.length
      )
        .then(res => {
          if (!res.values) {
            this.downloaded = true;
            return;
          }
          if (this.diffs.length == 0) {
            this.diffs = res.values;
            this.key = res.key;
          } else this.diffs.push(...res.values);
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
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.requestData();
      }
    },
    plural(count, word) {
      return plural(count, word);
    },
    getChangedItems(item) {
      let res = item.children.map(x => this.getChangedItems(x), this).flat();
      if (item.kind || res.length > 0) res.push(item);
      return res;
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
