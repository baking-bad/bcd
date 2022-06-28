<template>
  <v-snackbar top right color="error" :value="!!$store.state.error.text" :timeout="7000">
    <v-icon class="mr-3">mdi-alert-circle-outline</v-icon>
    {{ $store.state.error.text }}
    <v-btn icon @click="hideError">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["hideError"])
  }
};
</script>

<style lang="scss">
.v-snack--top {
  top: 72px !important;
}

@media (max-width: 600px) {
  .v-snack--top {
    top: 64px !important;
  }
}
</style>
