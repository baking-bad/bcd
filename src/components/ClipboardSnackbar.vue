<template>
  <v-snackbar v-model="$store.state.clipboardOK" color="light-green darken-1" :timeout="2000" top>
    Copied to clipboard!
    <v-btn text @click="hideClipboardOK">OK</v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ClipboardSnackbar",
  methods: {
    ...mapActions(["hideClipboardOK"])
  }
};
</script>