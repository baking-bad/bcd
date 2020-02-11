<template>
  <v-card tile>
    <v-list-item class="operation-header secondary">
      <v-list-item-subtitle>
        <v-row class="hash">
          <v-col cols="2" class="text d-flex align-center">
            <v-icon small class="mr-1">mdi-cube</v-icon>
            {{ formatDate(data.timestamp) }}
          </v-col>
          <v-col cols="8">
            <span class="text">{{ data.hash }}</span>
          </v-col>
          <v-col cols="2" class="text d-flex align-center justify-end">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-icon small>mdi-alpha-l-box-outline</v-icon>
                  {{ data.level }}
                </div>
              </template>
              <span>Level</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-list-item-subtitle>
    </v-list-item>
    <v-divider></v-divider>

    <v-card-text class="operation-body">
      <InternalOperation :data="data" :address="address" />

      <InternalOperation
        :data="item"
        :address="address"
        v-for="(item, idx) in data.internal_operations"
        :key="idx"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import InternalOperation from "@/components/InternalOperation.vue";

import dayjs from "dayjs";

export default {
  name: "Operation",
  props: {
    data: Object,
    address: String
  },
  components: {
    InternalOperation
  },
  methods: {
    formatDate(value) {
      if (value) {
        return dayjs(value).format("HH:mm MMM D, YYYY");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.operation-header {
  .text {
    font-size: 12px;
  }
}
</style>