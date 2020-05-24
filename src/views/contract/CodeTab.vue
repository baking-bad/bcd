<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader v-if="loading" type="card-heading, image" />
    <div v-else-if="selectedCode">
      <v-card tile flat outlined class="pa-0">
        <v-card-title class="d-flex sidebar px-4 py-2">
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
          <v-spacer></v-spacer>
          <v-btn @click="showRaw = true" small text>
            <v-icon class="mr-1" small>mdi-code-json</v-icon>
            <span class="text--secondary">Raw JSON</span>
          </v-btn>
          <v-btn small text @click="downloadFile">
            <v-icon class="mr-1 text--secondary" small>mdi-download-outline</v-icon>
            <span class="text--secondary">Download as .tz</span>
          </v-btn>
          <v-btn small text @click="openTryMichelson" class="ml-2">
            <v-icon class="mr-1 text--secondary" small>mdi-play-circle-outline</v-icon>
            <span class="text--secondary">Run in sandbox</span>
          </v-btn>
          <v-btn
            v-if="contract.language === 'smartpy'"
            small
            text
            class="ml-2"
            :href="getSmartPyLink()"
            rel="nofollow noopener"
            target="_blank"
          >
            <v-icon class="mr-1 text--secondary" small>mdi-link</v-icon>
            <span class="text--secondary">View on SmartPy.io</span>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <Michelson :code="selectedCode"></Michelson>
        </v-card-text>
      </v-card>
    </div>
    <ErrorState v-else />
    <RawJsonViewer
      :show.sync="showRaw"
      type="code"
      :network="network"
      :address="address"
      :level="getFallbackLevel(selectedProtocol)" />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Michelson from "@/components/Michelson.vue";
import ErrorState from "@/components/ErrorState.vue";
import RawJsonViewer from "@/components/RawJsonViewer.vue"
import LZString from "lz-string";

export default {
  props: {
    contract: Object,
    migrations: Array,
    address: String,
    network: String,
  },
  components: {
    ErrorState,
    Michelson,
    RawJsonViewer
  },
  data: () => ({
    code: {},
    loading: true,
    selectedProtocol: "",
    showRaw: false
  }),
  created() {
    if (this.$route.query.protocol) {
      this.selectedProtocol = this.$route.query.protocol;
      this.getCode(this.$route.query.protocol);
    } else {
      this.getCode();
    }
  },
  computed: {
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
  methods: {
    ...mapActions(["showError"]),
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
          this.code[protocol] = res;
        })
        .catch(err => {
          console.log(err);
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
    getSmartPyLink() {
      if (this.contract.language === "smartpy")
        return `https://smartpy.io/dev/explore.html?address=${this.address}`;
    },
    openTryMichelson() {
      this.api
        .getContractStorageRaw(this.network, this.address)
        .then(res => {
          let query = `source=${this.selectedCode}`;
          if (res) {
            let storage = res.replace(/\n|\s+/gm, " ");
            query += `&storage=${storage}`;
          }
          let lzQuery = LZString.compressToEncodedURIComponent(query);
          let uri = `https://try-michelson.tzalpha.net/?${lzQuery}`;

          var newTab = window.open(); // https://habr.com/ru/post/282880/
          newTab.opener = null;
          newTab.location = uri;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    }
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