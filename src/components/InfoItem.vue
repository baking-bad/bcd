<template>
  <v-list-item selectable>
    <v-list-item-content>
      <v-list-item-subtitle class="overline">{{ title }}</v-list-item-subtitle>
      <v-list-item-title class="info-item-subtitle hash">
        <span :class="[selected ? 'selected' : '']">{{ subtitle }}</span>
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
    selected: Boolean
  }
};
</script>

<style scoped>
.info-item-subtitle {
  font-size: 13px;
}
.selected {
  color: #e83e8c;
}
</style>