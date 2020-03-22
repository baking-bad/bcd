<template>
  <v-dialog v-if="data" v-model="show" width="800" :fullscreen="data.realPrim === 'lambda' && data.diffType === 'update'">
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="11">
            <v-row no-gutters>
              <v-col cols="auto" class="mr-5">
                <InfoItem title="Key" :subtitle="data.name" />
              </v-col>
              <v-col cols="2">
                <InfoItem title="Primitive" :subtitle="data.prim" />
              </v-col>
              <v-col cols="2" v-if="data.diffType">
                <InfoItem title="Action" :subtitle="data.diffType" />
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1" class="d-flex pt-1 align-start justify-end">
            <v-btn small text @click="show = false">
              <v-icon small>mdi-close</v-icon>&nbsp;<span class="overline">Close</span>
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
import InfoItem from "@/components/InfoItem.vue";

export default {
  name: "TreeNodeDetails",
  components: {
    ValueInspector,
    InfoItem
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