<template>
  <v-dialog v-model="showCmdline" width="800" scrollable :retain-focus="false">
    <v-card flat outlined>
      <v-card-title class="sidebar d-flex justify-center py-2">
        <span class="body-1 font-weight-medium text-uppercase text--secondary">Tezos-client</span>
        <v-spacer></v-spacer>
        <v-btn
            class="mr-4 text--secondary"
            v-clipboard="() => tezosClientCmdline"
            v-clipboard:success="showClipboardOk"
            text
        >
          <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
        </v-btn>
        <v-btn icon small @click="showCmdline = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-6">
        <span class="hash">{{ tezosClientCmdline }}</span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SchemaCmdLine",
  props: {
    showCmd: Boolean,
    tezosClientCmdline: String,
    showClipboardOk: Function,
  },
  watch: {
    showCmd(val) {
      this.showCmdline = val;
    },
    showCmdline(val) {
      this.$emit('cmdLineChange', val)
    },
  },
  data() {
    return {
      showCmdline: false,
    }
  }
}
</script>
