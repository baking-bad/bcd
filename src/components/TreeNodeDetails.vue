<template>
  <v-dialog v-if="data" v-model="show" width="800" :fullscreen="isLambdaEdited">
    <v-card>
      <v-card-title class="headline secondary" primary-title>
        <span>{{ data.name }}</span>
        <v-spacer></v-spacer>
        <v-btn icon text @click="show = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <div
          style="white-space: pre-wrap"
          v-html="String(data.value).replace(/\n/g, '<br/>')"
          v-if="!isLambdaEdited"
        ></div>
        <v-row v-else no-gutters>
          <v-col class="elevation-1">
            <v-subheader class="teal lighten-5 subtitle-1">Before</v-subheader>
            <v-divider></v-divider>
            <div style="white-space: pre-wrap" class="ma-3" v-html="left"></div>
          </v-col>
          <v-col class="elevation-1">
            <v-subheader class="teal lighten-5 subtitle-1">After</v-subheader>
            <v-divider></v-divider>
            <div style="white-space: pre-wrap" class="ma-3" v-html="right"></div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TreeNodeDetails",
  props: {
    value: Boolean,
    data: Object
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
      if (!newVal) {
        this.$emit("input", false);
      }
    },
    value(newVal) {
      if (newVal) {
        this.show = true;
      }
    }
  }
};
</script>