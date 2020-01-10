<template>
  <v-list-item selectable>
    <v-list-item-content>
      <v-list-item-subtitle class="overline">{{ title }}</v-list-item-subtitle>
      <v-list-item-title class="info-item-subtitle">{{ subtitle }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "InfoItem",
  props: {
    title: String,
    subtitle: String
  }
};
</script>

<style>
.info-item-subtitle{
    font-size: 15px;
}
</style>