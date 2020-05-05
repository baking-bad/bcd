<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="mt-3"></v-skeleton-loader>
    <div v-else-if="contract.storage">
      <v-toolbar flat class="mb-2 transparent storage-toolbar">
        <v-btn v-if="raw" @click="getStorage()" small depressed class="toolbar-btn">
          <v-icon class="mr-1" small>mdi-file-tree</v-icon>
          <span class="overline">Switch to Tree View</span>
        </v-btn>
        <v-btn v-else @click="getStorageRaw()" small depressed class="toolbar-btn">
          <v-icon class="mr-1" small>mdi-code-braces</v-icon>
          <span class="overline">Switch to Micheline</span>
        </v-btn>
        <v-btn
          v-if="!raw"
          small depressed class="toolbar-btn" 
          @click="downloadFile"
          :loading="downloading"
          :disabled="downloading">
            <v-icon class="mr-1" small>mdi-download-outline</v-icon>
            <span class="overline">Download as .json</span>
          </v-btn>
        <v-snackbar color="light-green darken-1" v-model="clipboard_ok">
          Copied to clipboard!
          <v-btn
            text
            @click="clipboard_ok = false"
          >
            OK
          </v-btn>
        </v-snackbar>
        <v-btn v-if="contract.raw_storage && raw" 
          v-clipboard="getStorageString()"
          v-clipboard:success="onStorageCopy"
          small depressed class="toolbar-btn">
          <v-icon class="mr-1" small>mdi-content-copy</v-icon>
          <span class="overline">Copy as string</span>
        </v-btn>       
      </v-toolbar>
      <v-card v-if="raw" tile flat outlined class="pa-3">
        <Michelson :code="contract.raw_storage"></Michelson>
      </v-card>
      <v-card v-else tile flat outlined class="py-4">
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
              :to="{ name: 'bigmap', params: { address: contract.address, ptr: item.value, network: contract.network}}"
              
              depressed
              x-small
              color="secondary"
              class="px-3"
              v-else
            >
              <v-icon class="grey--text text--darken-1" x-small left>mdi-vector-link</v-icon>
              <span class="grey--text text--darken-4">Big Map {{ item.value }}</span>
            </v-btn>
          </template>
        </v-treeview>
        <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="contract.network" :address="contract.address" />
      </v-card>
    </div>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import Michelson from "@/components/Michelson.vue"
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
    downloading: false,
    showTreeNodeDetails: false,
    activeField: [],
    raw: false,
    clipboard_ok: false
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
        this.raw = false;
        return;
      }
      this.api.getContractStorage(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
          this.contract.storage = res;
          this.raw = false;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getStorageRaw() {
      if (this.contract == null) return;
      if (this.contract.raw_storage !== undefined) {
        this.loading = false;
        this.raw = true;
        return;
      }
      this.api.getContractStorageRaw(this.contract.network, this.contract.address)
        .then(res => {
          this.contract.raw_storage = String(res);
          this.raw = true;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getStorageString() {
      if (this.contract.raw_storage !== undefined) {
        return this.contract.raw_storage.replace(/\n|\s+/gm, ' ');
      }
    },
    onStorageCopy() {
      this.clipboard_ok = true;
    },
    hasAddress(s) {
      if (s !== undefined && /(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/.test(s)) {
        return s.startsWith("KT") || this.tzkt.supports(this.contract.network);
      }
      return false;
    },
    handleAddress(s) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith('KT')) {
        let routeData = this.$router.resolve({ path: `/${this.contract.network}/${address}` });
        window.open(routeData.href, '_blank');
      } else {
        let href = this.tzkt.resolve(this.contract.network, address);
        window.open(href, '_blank');
      }
    },
    downloadFile() {
      this.downloading = true;
      this.api.getContractStorageRich(this.contract.network, this.contract.address)
        .then(res => {
          var element = document.createElement("a");
          element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," +
              encodeURIComponent(JSON.stringify(res))
          );
          element.setAttribute("download", this.contract.address + ".storage.json");
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
  margin-right: 10px;
} 
</style>

<style>
.storage-toolbar > .v-toolbar__content {
  padding: 0;
}
.v-treeview-node__root {
  min-height: 20px !important;
}
</style>