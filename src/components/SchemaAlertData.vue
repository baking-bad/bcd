<template>
  <div v-show="alertData" class="pa-6 pt-0">
    <v-alert type="error" prominent text class="ma-0">
      <span class="text--primary">{{ alertData }}</span>
    </v-alert>
  </div>
</template>

<script>
export default {
name: "SchemaAlertData"
}
</script>

<style scoped>

</style>