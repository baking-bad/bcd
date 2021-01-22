<template>
  <div class="pa-6 pt-0">
    <v-alert type="success" prominent text class="ma-0 align-center">
      <div class="d-flex align-center">
        <span class="text--primary" v-html="successText"></span>
        <v-btn
            text
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
  name: "SchemaAlertCustomSuccess",
  props: {
    successText: String,
  },
}
</script>

