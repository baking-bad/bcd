<template>
  <v-toolbar flat class color="toolbar" height="48">
    <v-tabs
      grow
      center-active
      background-color="transparent"
      slider-color="primary"
    >
      <v-tab :to="pushTo({ name: 'recently_called' })" replace>
        <v-icon left small>mdi-history</v-icon>Recently called
      </v-tab>
      <v-tab :to="pushTo({ name: 'network_constants' })"  replace>
        <v-icon left small>mdi-alphabetical-variant</v-icon>Global constants
      </v-tab>
      <v-tab v-if="hasStats" :to="pushTo({name: 'network_stats'})" replace>
        <v-icon left small>mdi-align-vertical-bottom</v-icon>Statistics
      </v-tab>
    </v-tabs>
  </v-toolbar>
</template>

<script>
export default {
  name: "Toolbar",
  props: {
    network: String
  },
  computed: {
    hasStats() {
      return this.stats.hasApi(this.network);
    }
  },
  methods: {
    pushTo(obj) {
      return Object.assign({
        query: this.$route.query,
      }, obj);
    },
  },
}
</script>

<style scoped>

</style>