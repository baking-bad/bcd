<template>
  <v-list-item :class="gutters ? '' : 'pa-0 ma-0'" selectable>
    <v-list-item-content>
      <v-list-item-subtitle class="overline">{{ title }}</v-list-item-subtitle>
      <v-list-item-title class="info-item-title text--lighten-4">
        <span>{{ subtitle }}</span>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "InfoItem",
  props: {
    title: String,
    subtitle: String,
    gutters: Boolean
  }
};
</script>

<style scoped>
.info-item-title {
  font-family: "Roboto Mono", monospace;
  font-size: 0.8rem;
}
.v-application a {
  color: transparent;
}
</style>