<template>
  <div class="fill-height bg-canvas-base pr-4 pl-4 ">
    <v-row>
      <v-col :cols="keyhash ? '12' : '8'" class="pl-0">
        <router-view class="ml-0" :address="address" :count.sync="count"></router-view>
      </v-col>
      <v-col v-if="!keyhash && actions" cols="4">
        <v-list class="bigmap-sidebar-list">
          <v-list-item class="pr-0">
            <h2 class="font-weight-medium">
              {{ keyhash ? shortcutOnly(keyhash) : `Big Map ${ptr}` }}
            </h2>
          </v-list-item>
          <v-list-item class="pr-0">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Status</v-list-item-subtitle>
              <v-list-item-title class="caption text-uppercase">
                <span v-if="removed" class="error--text">Removed</span>
                <span v-else>Allocated</span>
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
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Active / total keys</v-list-item-subtitle>
              <v-list-item-title class="body-2">
                <span>{{ bigmap.active_keys }} / {{ bigmap.total_keys }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="bigmap.typedef">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Type</v-list-item-subtitle>
              <v-list-item-title>
                <TypeDef
                  :typedef="bigmap.typedef"
                  :first="bigMapName"
                  style="opacity: 1"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list class="bigmap-sidebar-list mt-2" v-if="actions.length > 0">
          <div v-for="(item, idx) in actions" :key="idx">
            <v-divider v-if="idx > 0"></v-divider>
            <BigMapAction :item="item"/>
          </div>
          </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {shortcutOnly} from "../../utils/tz";
import BigMapAction from '@/views/big_map/BigMapAction.vue';
import TypeDef from "@/views/contract/TypeDef.vue";

export default {
  name: "BigMap",
  props: {
    network: String,
    ptr: String,
  },
  components: {
    BigMapAction,
    TypeDef
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
    bigMapName() {
      if (this.bigmap.typedef && this.bigmap.typedef[0]) {
        return this.bigmap.typedef[0].name || 'bigmap'
      }
      return 'bigmap';
    }
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