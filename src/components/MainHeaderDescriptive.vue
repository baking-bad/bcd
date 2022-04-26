<template>
  <header class="header-class pl-4 pr-4">
    <div class="d-flex align-center">
      <RouterLink to="/" class="white--text no-decoration">
        <h2>BCD</h2>
      </RouterLink>
      <span class="ml-3 text-small white--text">Tezos Smart Contract Explorer</span>
      <SocialsList class="socials-list ml-3"/>
    </div>
    <div class="searchbox-wrapper">
      <SearchBox v-if="!noSearch" :inplace="true"></SearchBox>
      <ThemeSwitcher />
      <PickRandomButton class="ml-3" />
      <v-btn
        text
        class="ml-2 white--text"
        to="/docs"
        small
      >
        API
      </v-btn>
      <v-btn text small :to="{ name: 'search' }">
        Advanced search
      </v-btn>
      <v-btn text small :to="{ path: `/stats/${config.networks[0]}/general` }">
        Stats
      </v-btn>
      <v-btn text small :to="{ name: 'dapps' }">
        Dapps
      </v-btn>
    </div>
  </header>
</template>

<script>
import SocialsList from "./SocialsList";
import SearchBox from "./SearchBox";
import ThemeSwitcher from "./ThemeSwitcher";
import PickRandomButton from "./PickRandomButton";

export default {
  name: "MainHeaderDescriptive",
  components: {PickRandomButton, ThemeSwitcher, SearchBox, SocialsList},
  props: {
    noSearch: Boolean,
  },
}
</script>

<style lang="scss" scoped>
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
  display: flex;
  align-items: center;
  height: 2.5rem;
  & > * {
    height: 2.5rem;
  }
}
.list-class {
  padding: 0;
  background: transparent;
}
.list-item-group-class {
  display: flex;
  & > a {
    height: 2.5rem !important;
  }
}
</style>