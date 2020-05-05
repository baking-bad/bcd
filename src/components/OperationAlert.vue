<template>
  <div>
    <v-alert
      border="left"
      color="red lighten-2"
      dense
      prominent
      text
      outlined
      type="error"
      :key="idx"
      v-for="(err, idx) in errors"
    >
      <v-row align="center" no-gutters>
        <v-col>
          <div class="red--text subtitle-1">{{ err.title }}</div>
          <div class="caption">
            {{ err.descr }}
            <span v-if="err.with" style="word-break: break-all">: {{ err.with }}</span>
            <span
              v-else-if="err.id.includes('contract.balance_too_low')"
              style="word-break: break-all"
            >: {{ err.balance | uxtz }} &lt; {{ err.amount | uxtz }}</span>
          </div>
        </v-col>
        <v-col class="shrink" v-if="err.id.includes('michelson_v1.script_rejected')">
          <v-btn
            color="red"
            small
            text
            @click="getErrorLocation"
            :loading="errorLocationLoading"
          >Show code</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <v-dialog v-if="errorLocation" v-model="showErrorLocation" width="800">
      <v-card>
        <v-card-text class="pb-0">
          <Michelson
            :code="errorLocation.text"
            :firstLineNumber="errorLocation.first_row"
            :mark="{row: errorLocation.failed_row - errorLocation.first_row, start: errorLocation.start_col, end: errorLocation.end_col}"
          ></Michelson>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Michelson from "@/components/Michelson.vue";

export default {
  name: "OperationAlert",
  props: {
    operationId: String,
    errors: Array
  },
  components: {
    Michelson
  },
  data: () => ({
    errorLocation: null,
    errorLocationLoading: false,
    showErrorLocation: false
  }),
  methods: {
    getErrorLocation() {
      this.errorLocationLoading = true;
      this.api
        .getErrorLocation(this.operationId)
        .then(res => {
          this.errorLocation = res;
          this.showErrorLocation = true;
        })
        .catch(err => console.log(err))
        .finally(() => (this.errorLocationLoading = false));
    }
  },
  watch: {
    showErrorLocation: function(newValue) {
      if (!newValue) this.errorLocation = null;
    }
  }
};
</script>