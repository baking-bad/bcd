<template>
  <v-tooltip right>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small icon @click="toggleTheme" class="ml-6">
        <v-icon v-if="$vuetify.theme.dark" color="grey lighten-2">mdi-white-balance-sunny</v-icon>
        <v-icon v-else color="white">mdi-weather-night</v-icon>
      </v-btn>
    </template>
    <span v-if="$vuetify.theme.dark">Disable dark theme</span>
    <span v-else>Enable dark theme</span>
  </v-tooltip>
</template>

<script>
import {toggleTheme} from "../utils/vuetify";

export default {
  name: "ThemeSwitcher",
  methods: {
    toggleTheme,
  }
}
</script>