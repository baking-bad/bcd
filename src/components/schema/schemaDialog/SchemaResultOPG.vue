<template>
  <v-dialog v-model="showResultOPG" width="1200" persistent scrollable @keydown.esc="showResult = false">
    <v-card flat outlined>
      <v-card-title class="sidebar d-flex justify-center pa-4">
        <span class="body-1 font-weight-medium text-uppercase text--secondary">Simulation result</span>
        <div
            v-if="simulatedOperation && settings.source"
            class="d-flex flex-column align-center ml-10"
        >
          <span class="overline">gas limit</span>
          <span class="hash" style="font-size: 14px; line-height: 14px;">{{ gasLimit }}</span>
        </div>
        <div
            v-if="simulatedOperation && settings.source"
            class="d-flex flex-column align-center ml-10"
        >
          <span class="overline">storage limit</span>
          <span class="hash" style="font-size: 14px; line-height: 14px;">{{ storageLimit }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon small @click="showResultOPG = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <InternalOperation :data="simulatedOperation" noheader />
        <template v-for="(intop, intid) in simulatedOperation.internal_operations">
          <v-divider :key="'divider' + intid"></v-divider>
          <InternalOperation :data="intop" :mainOperation="simulatedOperation" :key="intid" />
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import InternalOperation from "@/components/InternalOperation";
export default {
name: "SchemaResultOPG",
  components: {
    InternalOperation
  },
  props: {
    showResult: Boolean,
    simulatedOperation: Object,
    settings: Object,
    gasLimit: Number,
    storageLimit: Number,
  },
  watch: {
    showResult(val) {
      this.showResultOPG = val;
    },
    showResultOPG(val) {
      this.$emit('resultOPGchange', val)
    },
  },
  data() {
    return {
      showResultOPG: false,
    }
  }
}
</script>
