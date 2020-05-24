<template>
  <v-dialog v-if="data" v-model="show" width="800" :fullscreen="data.realPrim === 'lambda' && data.diffType === 'update'" scrollable>
    <v-card>
      <v-card-title class="sidebar">
        <v-row no-gutters>
          <v-col cols="11">
            <v-row no-gutters>
              <v-col cols="auto" class="mr-5 my-1 d-flex flex-column justify-center">
                <span class="overline">Key</span>
                <span class="info-item-title text--secondary">{{ data.name }}</span>
              </v-col>
              <v-col cols="2" class="my-1 d-flex flex-column justify-center">
                <span class="overline">Primitive</span>
                <span class="info-item-title text--secondary">{{ data.prim }}</span>
              </v-col>
              <v-col cols="2" v-if="data.realPrim === 'address'" class="my-1 d-flex flex-column justify-center">
                <span class="overline">Network</span>
                <span class="info-item-title text--secondary">{{ network }}</span>
              </v-col>
              <v-col cols="2" v-if="data.diffType" class="my-1 d-flex flex-column justify-center">
                <span class="overline">Action</span>
                <span class="info-item-title text--secondary">{{ data.diffType }}</span>
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
      <v-card-text class="data pa-0">
        <v-row no-gutters>
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
                            :address="address"
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
    network: String,
    address: String
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
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2rem;
}
.v-dialog > .v-card > .v-card__title {
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>