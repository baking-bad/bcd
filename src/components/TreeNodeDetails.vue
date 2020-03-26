<template>
  <v-dialog v-if="data" v-model="show" width="800" :fullscreen="data.realPrim === 'lambda' && data.diffType === 'update'">
    <v-card>
      <v-card-title>
          <v-row no-gutters>
            <v-col cols="11">
              <v-row no-gutters>
                <v-col cols="auto" class="mr-5 my-1 d-flex flex-column justify-center">
                  <span class="overline grey--text text--darken-1">Key</span>
                  <span class="info-item-title grey--text text--darken-3">{{ data.name }}</span>
                </v-col>
                <v-col cols="2" class="my-1 d-flex flex-column justify-center">
                  <span class="overline grey--text text--darken-1">Primitive</span>
                  <span class="info-item-title grey--text text--darken-3">{{ data.prim }}</span>
                </v-col>
                <v-col cols="2" v-if="data.diffType" class="my-1 d-flex flex-column justify-center">
                  <span class="overline grey--text text--darken-1">Action</span>
                  <span class="info-item-title grey--text text--darken-3">{{ data.diffType }}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="1" class="d-flex align-center justify-end">
              <v-btn icon text @click="show = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>        
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters class="mt-5">
          <v-col v-if="data.diffType === 'update'" cols="6" class="pr-5">
            <ValueInspector :prim="data.realPrim" 
                            :value="data.from"
                            :network="network"
                            label="Before">
            </ValueInspector>
          </v-col>
          <v-col :cols="data.diffType === 'update' ? 6 : 12">
            <ValueInspector :prim="data.realPrim" 
                            :value="data.val"
                            :network="network"
                            :label="data.diffType === 'update' ? 'After' : 'Value'">
            </ValueInspector>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ValueInspector from "@/components/ValueInspector.vue"

export default {
  name: "TreeNodeDetails",
  components: {
    ValueInspector
  },
  props: {
    value: Boolean,
    data: Object,
    network: String
  },
  data: () => ({
    show: false
  }),
  computed: {
    isLambdaEdited() {
      return (
        this.data.value_type === "lambda" && this.data.value.includes(" -> ")
      );
    },
    left() {
      if (!this.isLambdaEdited) return null;

      let val = this.data.value.split(" -> ");
      return val[0].replace(/\n/g, "<br/>");
    },
    right() {
      if (!this.isLambdaEdited) return null;

      let val = this.data.value.split(" -> ");
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

<style scoped>
.info-item-title {
  font-family: "Roboto Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.2rem;
}
</style>