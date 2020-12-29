<template>
  <h2 class="ml-6 font-weight-regular">
    <span class="mr-2 hash font-weight-thin">{{ title }}</span>
    <span v-if="isStorage" class="secondary--text" v-html="storageHtml"></span>
    <span v-else class="hash secondary--text">{{ storageName }}</span>
  </h2>
</template>

<script>
export default {
  name: "SchemaHeader",
  props: {
    isStorage: Boolean,
    storageHtml: String,
    storageName: String,
    title: String,
  }
}
</script>

<style scoped>

</style>