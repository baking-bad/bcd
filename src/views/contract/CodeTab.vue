<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row>
      <v-col cols="9">
        <v-skeleton-loader v-if="loading" type="card-heading, image" />
        <div v-else-if="selectedCode">
          <div class="d-flex justify-space-between">
            <v-select
              v-if="codeVersions.length > 0"
              v-model="selectedProtocol"
              @change="getCode(selectedProtocol)"
              :items="codeVersions"
              item-text="proto"
              item-value="protocol"
              style="max-width: 160px;"
              rounded
              dense
              background-color="data"
              class="mb-1"
              hide-details
            ></v-select>
            <span
              v-if="!isCodeRendered && selectedCode && selectedCode.length > freezingAmount"
              class="ml-4 text--disabled rendering-percents"
            >
            Rendering: {{Math.floor(loadedPercentage)}}%
          </span>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-1 text--secondary"
              v-clipboard="getValueToCopy"
              v-clipboard:success="showSuccessCopy"
              small
              text
            >
              <v-icon class="mr-1" small>mdi-content-copy</v-icon>
              <span>Copy</span>
            </v-btn>
            <v-btn @click="showRaw = true" small text class="text--secondary">
              <v-icon class="mr-1" small>mdi-code-json</v-icon>
              <span>Raw JSON</span>
            </v-btn>
            <v-btn small text @click="downloadFile" class="text--secondary ml-2">
              <v-icon class="mr-1 text--secondary" small>mdi-download-outline</v-icon>
              <span>Download</span>
            </v-btn>
            <v-btn small text :to="{name: 'interact'}" class="text--secondary ml-2">
              <v-icon class="mr-1 text--secondary" small>mdi-play-box-outline</v-icon>
              <span>Interact</span>
            </v-btn>
          </div>
          <v-card tile flat outlined class="pa-0 mt-2">
            <v-card-text class="pa-0">
              <Michelson :code="loadedCode"></Michelson>
            </v-card-text>
          </v-card>
        </div>
        <ErrorState v-else />
      </v-col>
      <v-col cols="3">
        <v-expansion-panels class="mt-10">
          <v-expansion-panel
            v-if="isContract && contract.same_count > 0"
            class="ma-0 mt-2"
            @click="requestSame"
          >
            <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
              <span
                class="caption font-weight-bold text-uppercase text--secondary"
              >Same contracts ({{ contract.same_count }})</span
              >
            </v-expansion-panel-header>
            <v-skeleton-loader
              v-if="isSameInitialLoading"
              type="image"
              :loading="isSameInitialLoading"
            >
            </v-skeleton-loader>
            <v-expansion-panel-content color="data">
              <v-list class="contract-list mt-2">
                <template v-for="(contract, i) in same">
                  <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
                  <SimilarItem
                    :key="i"
                    :item="contract"
                    :address="address"
                    :network="network"
                  />
                </template>
                <v-divider></v-divider>
                <v-list-item v-if="same.length < same_count">
                  <v-list-item-content>
                    <v-list-item-title class="d-flex align-center justify-center">
                      <v-btn
                        v-if="!isSameInitialLoading"
                        class="text--secondary"
                        :loading="sameLoading"
                        text
                        small
                        @click="requestMoreSame"
                      >Load more</v-btn
                      >
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="ma-0 mt-2 bb-1" v-if="migrations.length > 0">
            <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span
              class="caption font-weight-bold text-uppercase text--secondary"
            >Logs ({{ migrations.length }})</span
            >
            </v-expansion-panel-header>
            <v-expansion-panel-content color="data">
              <v-list class="contract-list">
                <template v-for="(log, i) in migrations">
                  <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
                  <LogItem
                    :key="i"
                    :log="log"
                    :network="network"
                    :address="address"
                  />
                </template>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <RawJsonViewer
      :show.sync="showRaw"
      type="code"
      :network="network"
      :address="address"
      :level="getFallbackLevel(selectedProtocol)" />
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapActions } from "vuex";
import Michelson from "@/components/Michelson.vue";
import ErrorState from "@/components/ErrorState.vue";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";
import LogItem from "@/views/contract/LogItem.vue";
import {DATA_LOADING_STATUSES} from "../../utils/network";
import SimilarItem from "./SimilarItem";

