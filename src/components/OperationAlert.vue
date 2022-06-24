<template>
  <div>
    <v-alert
      prominent
      text
      type="error"
      :key="idx"
      v-for="(err, idx) in displayedErrors"
      class="my-2"
    >
      <v-row align="center" no-gutters>
        <v-col cols="10" class="d-flex flex-column px-4">
          <span class="hash">{{ err.title }}</span>
          <span class="text--secondary body-1">
            <span>{{ err.descr }}</span>
            <span v-if="err.with" style="word-break: break-all">
              with
              <span class="ml-2 hash font-weight-medium">{{ err.with }}</span>
            </span>
            <span
              v-else-if="err.id.includes('contract.balance_too_low')"
              style="word-break: break-all"
            >: {{ err.balance | uxtz }} &lt; {{ err.amount | uxtz }}</span>
          </span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="2"
          class="d-flex justify-end align-center"
          v-if="err.id.includes('michelson_v1.script_rejected') && operationId"
        >
          <v-btn
            small
            text
            @click="getErrorLocation"
            :loading="errorLocationLoading"
            class="text--secondary" 
          >Show failed code</v-btn>
        </v-col>
        <v-col
          cols="2"
          class="d-flex justify-end align-center"
          v-if="err.id.includes('invalidSyntacticConstantError') && operationId"
        >
          <v-btn small text class="text--secondary" @click="showParameterError(err)">Show mismatch</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <v-dialog v-if="errorLocation" v-model="showErrorLocation" width="800">
      <v-card>
        <v-card-text class="pa-0">
          <Michelson
            :code="errorLocation.text"
            :firstLineNumber="errorLocation.first_row"
            :mark="{
              row: errorLocation.failed_row - errorLocation.first_row, 
              start: errorLocation.start_col, 
              end: errorLocation.end_col
            }"
          ></Michelson>
        </v-card-text>
      </v-card>
    </v-dialog>

    <TreeNodeDetails v-model="showTreeNodeView" :data="treeNodeData" :network="network" />
  </div>
</template>

<script>
import Michelson from "@/components/Michelson.vue";
import TreeNodeDetails from "@/components/Dialogs/TreeNodeDetails.vue";

export default {
  name: "OperationAlert",
  props: {
    operationId: Number,
    errors: Array,
    network: String,
  },
  components: {
    Michelson,
    TreeNodeDetails,
  },
  data: () => ({
    errorLocation: null,
    errorLocationLoading: false,
    showErrorLocation: false,
    showTreeNodeView: false,
    treeNodeData: null,
  }),
  computed: {
    displayedErrors() {
      return this.errors.filter((e) => !e.id.includes("runtime_error"));
    },
  },
  methods: {
    getErrorLocation() {
      this.errorLocationLoading = true;
      this.api
        .getErrorLocation(this.operationId)
        .then((res) => {
          this.errorLocation = res;
          this.showErrorLocation = true;
        })
        .catch((err) => console.log(err))
        .finally(() => (this.errorLocationLoading = false));
    },
    showParameterError(err) {
      this.treeNodeData = {
        realPrim: "lambda",
        value_type: "lambda",
        from: err.wrong_expression,
        val: err.expected_form,
        diffType: 'error'
      };
      this.showTreeNodeView = true;
    },
  },
  watch: {
    showErrorLocation: function (newValue) {
      if (!newValue) this.errorLocation = null;
    },
  },
};
</script>