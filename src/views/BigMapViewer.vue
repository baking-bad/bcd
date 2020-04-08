<template>
  <v-container fluid class="pt-5">
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>Big Map Viewer</v-toolbar-title>
        <v-breadcrumbs large class="px-0" :items="breadcrumbs"></v-breadcrumbs>
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

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <div v-if="bigmap.length > 0" class="pt-5">
        <v-expansion-panels multiple tile>
          <v-expansion-panel v-for="(diff, idx) in bigmap" :key="idx">
            <v-expansion-panel-header class="pa-0 pr-4" ripple>
              <v-row>
                <v-col cols="2" class="d-flex align-center">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="overline">{{ diff.data.timestamp | formatDate }}</v-list-item-title>
                      <v-list-item-subtitle class="overline grey--text">{{ diff.data.level }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col cols="8" class="d-flex flex-horizontal align-center justify-space-between">
                  <v-list-item class="d-inline-block text-truncate">
                    <v-list-item-content>
                      <v-list-item-title class="hash key-hash">{{ diff.data.key_hash }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-treeview
                          :items="getTree(diff.data.key)"
                          open-all
                          transition
                          class="storage"
                        >
                          <template v-slot:label="{ item }">
                            <span class="grey--text text--darken-2">{{ item.value }}</span>&nbsp;
                            <span :class="item.type">{{ item.name }}</span>
                          </template>
                        </v-treeview>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col cols="2" class="d-flex align-center">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="overline">{{ plural(diff.count, 'change') }}</v-list-item-title>
                      <v-list-item-subtitle
                        class="overline red--text"
                        v-if="!diff.data.value"
                      >removed</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pl-1">
              <v-row>
                <v-col cols="11">
                  <v-treeview
                    :items="getTree(diff.data.value)"
                    open-all
                    transition
                    class="storage"
                    v-if="diff.data.value"
                  >
                    <template v-slot:label="{ item }">
                      <span class="grey--text text--darken-2">{{ item.name }}</span>&nbsp;
                      <span :class="item.type">{{ item.value }}</span>
                    </template>
                  </v-treeview>
                </v-col>
                <v-col cols="1">
                  <v-btn
                    small
                    text
                    color="grey darken-3"
                    class="d-flex align-center"
                    :to="{name: 'bigmapdiff', 
                    params: {
                      network: $route.params.network,
                      address: $route.params.address,
                      ptr: $route.params.ptr,
                      keyhash: diff.data.key_hash
                      }
                    }"
                  >
                    <v-icon x-small>mdi-format-list-text</v-icon>
                    <span class="overline ml-1">History</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <span v-intersect="onDownloadPage" v-if="!downloaded"></span>
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
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { getContractBigMap } from "@/api/index.js";
import { getTree } from "@/utils/diff.js";
import { plural } from "@/utils/plural.js";

export default {
  name: "BigMapViewer",
  data: () => ({
    loading: true,
    downloaded: false,
    search: "",
    bigmap: [],
    selectedBigMapDiff: null,
    breadcrumbs: [],
    _locked: false,
    _timerId: null
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
          disabled: true,
          href: "breadcrumbs_link_2"
        }
      ];
    });
  },
  created() {
    this.fetchSearchDebounced(this.search);
  },
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      this.fetchSearchDebounced(this.search);
    },
    getTree(data) {
      return getTree(data);
    },
    fetchSearchDebounced(text) {
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        getContractBigMap(
          this.$route.params.network,
          this.$route.params.address,
          this.$route.params.ptr,
          text,
          this.bigmap.length
        )
          .then(res => {
            if (this.bigmap.length == 0) this.bigmap = res;
            else this.bigmap.push(...res);
            this.downloaded = res.length == 0;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => (this.loading = false));
      }, 100);
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.fetchSearchDebounced(this.search);
      }
    },
    plural(count, word) {
      return plural(count, word);
    }
  },
  watch: {
    $route: "requestData",
    search(val) {
      if (this._locked) return;
      this._locked = true;
      this.downloaded = false;
      let searchText = val ? val.trim() : "";
      this.bigmap = [];
      this.fetchSearchDebounced(searchText);
      this._locked = false;
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
