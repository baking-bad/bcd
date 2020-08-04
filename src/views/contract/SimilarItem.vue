<template>
  <v-list-item :to="`/${item.network}/${item.address}`" class="pr-2">
    <v-list-item-content>
      <v-list-item-title class="body-2">
        <span v-if="item.alias">{{ item.alias }}</span>
        <span v-else v-html="helpers.shortcut(item.address)"></span>
        <span v-if="diff && item.added" class="hash success--text ml-2">+{{ item.added }}</span>
        <span v-if="diff && item.removed" class="hash error--text ml-2">-{{ item.removed }}</span>
      </v-list-item-title>
      <v-list-item-subtitle>
        <span
          class="overline"
          :class="item.network === 'mainnet' ? 'secondary--text' : ''"
        >{{ item.network }}</span>
        <span class="overline text--primary">, <span v-if="item.tx_count > 1">{{ item.tx_count - 1 }} txs | </span>{{ helpers.formatDate(item.last_action) }}</span>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-icon v-if="diff">
      <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" small icon @click.prevent.stop="onDiffClick(item)">
              <v-icon>mdi-directions-fork</v-icon>
            </v-btn>
          </template>
          <span>Side-by-side diff</span>
        </v-tooltip>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  name: "SimilarItem",
  props: {
    item: Object,
    address: String,
    network: String,
    diff: Boolean
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
    }
  }
};
</script>