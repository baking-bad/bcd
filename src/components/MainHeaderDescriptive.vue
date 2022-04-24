<template>
  <header class="header-class pl-3 pr-6">
    <div class="d-flex align-center">
      <RouterLink to="/" class="white--text no-decoration">
        <h2>BCD</h2>
      </RouterLink>
      <span class="ml-3 text-small white--text">Tezos Smart Contract Explorer</span>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="toggleTheme" class="ml-6">
            <v-icon v-if="$vuetify.theme.dark" color="grey lighten-2">mdi-white-balance-sunny</v-icon>
            <v-icon v-else color="white">mdi-weather-night</v-icon>
          </v-btn>
        </template>
        <span v-if="$vuetify.theme.dark">Disable dark theme</span>
        <span v-else>Enable dark theme</span>
      </v-tooltip>
      <v-btn
        icon
        class="ml-2 white--text"
        to="/docs"
      >
        <v-icon>mdi-api</v-icon>
      </v-btn>
    </div>
    <div v-if="!noSearch" class="searchbox-wrapper">
      <SearchBox :inplace="true"></SearchBox>
    </div>
    <SocialsList class="socials-list"/>
  </header>
</template>

<script>
import SocialsList from "./SocialsList";
import { toggleTheme } from '../utils/vuetify';
import SearchBox from "./SearchBox";

export default {
  name: "MainHeaderDescriptive",
  components: {SearchBox, SocialsList},
  props: {
    noSearch: Boolean,
  },
  methods: {
    toggleTheme,
  }
}
</script>

<style scoped>
.header-class {
  position: fixed;
  height: var(--main-header-weight);
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-index-main-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--v-sidenav-base);
}
.searchbox-wrapper {
  width: 40%;
  height: 2.5rem;
}
</style>