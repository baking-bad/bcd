<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <v-card class="ma-3" tile v-else>
      <codemirror v-model="code" :options="cmOptions"></codemirror>
    </v-card>
  </v-container>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require('codemirror/addon/mode/simple.js')
require('codemirror/theme/neo.css')

import { create } from "@/utils/codemirror.js";
import { getContractCode } from "@/api/index.js";

export default {
  props: {
    contract: Object
  },
  components: {
    codemirror
  },
  data: () => ({
    code: null,
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
    getCode() {
      getContractCode(this.contract.network, this.contract.address)
        .then(res => {
          this.code = res;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.loading = false;
        });
    }
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