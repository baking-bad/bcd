<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <v-row no-gutters>
        <v-col cols="1" style="max-width: 50px;" class="d-flex align-center">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon :color="color" v-on="on">{{ statusIcon }}</v-icon>
            </template>
            {{ value.result.status }}
          </v-tooltip>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="overline">{{ formatDate(value.timestamp) }}</v-list-item-title>
              <v-list-item-subtitle class="overline grey--text">{{ value.mempool ? 'mempool' : value.level  }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col class="d-flex align-center overline" v-html="text"></v-col>
        <v-col cols="5" class="d-flex align-center hash line">{{ value.hash }}</v-col>
        <v-col cols="1" class="d-flex align-center justify-center">
          <v-icon small class="mr-1">mdi-counter</v-icon>
          <span class="overline">{{ value.counter }}</span>
        </v-col>
        <v-col cols="1" class="d-flex align-center justify-end mr-5">
          <span
            class="caption grey--text"
            v-if="value && !value.mempool && value.internal_operations.length"
          >{{ value.internal_operations.length }} internal</span>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <InternalOperation :data="value" :address="address" />

      <InternalOperation
        :data="item"
        :address="address"
        v-for="(item, idx) in value.internal_operations"
        :key="idx"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import InternalOperation from "@/components/InternalOperation.vue";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default {
  name: "Operation",
  props: {
    data: Object,
    address: String
  },
  components: {
    InternalOperation
  },
  created() {
    this.value = Object.assign({}, this.data);
  },
  computed: {
    entryName() {
      if (this.address == this.value.destination) {
        if (
          this.value.parameters != null &&
          this.value.parameters !== undefined
        ) {
          let keys = Object.keys(this.value.parameters);
          if (keys.length == 1) {
            let name = keys[0];
            if (this.value.parameters[name] !== undefined) return name;
          }
          return "__entry__0";
        }
      }
      return null;
    },
    text() {
      if (this.value == null) return "";
      if (this.value.kind === "transaction") {
        if (this.entryName) return `${this.entryName}`;
      }
      return this.value.kind;
    },
    color() {
      if (this.value == null) return "grey";
      if (this.value.result.status === "applied") return "primary";
      if (this.value.result.status === "failed") return "red";
      if (this.value.result.status === "backtracked") return "orange";
      if (this.value.result.status === "skipped") return "blue";
      if (this.value.result.status === "lost") return "red";
      if (this.value.result.status === "branch_refused") return "red";
      if (this.value.result.status === "refused") return "red";
      return "grey";
    },
    statusColor(){
      if (this.value.result.status != 'applied') return '#ffedeb';
      if (this.value.mempool) return 'grey';
      return '';
    },
    statusIcon() {
      if (this.value == null) return "";
      if (this.value.result.status === "applied") return "mdi-check";
      if (this.value.result.status === "failed") return "mdi-close";
      if (this.value.result.status === "lost") return "mdi-eye-off-outline";
      if (this.value.result.status === "branch_refused") return "mdi-cancel";
      if (this.value.result.status === "refused") return "mdi-cancel";
      if (this.value.result.status === "backtracked")
        return "mdi-alert-outline";
      if (this.value.result.status === "skipped")
        return "mdi-crosshairs-question";
      return "";
    }
  },
  data: () => ({
    value: null
  }),
  methods: {
    formatDate(value) {
      let d = dayjs(value);
      if (value) {
        if (d.add(1, "days").isBefore(dayjs())) return d.format("MMM D HH:mm");
        if (d.add(1, "year").isBefore(dayjs()))
          return d.format("MMM D HH:mm, YYYY");
        return d.fromNow();
      }
    },
    uxtz(value) {
      let xtz = (value / 1000000).toLocaleString(undefined, {
        maximumFractionDigits: 6
      });
      return `${xtz} \uA729`;
    }
  }
};
</script>

<style lang="scss" scoped>
.line {
  font-size: 0.85rem;
  font-weight: 400;
}

.v-expansion-panel-header--active {
  background-color: #eaf4de;
}

.v-expansion-panel-header {
  padding: 8px 24px;
}
</style>