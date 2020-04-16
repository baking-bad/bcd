<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="500" type="image" class="ma-3"/>
    <div v-else-if="selectedCode">
      <v-toolbar flat class="mb-2 transparent">
        <v-btn small depressed class="toolbar-btn" @click="downloadFile">
          <v-icon class="mr-1" small>mdi-download-outline</v-icon>
          <span class="overline">Download as .tz</span>
        </v-btn>
        <v-btn small depressed class="toolbar-btn" @click="openTryMichelson">
          <v-icon class="mr-1" small>mdi-play-circle-outline</v-icon>
          <span class="overline">Run in sandbox</span>
        </v-btn>
        <v-btn
          v-if="contract.language === 'smartpy'"
          small
          depressed
          class="toolbar-btn"
          :href="getSmartPyLink()"
          rel="nofollow noopener"
          target="_blank"
        >
          <v-icon class="mr-1" small>mdi-link</v-icon>
          <span class="overline">View on SmartPy.io</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-select
          v-if="codeVersions.length > 0"
          v-model="selectedProtocol"
          @change="getCode(selectedProtocol)"
          :items="codeVersions"
          item-text="proto"
          item-value="protocol"
          label="Version"
          style="max-width: 150px;"
          dense
          hide-details
        ></v-select>
      </v-toolbar>
      <v-card tile>
        <Michelson :code="selectedCode"></Michelson>
      </v-card>
    </div>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import Michelson from "@/components/Michelson.vue";
import { mapActions } from "vuex";
import { getContractCode, getContractStorageRaw, getContractMigrations } from "@/api/index.js";
import ErrorState from "@/components/ErrorState.vue";
import LZString from "lz-string";

export default {
  props: {
    contract: Object
  },
  components: {
    ErrorState,
    Michelson
  },
  data: () => ({
    loading: true,
    selectedProtocol: ""
  }),
  created() {
    if (this.$route.query.protocol) {
      this.selectedProtocol = this.$route.query.protocol;
      this.getCode(this.$route.query.protocol);
    } else {
      this.getCode();
    }
    this.getMigrations();
  },
  computed: {
    selectedCode() {
      if (!this.loading && this.contract != null && this.contract.code) {
        return this.contract.code[this.selectedProtocol];
      }
      return null;
    },
    codeVersions() {
      if (this.contract != null && this.contract.migrations) {
        let versions = this.contract.migrations
          .filter(m => m.kind === 'protocol')
          .map(function(m) { return {proto: m.prev_protocol.slice(0, 8), protocol: m.prev_protocol}})
        if (versions.length > 0) {
          versions.unshift({proto: "Latest", protocol: ""})
          return versions
        }
      }
      return []
    }
  },
  methods: {
    ...mapActions(["showError"]),
    getCode(protocol = "") {
      if (this.contract == null) return;
      this.loading = true;
      if (typeof this.contract.code !== 'object') {
        this.contract.code = {};
      } else if (this.contract.code[protocol]) {
        this.loading = false;
        return;
      }
      getContractCode(this.contract.network, this.contract.address, protocol)
        .then(res => {
          if (!res) return;
          this.contract.code[protocol] = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMigrations() {
      if (this.contract == null || this.contract.migrations) {
        return;
      }
      getContractMigrations(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
          this.contract.migrations = res;
        })
        .catch(err => {
          console.log(err);
        })
    },
    downloadFile() {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(this.selectedCode)
      );
      element.setAttribute("download", this.contract.address + ".tz");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    getSmartPyLink() {
      if (this.contract.language === "smartpy")
        return `https://smartpy.io/dev/explore.html?address=${this.contract.address}`;
    },
    openTryMichelson() {
      if (this.contract.raw_storage === undefined) {
        getContractStorageRaw(this.contract.network, this.contract.address)
          .then(res => {
            this.contract.raw_storage = String(res);
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          });
      }
      let query = `source=${this.selectedCode}`;
      if (this.contract.raw_storage !== undefined) {
        let storage = this.contract.raw_storage.replace(/\n|\s+/gm, " ");
        query += `&storage=${storage}`;
      }
      let lzQuery = LZString.compressToEncodedURIComponent(query);
      let uri = `https://try-michelson.tzalpha.net/?${lzQuery}`;

      var newTab = window.open(); // https://habr.com/ru/post/282880/
      newTab.opener = null;
      newTab.location = uri;
    }
  },
  watch: {
    contract: function() {
      this.selectedProtocol = "";
      this.getCode();
      this.getMigrations();
    }
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
  margin-right: 10px;
}
</style>