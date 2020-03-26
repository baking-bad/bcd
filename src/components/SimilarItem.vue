<template>
  <v-list-item
    :key="item.address"
    :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
    class="py-2"
  >

    <v-list-item-content>
      <v-list-item-title class="contract-item-address hash" v-text="item.address"></v-list-item-title>
      <v-list-item-subtitle 
        class="overline" 
        :class="item.network === 'mainnet' ? 'primary--text' : ''">{{item.network}}</v-list-item-subtitle>
      <v-list-item-subtitle class="overline grey--text text-lighten-5">
        <v-btn text x-small @click.prevent.stop="onDiffClick(item)" class="grey--text text--darken-2">
          <span>Show diff</span>
          <span v-if="item.added" class="primary--text ml-1">+{{item.added }}&#9;</span>
          <span v-if="item.removed" class="red--text ml-1">-{{item.removed }}</span>  
        </v-btn>      
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-list-item-action-text class=""><span class="caption">{{ 1 + (item.tx_count || 0) }}</span> operations</v-list-item-action-text>
      <v-list-item-action-text class="overline"> {{ formatDate(item.last_action || item.timestamp) }}</v-list-item-action-text>
      <v-list-item-action-text v-if="item.tx_count">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="overline">
              <v-icon x-small :color="consumed_gas_diff > 0 ? 'red' : 'green'">mdi-fire</v-icon>
              <span :class="consumed_gas_diff <= 0 ? 'primary--text' : 'red--text'">
                <span v-if="consumed_gas_diff > 0">+</span>{{ consumed_gas_diff }}%
              </span>
            </div>
          </template>
          <span>Median consumed gas change</span>
        </v-tooltip>
      </v-list-item-action-text>
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
    network: String
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
        params: {
          address: this.address,
          network: this.network,
          address2: item.address,
          network2: item.network
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