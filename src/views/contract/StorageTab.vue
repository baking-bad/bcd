<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader v-if="loading" type="card-heading, image" />
    <div v-else-if="storage || rawStorage">
      <v-card tile flat outlined class="pa-0">
        <v-card-title class="d-flex sidebar px-4 py-3">
          <span class="caption font-weight-bold text-uppercase text--secondary">
            Latest
          </span>
          <v-spacer></v-spacer>
          <v-btn v-if="raw" @click="getStorage()" small text>
            <v-icon class="mr-1" small>mdi-file-tree</v-icon>
            <span class="text--secondary">Switch to Tree View</span>
          </v-btn>
          <v-btn v-else @click="getStorageRaw()" small text>
            <v-icon class="mr-1" small>mdi-code-parentheses</v-icon>
            <span class="text--secondary">Switch to Micheline</span>
          </v-btn>
          <v-btn
            v-if="!raw"
            small
            text
            class="ml-2"
            @click="downloadFile"
            :loading="downloading"
            :disabled="downloading"
          >
            <v-icon class="mr-1" small>mdi-download-outline</v-icon>
            <span class="text--secondary">Download as .json</span>
          </v-btn>
          <v-snackbar top color="light-green darken-1" v-model="clipboard_ok">
            Copied to clipboard!
            <v-btn text @click="clipboard_ok = false">OK</v-btn>
          </v-snackbar>
          <v-btn
            v-if="rawStorage && raw"
            v-clipboard="getStorageString()"
            v-clipboard:success="onStorageCopy"
            class="ml-2"
            small
            text
          >
            <v-icon class="mr-1" small>mdi-content-copy</v-icon>
            <span class="text--secondary">Copy as string</span>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <Michelson v-if="raw" :code="rawStorage"></Michelson>
          <v-treeview
            v-else
            :items="items"
            hoverable
            open-all
            transition
            activatable
            open-on-click
            return-object
            class="storage pr-4 pt-6 pb-4"
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
                  <v-icon class="accent--text" x-small>mdi-open-in-new</v-icon>
                </v-btn>
              </span>
              <span v-else>{{ item.name }}:&nbsp;</span>
              <span :class="item.type" v-if="item.value_type !== 'big_map'">{{ item.value }}</span>
              <v-btn
                :to="{ name: 'big_map', params: { address: address, ptr: item.value, network: network}}"
                outlined
                small
                color="accent"
                class="px-3 mb-1"
                v-else
              >
                <v-icon class x-small left>mdi-vector-link</v-icon>
                <span class>Big Map {{ item.value }}</span>
              </v-btn>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </div>
    <ErrorState v-else />
    <TreeNodeDetails
      v-model="showTreeNodeDetails"
      :data="active"
      :network="network"
      :address="address"
    />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import Michelson from "@/components/Michelson.vue";
import TreeNodeDetails from "@/components/TreeNodeDetails.vue";
import ErrorState from "@/components/ErrorState.vue";

import { getTree } from "@/utils/diff.js";

import dayjs from "dayjs";

export default {
  name: "StorageTab",
  components: {
    TreeNodeDetails,
    ErrorState,
    Michelson
  },
  props: {
    address: String,
    network: String
  },
  computed: {
    items() {
      return getTree(this.storage, true);
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
    storage: null,
    rawStorage: null,
    downloading: false,
    showTreeNodeDetails: false,
    activeField: [],
    raw: false,
    clipboard_ok: false
  }),
  created() {
    this.getStorage(true);
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
    getStorage(force = false) {
      if (this.storage) {
        this.raw = false;
        if (!force) return
      }
      this.loading = true;
      this.api
        .getContractStorage(this.network, this.address)
        .then(res => {
          if (!res) return;
          this.storage = res;
          this.raw = false;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getStorageRaw(force = false) {
      if (this.rawStorage) {
        this.raw = true;
        if (!force) return
      }
      this.loading = true;
      this.api
        .getContractStorageRaw(this.network, this.address)
        .then(res => {
          this.rawStorage = String(res);
          this.raw = true;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getStorageString() {
      if (this.rawStorage) {
        return this.rawStorage.replace(/\n|\s+/gm, " ");
      }
    },
    onStorageCopy() {
      this.clipboard_ok = true;
    },
    hasAddress(s) {
      if (s !== undefined && /(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/.test(s)) {
        return s.startsWith("KT") || this.tzkt.supports(this.network);
      }
      return false;
    },
    handleAddress(s) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith("KT")) {
        let routeData = this.$router.resolve({
          path: `/${this.network}/${address}`
        });
        window.open(routeData.href, "_blank");
      } else {
        let href = this.tzkt.resolve(this.network, address);
        window.open(href, "_blank");
      }
    },
    downloadFile() {
      this.downloading = true;
      this.api
        .getContractStorageRich(this.network, this.address)
        .then(res => {
          var element = document.createElement("a");
          element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," +
              encodeURIComponent(JSON.stringify(res))
          );
          element.setAttribute("download", this.address + ".storage.json");
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.downloading = false));
    }
  },
  watch: {
    address() {
      this.getStorage(true);
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
  font-size: 14px;
  font-family: "Roboto Mono", monospace;
  background-color: var(--v-data-base);

  .value {
    color: var(--v-tree-base);
  }
  .object {
    opacity: .7;
  }
}
</style>

<style>
.tree-label {
  font-size: 95% !important;
}
.v-treeview-node__root {
  min-height: 20px !important;
}
.vjs-tree .vjs-value__string {
  color: var(--v-tree-base);
}
</style>