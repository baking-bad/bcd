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
      <v-list-item-subtitle
        class="caption grey--text text-lighten-5"
        v-if="item.count > 1"
      >{{item.count - 1}} same contracts</v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-chip
        x-small
        label
        v-text="item.network"
        color="secondary"
        class="grey--text text--darken-3"
      ></v-chip>
      <v-list-item-action-text>{{ item.timestamp | fromNow }}</v-list-item-action-text>
      <v-list-item-action-text>
        <span v-if="item.added" class="primary--text">+&nbsp;{{item.added }}&#9;</span>
        <span v-if="item.removed" class="red--text">-&nbsp;{{item.removed }}</span>
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