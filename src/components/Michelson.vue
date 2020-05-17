<template>
  <codemirror ref="editor" v-model="code" :options="cmOptions"></codemirror>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/addon/mode/simple.js");
require("codemirror/addon/display/autorefresh.js");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/theme/material-darker.css");
require("codemirror/theme/pastel-on-dark.css");
require("codemirror/theme/darcula.css");
require("codemirror/theme/neo.css");

import { create } from "@/utils/codemirror.js";

export default {
  name: "Michelson",
  props: {
    code: String,
    firstLineNumber: Number,
    mark: Object
  },
  components: {
    codemirror
  },
  computed: {
    editor() {
      return this.$refs.editor.editor;
    }
  },
  data: () => ({
    cmOptions: {
      mode: "michelson",
      theme: "darcula",
      lineWrapping: true,
      lineNumbers: true,
      viewportMargin: Infinity,
      readOnly: true,
      autoRefresh: true
    }
  }),
  created() {
    if (this.firstLineNumber)
      this.cmOptions.firstLineNumber = this.firstLineNumber;

    create();
  },
  mounted() {
    if (this.editor && this.mark) {
      this.editor.markText(
        { line: this.mark.row, ch: this.mark.start },
        { line: this.mark.row, ch: this.mark.end },
        { className: "error-mark" }
      );
    }
  }
};
</script>

<style>
.CodeMirror {
  /* background-color: #fbfbfb; */
  height: auto;
  font-size: 0.9rem;
}
.error-mark {
  /* background-color: #ffdce0; */
  color: red !important;
}
</style>
