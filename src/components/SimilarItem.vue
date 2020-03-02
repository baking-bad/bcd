<template>
  <v-list-item
    :three-line="item.count > 1"
    :two-line="item.count <= 1"
    :key="item.address"
    :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
    class="py-2"
  >
    <v-list-item-avatar size="25">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text icon @click.prevent="onDiffClick(item)">
            <v-icon small>mdi-vector-difference</v-icon>
          </v-btn>
        </template>
        <span>Show diff</span>
      </v-tooltip>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="contract-item-address hash" v-text="item.address"></v-list-item-title>
      <v-list-item-subtitle class="overline">{{item.language}}</v-list-item-subtitle>
      <v-list-item-subtitle class="caption grey--text text-lighten-5">
        <span v-if="item.count > 1">
          {{item.count - 1}} same contracts
          <br />
        </span>

        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-icon x-small :color="consumed_gas_diff > 0 ? 'red' : 'green'">mdi-fire</v-icon>
              <span
                :class="consumed_gas_diff <= 0 ? 'primary--text' : 'red--text'"
                style="line-height:12px; font-size: 10px;"
              >
                <span v-if="consumed_gas_diff > 0">+</span>{{ consumed_gas_diff }}%
              </span>
            </div>
          </template>
          <span>Median consumed gas change</span>
        </v-tooltip>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-chip
        x-small
        label
        v-text="item.network"
        color="secondary"
        class="grey--text text--darken-3"
      ></v-chip>
      <v-list-item-action-text class="mb-1">{{ item.timestamp | fromNow }}</v-list-item-action-text>
      <v-list-item-action-text>
        <span v-if="item.added" class="primary--text">+{{item.added }}&#9;</span>
        <span v-if="item.removed" class="red--text">-{{item.removed }}</span>
      </v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
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
    }
  }
};
</script>