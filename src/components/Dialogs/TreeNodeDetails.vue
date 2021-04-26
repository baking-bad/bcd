<template>
  <v-dialog
    v-if="data"
    v-model="show"
    width="800"
    :fullscreen="fullscreen"
    scrollable
     :retain-focus="false"
  >
    <v-card>
      <v-card-title
          class="py-3 px-6 align-center d-flex"
          :class="isErrorInfo ? 'error-background' : 'sidebar'"
      >
        <span
            class="body-1 font-weight-medium text-uppercase mr-2"
            :class="isErrorInfo ? 'black--text' : 'text--secondary'"
        >
          Inspect:
        </span>
        <span
            class="body-1"
            :class="isErrorInfo ? 'black--text' : ''"
        >{{ data.name }}</span>
        <v-spacer></v-spacer>
        <template v-if="data.diffType === 'create'">
          <v-icon color="success" small>mdi-database-plus</v-icon>
          <span class="success--text ml-2 caption font-weight-medium text-uppercase">insert</span>
        </template>
        <template v-else-if="data.diffType === 'update'">
          <v-icon color="warning" small>mdi-database-edit</v-icon>
          <span class="warning--text ml-2 caption font-weight-medium text-uppercase">replace</span>
        </template>
        <template v-else-if="data.diffType === 'delete'">
          <v-icon color="error" small>mdi-database-remove</v-icon>
          <span class="error--text ml-2 caption font-weight-medium text-uppercase">remove</span>
        </template>
        <v-btn class="ml-6" text @click="show = false">
          <v-icon :color="isErrorInfo ? 'black' : 'white'">mdi-close</v-icon>
          <span
              :class="isErrorInfo ? 'black--text' : 'text--secondary'"
          >
            Close
          </span>
        </v-btn>
      </v-card-title>
      <v-card-text class="data" :class="data.realPrim === 'lambda' ? 'pa-0' : 'pt-7'">
        <v-row no-gutters>
          <v-col v-if="isTwoSide" cols="6" class="pr-5">
            <ValueInspector
              :prim="data.realPrim"
              :value="data.from"
              :network="network"
              :label="data.realPrim"
            ></ValueInspector>
          </v-col>
          <v-col :cols="isTwoSide ? 6 : 12">
            <ValueInspector
              :prim="data.realPrim"
              :value="data.val"
              :network="network"
              :label="data.realPrim"
            ></ValueInspector>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ValueInspector from "@/components/ValueInspector.vue";
import { delimiter } from "@/utils/diff.js";

export default {
  name: "TreeNodeDetails",
  components: {
    ValueInspector
  },
  props: {
    value: Boolean,
    data: Object,
    network: String,
    isErrorInfo: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    show: false
  }),
  computed: {
    isTwoSide() {
      return this.data.diffType === 'update' || this.data.diffType === 'error';
    },
    fullscreen() {
      return this.data.realPrim === 'lambda' && this.data.diffType === 'update';
    },
    isLambdaEdited() {
      return (
        this.data.value_type === "lambda" && this.data.value.includes(delimiter)
      );
    },
    left() {
      if (!this.isLambdaEdited) return null;

      let val = this.data.value.split(` ${delimiter} `);
      return val[0].replace(/\n/g, "<br/>");
    },
    right() {
      if (!this.isLambdaEdited) return null;

      let val = this.data.value.split(` ${delimiter} `);
      return val[1].replace(/\n/g, "<br/>");
    }
  },
  methods: {
    close() {
      this.$emit("input", false);
    }
  },
  watch: {
    show(newVal) {
      if (!newVal) this.$emit("input", newVal);
    },
    value(newVal) {
      if (newVal) this.show = newVal;
    }
  }
};
</script>
