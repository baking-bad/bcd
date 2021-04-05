<template>
  <div class="pa-6 pt-0">
    <v-alert type="error" prominent text class="ma-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text--primary">{{ alertData }}</span>
        <v-btn
            class="text--primary"
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
  name: "SchemaAlertData",
  props: {
    alertData: String,
    isFullMessage: Boolean,
    errorValue: [Object, null],
  },
  watch: {
    errorValue: {
      handler(val) {
        this.$nextTick(() => {
          this.value = true;
          this.$set(this, 'data', val);
        })
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      value: false,
      data: {},
    }
  }
}
</script>
