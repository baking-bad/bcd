<template>
  <v-list-item :key="item.address" :to="to">
    <v-list-item-content>
      <v-list-item-title class="contract-item-address hash" v-text="item.address"></v-list-item-title>
      <v-list-item-subtitle 
        v-text="item.network" 
        class="overline"
        :class="item.network === 'mainnet' ? 'primary--text' : ''">
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action class="mt-2 mb-4">
      <v-list-item-action-text class=""><span class="caption">{{ 1 + (item.tx_count || 0) }}</span> operations till</v-list-item-action-text>
      <v-list-item-action-text class="overline"> {{ formatDate(item.last_action || item.timestamp) }}</v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: {
    item: Object,
    to: Object
  },
  name: "ContractItem",
  methods: {
    formatDate(value) {
      if (value) {
        let val = dayjs(value);
        if (val.unix() > 0) return val.format("MMM D, YYYY");
      }
    }
  }
};
</script>


<style>
.contract-item-address {
  font-size: 12px;
}
</style>