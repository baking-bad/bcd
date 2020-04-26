<template>
  <v-list-item
    :key="item.address"
    :to="{name: 'project', params: {address: this.item.address, network: this.item.network}}"
    class="py-2"
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
      <v-list-item-subtitle class="overline grey--text text-lighten-5">
        <v-btn
          text
          x-small
          @click.prevent.stop="onDiffClick(item)"
          class="grey--text text--darken-2 px-0"
        >
          <span>Show diff</span>
          <span v-if="item.added" class="primary--text ml-1">+{{item.added }}&#9;</span>
          <span v-if="item.removed" class="red--text ml-1">-{{item.removed }}</span>
        </v-btn>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action class="mt-2 mb-9">
      <v-list-item-action-text>{{ item.tx_count || 1 }} operations till</v-list-item-action-text>
      <v-list-item-action-text class="overline">{{ formatDate(item.last_action || item.timestamp) }}</v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "SimilarItem",
  props: {
    item: Object,
    address: String,
    network: String,
    basetime: String
  },
  computed: {
    consumed_gas_diff() {
      return (this.item.consumed_gas_diff * 100).toFixed(0);
    }
  },
  methods: {
    onDiffClick(item) {
      let routeData = this.$router.resolve({
        name: "diff",
        query: {
          addressA: this.address,
          networkA: this.network,
          addressB: item.address,
          networkB: item.network
        }
      });
      window.open(routeData.href, "_blank");
    },
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