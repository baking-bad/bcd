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
          <v-btn @click="showRaw = true" small text class="text--secondary">
            <v-icon class="mr-1" small>mdi-code-json</v-icon>
            <span>Raw JSON</span>
          </v-btn>
          <v-tooltip v-if="!raw" top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                small
                text
                class="ml-2 text--secondary"
                @click="downloadFile"
                :loading="downloading"
                :disabled="downloading"
              >
                <v-icon class="mr-1" small>mdi-download-outline</v-icon>
                <span>Full dump</span>
              </v-btn>
            </template>
            Raw snapshot with all big map data
          </v-tooltip>
          <v-btn
            v-if="rawStorage && raw"
            @click="{
              $clipboard(getStorageString());
              showClipboardOK();
            }"
            class="ml-2"
            small
            text
          >
            <v-icon class="mr-1" small>mdi-content-copy</v-icon>
            <span class="text--secondary">Copy</span>
          </v-btn>
          <v-btn v-if="raw" @click="getStorage()" class="ml-2 text--secondary" small text>
            <v-icon class="mr-1" small>mdi-file-tree</v-icon>
            <span>Switch to Tree View</span>
          </v-btn>
          <v-btn v-else @click="getStorageRaw()" class="ml-2 text--secondary" small text>
            <v-icon class="mr-1" small>mdi-code-parentheses</v-icon>
            <span>Switch to Micheline</span>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <Michelson v-if="raw" :code="rawStorage"></Michelson>
          <div v-else class="py-4 data">
            <MiguelTreeView :miguel="storage" :network="network" openAll />     
          </div>    
        </v-card-text>
      </v-card>
    </div>  
    <ErrorState v-else />
    <RawJsonViewer
      :show.sync="showRaw"
      type="storage"
      :network="network"
      :address="address" />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Michelson from "@/components/Michelson.vue";
import ErrorState from "@/components/ErrorState.vue";
import RawJsonViewer from "@/components/RawJsonViewer.vue"
import MiguelTreeView from "@/components/MiguelTreeView.vue";

export default {
  name: "StorageTab",
  components: {
    RawJsonViewer,
    MiguelTreeView,
    ErrorState,
    Michelson
  },
  props: {
    address: String,
    network: String
  },
  data: () => ({
    loading: true,
    storage: null,
    showRaw: false,
    rawStorage: null,
    downloading: false,
    raw: false,
  }),
  created() {
    this.getStorage(true);
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
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
    }
  }
};
</script>