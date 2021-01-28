<template>
  <div v-show="injectedOpHash" class="pa-6 pt-0">
    <v-alert type="success" prominent text class="ma-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text--primary">Operation has been sucessfully injected</span>
        <v-btn
            text
            class="text--secondary hash"
            style="text-transform: none;"
            :to="`/${network}/opg/${injectedOpHash}`"
            target="_blank"
        >
          <span v-html="helpers.shortcut(injectedOpHash)"></span>
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "SchemaAlertOpHashSuccess",
  props: {
    network: String,
    injectedOpHash: String,
  }
}
</script>
