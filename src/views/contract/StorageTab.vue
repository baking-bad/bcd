<template>
  <v-container fluid class="px-8 py-4 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card-heading, image">
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-select
                v-if="storageVersions.length > 0"
                v-model="level"
                @change="getStorage(true)"
                :items="storageVersions"
                item-text="version"
                item-value="level"
                style="max-width: 175px"
                rounded
                dense
                background-color="data"
                class="mb-1"
                hide-details
              ></v-select>
              <v-breadcrumbs
                divider="/"
                :items="breadcrumbsItems"
              />
            </div>
            <div v-if="isStorageParentPage">
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
                @click="
              () => {
                $clipboard(getStorageString());
                showClipboardOK();
              }
            "
                class="ml-2"
                small
                text
              >
                <v-icon class="mr-1" small>mdi-content-copy</v-icon>
                <span class="text--secondary">Copy</span>
              </v-btn>
              <v-btn
                v-if="raw"
                @click="getStorage()"
                class="ml-2 text--secondary"
                small
                text
              >
                <v-icon class="mr-1" small>mdi-file-tree</v-icon>
                <span>Switch to Tree View</span>
              </v-btn>
              <v-btn
                v-else
                @click="getStorageRaw()"
                class="ml-2 text--secondary"
                small
                text
              >
                <v-icon class="mr-1" small>mdi-code-parentheses</v-icon>
                <span>Switch to Micheline</span>
              </v-btn>
            </div>
          </div>
          <v-card v-if="storage || rawStorage" tile flat :outlined="isStorageParentPage" class="pa-0 mt-2">
            <v-card-text class="pa-0 data">
              <v-row v-if="isStorageParentPage" no-gutters>
                <v-col cols="7">
                  <Michelson v-if="raw" :code="rawStorage"></Michelson>
                  <div v-else class="py-4 data">
                    <MiguelTreeView
                      :address="address"
                      :miguel="storage"
                      :network="network"
                      openAll
                      compact-pair
                    />
                  </div>
                </v-col>
                <v-divider vertical />
                <v-col v-if="schema" cols="4">
                  <TypeDef
                    :typedef="schema.typedef"
                    first="storage"
                    class="pt-3 pb-1 px-6"
                    style="opacity: 0.8"
                  />
                </v-col>
              </v-row>
              <router-view
                v-else
                :network="network"
              />
            </v-card-text>
          </v-card>
          <ErrorState v-else />
        </v-col>
      </v-row>
    </v-skeleton-loader>
    <RawJsonViewer
      :show.sync="showRaw"
      type="storage"
      :network="network"
      :address="address"
      :level="level"
    />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Michelson from "@/components/Michelson.vue";
import ErrorState from "@/components/ErrorState.vue";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";
import MiguelTreeView from "@/components/MiguelTreeView.vue";
import TypeDef from "@/views/contract/TypeDef.vue";
import {shortcutOnly} from "../../utils/tz";

export default {
  name: "StorageTab",
  components: {
    RawJsonViewer,
    MiguelTreeView,
    ErrorState,
    Michelson,
    TypeDef,
  },
  props: {
    address: String,
    network: String,
  },
  data: () => ({
    loading: true,
    storage: null,
    showRaw: false,
    rawStorage: null,
    downloading: false,
    raw: false,
    schema: null,
    level: null,
  }),
  mounted() {
    if (this.$route.query.level) this.level = this.$route.query.level;
    this.getStorage(true);
  },
  computed: {
    isStorageParentPage() {
      return this.$route.name === 'storage';
    },
    storageVersions() {
      let versions = [{ version: "Latest", level: null }];
      if (this.$route.query.level) {
        versions.push({
          version: `At ${this.$route.query.level}`,
          level: this.$route.query.level,
        });
      }
      return versions;
    },
    breadcrumbsItems() {
      const breadcrumbs = [
        {
          text: 'Storage',
          to: `/${this.network}/${this.address}/storage${this.$route.hash !== '#' ? '#' : '##'}`,
        },
      ];
      const { ptr } = this.$route.params;
      if (ptr) {
        breadcrumbs.push({
          text: `Big Map ${ptr}`,
          to: `/${this.network}/${this.address}/storage/big_map/${ptr}${this.$route.hash !== '#' ? '#' : '##'}`,
          disabled: false,
        });
      }
      const { keyhash } = this.$route.params;
      if (keyhash) {
        breadcrumbs.push({
          text: shortcutOnly(keyhash),
          to: `/${this.network}/${this.address}/storage/big_map/${ptr}/${keyhash}${this.$route.hash !== '#' ? '#' : '##'}`,
        });
      }
      return breadcrumbs;
    },
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    getStorage(force = false) {
      if (this.storage) {
        this.raw = false;
        if (!force) return;
      }
      this.loading = true;
      this.api
        .getContractStorage(this.network, this.address, this.level)
        .then((res) => {
          if (!res) return;
          this.findPointers(res);
          this.storage = res;
          this.raw = false;
          return this.api.getContractStorageSchema(this.network, this.address);
        })
        .then((res) => {
          if (!res) return;
          this.schema = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getStorageRaw(force = false) {
      if (this.rawStorage) {
        this.raw = true;
        if (!force) return;
      }
      this.loading = true;
      this.api
        .getContractStorageRaw(this.network, this.address, this.level)
        .then((res) => {
          this.rawStorage = String(res);
          this.raw = true;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getStorageSchema() {
      this.api
        .getContractStorageSchema(this.network, this.address)

        .catch((err) => {
          console.log(err);
          this.showError(err);
        });
    },
    downloadFile() {
      this.downloading = true;
      this.api
        .getContractStorageRich(this.network, this.address, this.level)
        .then((res) => {
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
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.downloading = false));
    },
    findPointers(value) {
      if (value.prim === "big_map") {
        this.api
          .getContractBigMapDiffsCount(this.network, value.value)
          .then((res) => {
            value.count = res.count;
          })
          .catch((err) => {
            console.log(err);
            this.showError(err);
          });
      }
      if (value.children) {
        for (let i = 0; i < value.children.length; i++) {
          this.findPointers(value.children[i]);
        }
      }
    },
  },
  watch: {
    address() {
      this.getStorage(true);
    },
  },
};
</script>
