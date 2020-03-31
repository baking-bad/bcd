<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <div v-else-if="contract.code">
      <v-toolbar flat class="mb-2 transparent">
        <v-btn small depressed class="toolbar-btn" @click="downloadFile">
          <v-icon class="mr-1" small>mdi-download-outline</v-icon>
          <span class="overline">Download as .tz</span>
        </v-btn>
        <v-btn small depressed class="toolbar-btn" @click="openTryMichelson">
          <v-icon class="mr-1" small>mdi-play-circle-outline</v-icon>
          <span class="overline">Run in sandbox</span>
        </v-btn>
        <v-btn v-if="contract.language === 'smartpy'" small depressed class="toolbar-btn"
               :href="getSmartPyLink()" rel="nofollow noopener" target="_blank">
          <v-icon class="mr-1" small>mdi-link</v-icon>
          <span class="overline">View on SmartPy.io</span>
        </v-btn>
      </v-toolbar>
      <v-card tile>
        <Michelson :code="contract.code"></Michelson>
      </v-card>
    </div>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import Michelson from "@/components/Michelson.vue"
import { mapActions } from "vuex";
import { getContractCode, getContractStorageRaw } from "@/api/index.js";
import ErrorState from "@/components/ErrorState.vue";
import LZString from "lz-string"

export default {
  props: {
    contract: Object
  },
  components: {
    ErrorState,
    Michelson
  },
  data: () => ({
    loading: true
  }),
  created() {
    this.getCode();
  },
  methods: {
    ...mapActions(["showError"]),
    getCode() {
      if (this.contract == null) return;
      if (this.contract.code !== undefined) {
        this.loading = false;
        return;
      }
      getContractCode(this.contract.network, this.contract.address)
        .then(res => {
          this.contract.code = res;
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
        "data:text/plain;charset=utf-8," + encodeURIComponent(this.contract.code)
      );
      element.setAttribute("download", this.contract.address + ".tz");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    getSmartPyLink() {
      if (this.contract.language === 'smartpy')
        return `https://smartpy.io/dev/explore.html?address=${this.contract.address}`
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
        })
      }
      let query = `source=${this.contract.code}`
      if (this.contract.raw_storage !== undefined) {
        let storage = this.contract.raw_storage.replace(/\n|\s+/gm, ' ');
        query += `&storage=${storage}`
      }
      let lzQuery = LZString.compressToEncodedURIComponent(query);
      let uri = `https://try-michelson.tzalpha.net/?${lzQuery}`;
      
      var newTab = window.open();  // https://habr.com/ru/post/282880/
      newTab.opener = null;
      newTab.location = uri;
    }
  },
  watch: {
    contract: "getCode"
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
  margin-right: 10px;
}
</style>