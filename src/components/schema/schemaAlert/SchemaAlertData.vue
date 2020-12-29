<template>
  <div class="pa-6 pt-0">
    <v-alert type="error" prominent text class="ma-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text--primary">{{ alertData }}</span>
        <v-btn
            elevation="2"
            @click="$emit('dismiss')"
        >
          Dismiss
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "SchemaAlertData",
  props: {
    alertData: String,
  },
}
</script>
