<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <div v-else-if="contract.code">
      <v-toolbar flat class="mb-2 transparent">
        <v-spacer></v-spacer>
        <v-btn small text class="toolbar-btn" @click="downloadFile">
          <v-icon>mdi-download-outline</v-icon>
          <span>Download</span>
        </v-btn>
      </v-toolbar>
      <v-card tile>
        <codemirror v-model="contract.code" :options="cmOptions"></codemirror>
      </v-card>
    </div>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/addon/mode/simple.js");
require("codemirror/theme/neo.css");

import { mapActions } from "vuex";

import { create } from "@/utils/codemirror.js";
import { getContractCode } from "@/api/index.js";
import ErrorState from "@/components/ErrorState.vue";

export default {
  props: {
    contract: Object
  },
  components: {
    codemirror,
    ErrorState
  },
  data: () => ({
    cmOptions: {
      mode: "michelson",
      theme: "neo",
      lineWrapping: true,
      lineNumbers: true,
      viewportMargin: Infinity
    },
    loading: true
  }),
  created() {
    create();
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
    }
  },
  watch: {
    contract: "getCode"
  }
};
</script>

<style>
.CodeMirror {
  background-color: #fbfbfb;
  height: auto;
  margin-top: 2px;
}
</style>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>