<template>
  <v-list-item class="pa-0 ma-0" selectable :to="to" :href="href" :target="target">
    <v-list-item-content>
      <v-list-item-subtitle class="info-item-font overline">{{ title }}</v-list-item-subtitle>
      <v-list-item-title class="hash info-item-font  grey--text text--darken-3">
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
    selected: Boolean,
    to: Object,
    href: String
  },
  computed: {
    target() {
      if (this.href != "") return "_blank";
      return "";
    }
  }
};
</script>

<style scoped>
.info-item-font {
  font-size: 75% !important;
  line-height: 1.6;
}

.selected {
  color: #e83e8c;
}
.v-application a {
  color: transparent;
}
</style>