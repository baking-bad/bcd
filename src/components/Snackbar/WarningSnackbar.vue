<template>
  <v-snackbar :value="$store.state.warning" class="warning-base" :timeout="3000" @input="hideWarning" top>
    <v-icon class="mr-3">mdi-comment-alert-outline</v-icon>
    <span>{{ $store.state.warning }}</span>
    <v-btn text @click="hideWarning">OK</v-btn>
  </v-snackbar>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "WarningSnackbar",
  methods: {
    ...mapActions(["hideWarning"])
  }
}
</script>
<style lang="scss">
.warning-base {
  .v-snack__wrapper {
    background: var(--v-warning-base);
  }
}
</style>
