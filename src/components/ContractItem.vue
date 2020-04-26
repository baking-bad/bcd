<template>
  <v-list-item
    :key="item.address"
    :to="{name: 'project',params: { address: this.item.address, network: this.item.network }}"
  >
    <v-list-item-content>
      <v-list-item-title class="contract-item-address hash">
        <span>{{ item.alias || item.address }}</span>
      </v-list-item-title>
      <v-list-item-subtitle>
        <span
          class="overline"
          :class="item.network === 'mainnet' ? 'primary--text' : ''"
        >{{ item.network }}&nbsp;</span>
        <span
          v-if="item.timestamp > basetime"
          class="light-green--text text--darken-2 caption"
        >newer</span>
        <span v-else-if="item.timestamp < basetime" class="grey--text caption">older</span>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action class="mt-2 mb-3">
      <v-list-item-action-text class>
        <span class="caption">{{ item.tx_count || 1 }}</span> operations till
      </v-list-item-action-text>
      <v-list-item-action-text class="overline">{{ formatDate(item.last_action || item.timestamp) }}</v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: {
    item: Object,
    basetime: String
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

<style lang="scss" scoped>
.contract-item-address {
  font-size: 12px;
}
</style>