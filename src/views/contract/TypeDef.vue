<template>
  <div class="d-flex flex-column parameters">
    <div v-for="(def, i) in typedef" :key="i" class="mb-2">
      <span v-if="i === 0" class="font-weight-light">{{ first }}&nbsp;</span>
      <span v-else-if="def.name" class="font-weight-light">{{ def.name }}&nbsp;</span>
      <span class="tree--text" v-html="highlightType(def.type)"></span>
      <div v-for="(arg, j) in def.args" :key="i + j" class="pl-4">
        <span>{{ arg.key }}&nbsp;</span>
        <span class="tree--text" v-html="highlightType(arg.value)"></span>
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';

export default {
  name: "TypeDef",
  props: {
    typedef: Array,
    first: String
  },
  methods: {
    highlightType(expr) {
      return sanitizeHtml(expr.replace(/(\$\w+)/g, '<span class="accent--text">$1</span>'));
    },
  },
};
</script>

<style lang="scss" scoped>
.parameters {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;

  .value {
    color: var(--v-tree-base);
  }
}
</style>