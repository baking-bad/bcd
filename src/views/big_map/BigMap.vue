<template>
  <div class="fill-height bg-canvas-base pr-4 pl-4">
    <header class="d-flex align-center">
      <h2 class="ml-7 font-weight-medium">
        {{ keyhash ? shortcutOnly(keyhash) : `Big Map ${ptr}` }}
      </h2>
      <v-list class="ml-6 list d-flex">
        <v-list-item class="pr-0">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Status</v-list-item-subtitle>
            <v-list-item-title class="caption text-uppercase">
              <span v-if="removed" class="error--text">Removed</span>
              <span v-else>Allocated</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Active / total keys</v-list-item-subtitle>
            <v-list-item-title class="body-2">
              <span>{{ bigmap.active_keys }} / {{ bigmap.total_keys }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!isNaN(totalBytes)">
          <v-list-item-content>
            <v-list-item-subtitle class="overline">Total size</v-list-item-subtitle>
            <v-list-item-title class="body-2">
              <span>{{ totalBytes }} bytes</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </header>
    <v-row>
      <v-col :cols="keyhash ? '12' : '8'">
        <h3 v-if="!keyhash" class="mb-3 text--secondary outline font-weight-medium ml-7">Keys</h3>
        <router-view class="ml-0" :address="address" :count.sync="count"></router-view>
      </v-col>
      <v-col v-if="!keyhash && actions" cols="4">
        <h3 class="mb-3 text--secondary outline font-weight-medium">Actions</h3>
        <v-list class="bigmap-sidebar-list">
            <template v-for="(item, idx) in actions">
              <v-divider v-if="idx > 0" :key="'divider' + idx"></v-divider>
              <v-list-item :key="idx">
                <v-list-item-content>
                  <v-list-item-title class="hash">
                    <span class="mr-2">{{ item.action }}</span>
                    <template v-if="item.action == 'copy'">
                        <span
                          class="text--secondary font-weight-light"
                          v-if="item.destination_ptr"
                        >to</span>
                      <span
                        class="text--secondary font-weight-light"
                        v-else-if="item.source_ptr"
                      >from</span>
                    </template>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span class="overline">{{ helpers.formatDatetime(item.timestamp) }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text v-if="item.action == 'copy'">
                    <v-btn
                      :to="`/${network}/big_map/${item.destination_ptr}`"
                      class="text--primary"
                      text
                      small
                      v-if="item.destination_ptr"
                    >
                      <v-icon small class="mr-1 text--secondary">mdi-link-variant</v-icon>
                      Big Map {{ item.destination_ptr }}
                    </v-btn>
                    <v-btn
                      :to="`/${network}/big_map/${item.source_ptr}`"
                      class="text--primary"
                      text
                      small
                      v-else-if="item.source_ptr"
                    >
                      <v-icon small class="mr-1 text--secondary">mdi-link-variant</v-icon>
                      Big Map {{ item.source_ptr }}
                    </v-btn>
                  </v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {shortcutOnly} from "../../utils/tz";

export default {
  name: "BigMap",
  props: {
    network: String,
    ptr: String,
  },
  computed: {
    keyhash() {
      return this.$route.params.keyhash;
    },
    removed() {
      return this.actions.some((item) => item.action === "remove");
    },
    address() {
      return this.bigmap.address;
    },
  },
  data: () => ({
    bigmap: {},
    actions: [],
    count: 0,
    totalBytes: NaN,
  }),
  created() {
    this.getBigMap();
    this.getBigMapActions();
    this.getTotalBytes();
  },
  methods: {
    ...mapActions(["showError"]),
    shortcutOnly,
    getBigMap() {
      this.api
        .getContractBigMap(this.network, this.ptr)
        .then(res => {
          if (!res) return;
          this.bigmap = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    },
    getBigMapActions() {
      this.loading = true;
      this.api
        .getContractBigMapActions(this.network, this.ptr)
        .then((res) => {
          console.log('res: ', res);
          if (!res) return;
          if (!res.items) return;
          this.actions = res.items;
        })
        .catch((err) => {
          console.log(err);
          if (err.code !== 204) {
            this.showError(err);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTotalBytes() {
      this.rpc
        .getBigMapTotalBytes(this.network, "head", this.ptr)
        .then((res) => {
          if (!res) return;
          this.totalBytes = parseInt(res.data, 10);
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        });
    },
  },
  watch: {
    ptr: 'getBigMap'
  }
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.list {
  background: var(--v-canvas-base) !important;
}
</style>