<template>
  <v-list-item :key="item.address" :to="to">
    <v-list-item-content>
      <v-list-item-title class="contract-item-address hash" v-text="item.address"></v-list-item-title>
      <v-list-item-subtitle v-text="item.language" class="overline"></v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-chip
        x-small
        label
        v-text="item.network"
        color="secondary"
        class="grey--text"
        :class="item.network === 'mainnet' ? 'text--darken-4' : 'text--darken-1'"
      ></v-chip>
      <v-list-item-action-text>{{ item.timestamp | fromNow }}</v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: {
    item: Object,
    to: Object
  },
  name: "ContractItem"
};
</script>


<style>
.contract-item-address {
  font-size: 12px;
}
</style>