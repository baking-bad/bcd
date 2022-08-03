<template>
  <v-btn class="btn-class text--secondary" icon @click="toggleTheme">
    <v-icon v-if="$vuetify.theme.dark"
      >mdi-white-balance-sunny</v-icon
    >
    <v-icon v-else>mdi-weather-night</v-icon>
  </v-btn>
</template>

<script>
import { toggleTheme } from "../utils/vuetify";

export default {
  name: "ThemeSwitcher",
  methods: {
    toggleTheme,
  },
};
</script>

<style scoped>
.btn-class {
  width: 2.25rem;
}
</style>