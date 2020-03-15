<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="pa-0 pr-4" ripple :class="statusHeaderClass">
      <v-row>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="overline">{{ formatDate(value.timestamp) }}</v-list-item-title>
              <v-list-item-subtitle
                class="overline grey--text"
              >{{ value.mempool ? 'mempool' : value.level }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="overline">{{ text }}</v-list-item-title>
              <v-list-item-subtitle
                class="overline grey--text"
                v-if="value && !value.mempool && value.internal_operations.length"
              >{{ value.internal_operations.length }} internal</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="7" class="d-flex flex-horizontal align-center justify-space-between">
          <span class="hash line d-inline-block text-truncate">{{ value.hash }}</span>
          <div class="mx-3 d-flex flex-horizontal">
            <v-icon small class="mr-1">mdi-counter</v-icon>
            <span class="overline">{{ value.counter }}</span>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="pl-1">
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
      if (this.value.entrypoint && this.value.destination === this.address) {
        return this.value.entrypoint;
      } else {
        for (let i = 0; i < this.value.internal_operations.length; i++) {
          if (
            this.value.internal_operations[i].entrypoint &&
            this.value.internal_operations[i].destination === this.address
          ) {
            return this.value.internal_operations[i].entrypoint;
          }
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
      if (this.value.status === "applied") return "primary";
      if (this.value.status === "failed") return "red";
      if (this.value.status === "backtracked") return "orange";
      if (this.value.status === "skipped") return "blue";
      if (this.value.status === "lost") return "red";
      if (this.value.status === "branch_refused") return "red";
      if (this.value.status === "refused") return "red";
      return "grey";
    },
    statusHeaderClass() {
      if (this.value.status === "backtracked") return "backtracked";
      if (this.value.status !== "applied") return "failed";
      if (this.value.mempool) return "mempool";
      return "applied";
    },
    statusIcon() {
      if (this.value == null) return "";
      if (this.value.status === "applied") return "mdi-check";
      if (this.value.status === "failed") return "mdi-close";
      if (this.value.status === "lost") return "mdi-eye-off-outline";
      if (this.value.status === "branch_refused") return "mdi-cancel";
      if (this.value.status === "refused") return "mdi-cancel";
      if (this.value.status === "backtracked") return "mdi-alert-outline";
      if (this.value.status === "skipped") return "mdi-crosshairs-question";
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
  font-size: 0.8rem !important;
}

.v-expansion-panel-header--active.applied {
  background-color: #eaf4de;
}

.v-expansion-panel-header--active.failed {
  background-color: rgb(255, 238, 238);
}

.v-expansion-panel-header--active.mempool {
  background-color: rgb(231, 231, 231);
}
.v-expansion-panel-header--active.backtracked {
  background-color: rgb(253, 244, 228);
}

.v-expansion-panel-header {
  padding: 8px 24px;
}

.applied {
  border-left: 4px solid #6ac21f;
}

.backtracked {
  border-left: 4px solid orange;
}

.failed {
  border-left: 4px solid red;
}

.mempool {
  border-left: 4px solid grey;
}
</style>