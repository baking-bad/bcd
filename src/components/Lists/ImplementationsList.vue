<template>
  <div class="d-flex flex-column parameters">
    <div v-for="(info, implementationName) in implementations"
         :key="implementationName"
         class="mb-2 cursor-pointer"
         @click="$emit('selectImplementation', {info, implementationName})"
    >
      <span class="font-weight-light value">{{implementationName}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImplementationsList",
  props: {
    implementations: Object,
  },
}
</script>

<style lang="scss" scoped>
.parameters {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;
  margin-top: 0;
  .value {
    color: var(--v-tree-base);
  }
}
</style>
