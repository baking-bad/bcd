<template>
  <h2 class="ml-6 font-weight-regular" v-if="title">
    <span class="mr-2 hash font-weight-thin">{{ title }}</span>
    <span v-if="isStorage" class="secondary--text" v-html="helpers.shortcut(name)"></span>
    <span v-else class="hash secondary--text">{{ name }}</span>
  </h2>
</template>

<script>
export default {
name: "SchemaHeader"
}
</script>

<style scoped>

</style>