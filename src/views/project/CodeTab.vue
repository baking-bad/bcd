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
      mode: "application/ld+json",
      lineWrapping: true,
      lineNumbers: true,
      viewportMargin: 3
    },
    loading: true
  }),
  mounted() {
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