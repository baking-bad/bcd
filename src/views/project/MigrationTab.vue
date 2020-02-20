<template>
  <v-container fluid>
    <v-row v-if="!loading">
      <v-col cols="12">
        <div id="view" style="font-size: 12px;"></div>
      </v-col>
    </v-row>
    <v-skeleton-loader v-else height="400" type="image" class="ma-3"></v-skeleton-loader>
  </v-container>
</template>

<script>
// import * as Diff2Html from "diff2html";
// import "diff2html/bundles/css/diff2html.min.css";

import { getContractCode } from "@/api/index.js";
// import { create } from "@/utils/codemirror.js";
import CodeMirror from "codemirror";
require("codemirror/theme/neo.css");
require("codemirror/addon/merge/merge.js");
require("codemirror/addon/merge/merge.css");
require("codemirror/lib/codemirror.css");

export default {
  name: "MigrationTab",
  props: {
    contract: Object
  },
  computed: {
    loading() {
      return this.code1 == null || this.code2 == null;
    }
  },
  data: () => ({
    // result: null
    code1: null,
    code2: null
  }),
  methods: {
    init() {
      //   this.result = Diff2Html.html(this.contract.migration, {
      //     drawFileList: false,
      //     matching: "words",
      //     outputFormat: "line-by-line",
      //     fileListToggle: false
      //   });
      var target = document.getElementById("view");
        target.innerHTML = "";
      //   let CodeMirror = create();
      CodeMirror.MergeView(target, {
        value: this.code1,
        orig: this.code2,
        lineNumbers: true,
        mode: "text/html",
        theme: "neo",
        highlightDifferences: false,
        connect: "align",
        collapseIdentical: false
      });
    },
    getCode() {
      getContractCode(this.contract.network, this.contract.address, 0)
        .then(res => (this.code1 = res))
        .catch(err => console.log(err));
      getContractCode(
        this.contract.network,
        this.contract.address,
        this.contract.level
      )
        .then(res => (this.code2 = res))
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.getCode();
  },
  watch: {
    loading(newValue) {
      if (newValue) return;
      this.$nextTick(() => {
        this.init();
      });
    }
  }
};
</script>

<style>
.CodeMirror {
  line-height: 1.2;
}
@media screen and (min-width: 1300px) {
  article {
    max-width: 1000px;
  }
  #nav {
    border-right: 499px solid transparent;
  }
}
span.clicky {
  cursor: pointer;
  background: #d70;
  color: white;
  padding: 0 3px;
  border-radius: 3px;
}
</style>