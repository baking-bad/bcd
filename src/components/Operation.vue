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
        <v-col cols="2" class="d-flex align-center">
          <v-list-item v-if="totalLocked">
            <v-list-item-content>
              <v-list-item-title class="overline">+{{ uxtz(totalLocked) }}</v-list-item-title>
              <v-list-item-subtitle class="overline grey--text">locked</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else-if="totalWithdrawn">
            <v-list-item-content>
              <v-list-item-title class="overline">-{{ uxtz(totalWithdrawn) }}</v-list-item-title>
              <v-list-item-subtitle class="overline grey--text">withdrawn</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="overline">{{ uxtz(totalCost) }}</v-list-item-title>
              <v-list-item-subtitle class="overline grey--text">costs</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex flex-horizontal align-center justify-space-between">
          <v-list-item class="d-inline-block text-truncate">
            <v-list-item-content>
              <v-list-item-title class="hash line">
                {{ shortcut(value.hash) }}
              </v-list-item-title>
              <v-list-item-subtitle class="overline">
                <span class="grey--text">counter</span> {{ value.counter }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center">          
          <span class="d-inline-block text-truncate hash line" v-if="invokerHeader">
            <span class="grey--text">by</span> {{ shortcut(invokerHeader) }}
          </span>
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
    },
    totalLocked() {
      return Math.max(0, this.getTotalAmount(1) - this.getTotalAmount(-1));
    },
    totalWithdrawn() {
      return this.getTotalAmount(-1);
    },
    totalCost() {
      let val = this.getBurned(this.value)
      if (!this.value.mempool) {
        for (let i = 0; i < this.value.internal_operations.length; i++) {
          val += this.getBurned(this.value.internal_operations[i]);
        }
      }
      if (!isNaN(this.value.fee)) {
        val += this.value.fee;
      }
      return val;
    },
    invokerHeader() {
      if (this.value.destination === this.address) {
          return this.getInvokerHeader(this.value);
      } else if (!this.value.mempool) {
        for (let i = 0; i < this.value.internal_operations.length; i++) {
          if (this.value.internal_operations[i].destination === this.address) {
            return this.getInvokerHeader(this.value.internal_operations[i]);
          }
        }
      }
      return null;
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
    },
    shortcut(value, size=7) {
      if (value !== undefined && value.length > (size + 1) * 2) {
        return value.substr(0, size) + `\u2026\u202F` + value.substr(value.length - size, size);
      } else {
        return value;
      }
    },
    getOrientedAmount(data, sign) {
      if (this.address !== undefined && !isNaN(data.amount)) { 
        if (data.source === this.address && sign < 0) {
          return data.amount;
        } else if (data.destination === this.address && sign > 0) {
          return data.amount;
        }
      }
      return 0;
    },
    getTotalAmount(sign) {
      if (this.value.status !== "applied") {
        return 0;
      }
      let val = this.getOrientedAmount(this.value, sign);
      if (!this.value.mempool) {
        for (let i = 0; i < this.value.internal_operations.length; i++) {
          val += this.getOrientedAmount(this.value.internal_operations[i], sign);
        }
      }
      return val;
    },
    getBurned(data) {
      let val = 0;
      if (data.result.paid_storage_size_diff)
        val += data.result.paid_storage_size_diff * 1000;

      if (data.result.allocated_destination_contract) 
        val += 257000;

      return val;
    },
    getInvokerHeader(data) {
      if (data.sourceHeader !== undefined) {
        return data.sourceHeader;
      } else if (data.source.startsWith("KT")) {
        return data.source;
      } else {
        return null;
      }
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