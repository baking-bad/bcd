<template>
  <v-container fluid class="pa-0 ma-0 canvas">
    <v-row class="pa-8 ma-0" v-if="loading || total > 0">
      <v-col cols="8">
        <!-- <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
        > -->
        <v-expansion-panels mandatory flat>
          <BigMapDiff v-if="diff" 
            :diff="diff" 
            :network="network" 
            :address="address" 
            :ptr="ptr"
            :single="true" />  
        </v-expansion-panels>
        <!-- </v-skeleton-loader>       -->
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4" class="pt-3">
        <v-card flat outlined>
          <v-list class="ma-0 pa-0">
            <v-list-item-group v-model="selectedItem" mandatory>
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
                    <v-list-item-action-text class="overline grey--text">{{ item.level }}</v-list-item-action-text>
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
          class="mt-4"
        ></v-pagination>
      </v-col>
    </v-row>
    <ErrorState v-else />
    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="network" />
  </v-container>
</template>

<script>
import BigMapDiff from "@/views/bigmap/BigMapDiff.vue";
import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import ErrorState from "@/components/ErrorState.vue";
import { mapActions } from "vuex";
import { getTree } from "@/utils/diff.js";
import dayjs from "dayjs";

export default {
  name: "BigMapHistory",
  props: {
    network: String,
    address: String,
    ptr: String,
    keyhash: String,
    count: Number
  },
  components: {
    BigMapDiff,
    TreeNodeDetails,
    ErrorState
  },
  computed: {
    diff() {
      if (this.selectedItem < 0  || this.diffs.length - 1 < this.selectedItem) return null;
      const data = {
        key: this.key,
        key_hash: this.keyhash,
        ...this.diffs[this.selectedItem]
      }
      return {data, count: this.total};

      // let tree = getTree(this.diffs[this.selectedItem].value, true);
      // let open = tree.map(x => this.getChangedItems(x), this).flat();
      // return { tree, open };
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
        this.network,
        this.address,
        this.ptr,
        this.keyhash,
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
        .finally(() => {
          this.loading = false;
          this.$emit("update:count", this.total);
        });
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