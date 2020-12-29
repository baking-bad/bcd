<template>
  <div class="pa-6 pt-0">
    <v-alert type="success" prominent text class="ma-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text--primary">{{ successText }}</span>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "SchemaAlertCustomSuccess",
  props: {
    successText: String,
  }
}
</script>