export default {
  props: {
    contract: Object,
    migrations: Array,
    address: String,
    network: String,
  },
  components: {
    SimilarItem,
    ErrorState,
    Michelson,
    RawJsonViewer,
    LogItem
  },
  data: () => ({
    code: {},
    renderingInterval: null,
    lastSubstring: 0,
    freezingAmount: 35000,
    loadedPercentage: 0,
    isCodeRendered: false,
    loadedCode: "",
    loading: true,
    selectedProtocol: "",
    showRaw: false,
    migrations: [],
    migrationsLoading: false,
    same: [],
    same_count: 0,
    sameLoading: false,
    sameInitialLoadingStatus: DATA_LOADING_STATUSES.NOTHING,
  }),
  created() {
    if (this.$route.query.protocol) {
      this.selectedProtocol = this.$route.query.protocol;
      this.$nextTick(() => {
        this.getCode(this.$route.query.protocol);
      });
    } else {
      this.$nextTick(() => {
        this.getCode();
      });
    }
    if (this.isContract) {
      this.getMigrations();
    }
  },
  computed: {
    isContract() {
      return this.address.startsWith("KT");
    },
    isSameInitialLoading() {
      return this.sameInitialLoadingStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    selectedCode() {
      if (!this.loading) {
        return this.code[this.selectedProtocol];
      }
      return null;
    },
    codeVersions() {
      let versions = [];
      if (this.migrations) {
        versions = this.migrations
          .filter(m => m.kind === "update")
          .map(function(m) {
            return {
              proto: m.prev_protocol.slice(0, 8),
              protocol: m.prev_protocol
            };
          });
      }
      versions.unshift({ proto: "Latest", protocol: "" });
      return versions;
    }
  },
  destroyed() {
    clearInterval(this.renderingInterval);
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK", "showClipboardWarning"]),
    requestSame() {
      if (!this.isContract
        || this.sameInitialLoadingStatus !== DATA_LOADING_STATUSES.NOTHING
      ) return;

      this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.PROGRESS;
      this.same = [];
      this.sameCount = 0;
      this.api
        .getSameContracts(this.network, this.address, 0)
        .then((res) => {
          if (!res) return;
          this.same = res.contracts;
          this.sameCount = res.count;
          this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.SUCCESS;
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
          this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.ERROR;
        });
    },
    requestMoreSame() {
      this.sameLoading = true;
      this.api
        .getSameContracts(this.network, this.address, this.same.length)
        .then((res) => {
          if (!res) return;
          this.same.push(...res.contracts);
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.sameLoading = false));
    },
    getMigrations() {
      this.migrationsLoading = true;
      this.api
        .getContractMigrations(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.migrations = res;
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => (this.migrationsLoading = false));
    },
    showSuccessCopy() {
      if (this.selectedCode.length <= this.freezingAmount) {
        this.showClipboardOK();
      }
    },
    getValueToCopy() {
      if (this.selectedCode.length > this.freezingAmount) {
        this.showClipboardWarning();
      }

      return this.selectedCode;
    },
    setCodeByParts() {
      const code = this.code[this.selectedProtocol];
      this.renderingInterval = setInterval(() => {
        if (!this.isCodeRendered) {
          this.setLoadedCode(code);
        } else {
          clearInterval(this.renderingInterval);
        }
      }, 0);
    },
    setLoadedCode(code) {
      this.loadedCode += code.substring(this.lastSubstring, this.lastSubstring + this.freezingAmount);
      if (this.lastSubstring + this.freezingAmount >= code.length) {
        this.isCodeRendered = true;
      }
      this.lastSubstring = this.lastSubstring + this.freezingAmount;
      this.loadedPercentage = this.lastSubstring / code.length * 100;
    },
    getFallbackLevel(protocol = "") {
      if (protocol !== "" && this.migrations) {
        for (var i = 0; i < this.migrations.length; i++) {
          if (this.migrations[i].prev_protocol === protocol) {
            return Math.max(0, this.migrations[i].level - 4096);
          }
        }
      }
      return 0;
    },
    getCode(protocol = "") {
      this.loading = true;
      if (this.code[protocol]) {
        this.loading = false;
        return;
      }

      let level = this.getFallbackLevel(protocol);
      this.api
        .getContractCode(this.network, this.address, protocol, level)
        .then(res => {
          if (!res) return;
          Vue.set(this.code, protocol, res);
          this.$nextTick(() => {
            this.setCodeByParts();
          });
        })
        .catch(err => {
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    downloadFile() {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(this.selectedCode)
      );
      element.setAttribute("download", this.address + ".tz");
      element.style.display = "none";
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    },
  },
  watch: {
    address: function() {
      this.selectedProtocol = "";
      this.getCode();
    },
    selectedProtocol: function(newValue) {
      if (newValue !== "") {
        this.$router.replace({ query: { protocol: newValue } });
      } else {
        this.$router.replace({ query: null });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.rendering-percents {
  font-size: 0.65em;
}
</style>
