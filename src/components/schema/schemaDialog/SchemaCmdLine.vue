<template>
  <v-dialog v-model="show" width="800" scrollable ref="cmdLineDialog" :retain-focus="false">
    <v-card flat outlined>
      <v-card-title class="sidebar d-flex justify-center py-2">
        <span class="body-1 font-weight-medium text-uppercase text--secondary">Tezos-client</span>
        <v-spacer></v-spacer>
        <v-btn
            class="mr-4 text--secondary"
            v-clipboard="() => cmdLine"
            v-clipboard:success="showClipboardOk"
            text
        >
          <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
        </v-btn>
        <v-btn icon small @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        <v-row>
          <v-col cols="12">
            <span class="hash">{{ cmdLine }}</span>
          </v-col>
          <v-col cols="12"><v-divider/></v-col>
          <v-col>
            <span class="overline">Optional settings</span>
            <v-text-field v-model="burnCap" label="Burn cap" class="mt-4" type="numeric" :rules="rules" @keypress="isNumber($event)" dense outlined/>
            <v-checkbox v-model="dryRun" color="primary" label="Dry run"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SchemaCmdLine",
  props: {
    value: Boolean,
    tezosClientCmdline: String,
    showClipboardOk: Function,
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    cmdLine() {
      return `${this.tezosClientCmdline} ${this.options}`
    },
    options() {
      let data = '';
      if (this.dryRun) {
        data += '--dry-run '
      }
      if (this.burnCap > 0) {
        data += `--burn-cap ${this.burnCap.replace(/^0+(?!\.|$)/, '')}`
      }
      return data;
    }
  },
  updated() {
    if (this.value && !this.once) {
      this.once = true;
      this.$refs.cmdLineDialog.show();
    }
  },
  data() {
    return {
      dryRun: false,
      burnCap: '0',
      once: false,
      rules: [
        v => /^\d+(\.\d+)?$/.test(v) || "The value must be a float number"
      ]
    }
  },
  methods: {
    isNumber(evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  }
}
</script>
