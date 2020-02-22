<template>
  <v-list-item selectable :to="to" :href="href" :target="target">
    <v-list-item-content>
      <v-list-item-subtitle class="overline">{{ title }}</v-list-item-subtitle>
      <v-list-item-title class="info-item-subtitle hash grey--text text--darken-3">
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
      if (this.href != '') return '_blank';
      return '';
    }
  }
};
</script>

<style scoped>
.info-item-subtitle {
  font-size: 12px;
  line-height: 1.4;
}
.selected {
  color: #e83e8c;
}
.v-application a {
  color: transparent;
}

</style>