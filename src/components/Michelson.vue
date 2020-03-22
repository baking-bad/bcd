<template>
  <codemirror v-model="code" :options="cmOptions"></codemirror>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/addon/mode/simple.js");
require("codemirror/theme/neo.css");

import { create } from "@/utils/codemirror.js";

export default {
  name: "Michelson",
  props: {
    code: String
  },
  components: {
    codemirror
  },
  data: () => ({
    cmOptions: {
      mode: "michelson",
      theme: "neo",
      lineWrapping: true,
      lineNumbers: true,
      viewportMargin: Infinity
    }
  }),
  created() {
    create();
  }
};
</script>

<style>
.CodeMirror {
  background-color: #fbfbfb;
  height: auto;
  margin-top: 2px;
  font-size: 0.9rem;
}
</style>
