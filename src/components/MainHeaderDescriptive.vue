<template>
  <header class="header-class pl-4 pr-4" :class="headerAdditionalClass">
    <div class="d-flex align-center">
      <RouterLink to="/" class="no-decoration d-flex align-center">
        <h2 class="script-casual primary--text">BCD</h2>
        <span class="ml-3 text-small overline text--secondary">Tezos Contract Explorer</span>
      </RouterLink>
    </div>
    <div>
      <v-btn
        text
        active-class="bg-before-transparent"
        class="ml-2 text--secondary"
        to="/docs"
        small
      >
        API
      </v-btn>
      <v-btn text small :to="{ name: 'search' }" class="text--secondary" active-class="bg-before-transparent">
        Search
      </v-btn>
      <v-btn text small :to="{ path: `/stats/${config.networks[0]}/general` }" class="text--secondary" active-class="bg-before-transparent">
        Stats
      </v-btn>
      <v-btn text small :to="{ name: 'dapps' }" class="text--secondary" active-class="bg-before-transparent">
        Dapps
      </v-btn>
    </div>
    <div class="searchbox-wrapper">
      <SearchBox v-if="!noSearch" :inplace="true"></SearchBox>
      <v-btn text small @click="openFeedback" class="text--secondary" active-class="bg-before-transparent">
        Send Feedback
      </v-btn>
      <SocialsList class="socials-list ml-3"/>
      <ThemeSwitcher />
    </div>
  </header>
</template>

<script>
import SocialsList from "./SocialsList";
import SearchBox from "./SearchBox";
import ThemeSwitcher from "./ThemeSwitcher";

export default {
  name: "MainHeaderDescriptive",
  components: { ThemeSwitcher, SearchBox, SocialsList},
  props: {
    noSearch: Boolean,
  },
  computed: {
    headerAdditionalClass() {
      if (this.$route.path === '/') {
        return 'bg-sidenav-base';
      }
      return 'bg-canvas-base';
    }
  },
  methods: {
    openFeedback() {
      window.open('https://docs.google.com/forms/d/1fnBzOgrZRc6-eV5gWW7zRh0u4PT8oc8q8FinBoehV2g/edit', '_blank');
      if (this.$gtag) {
        this.$gtag.event('Social Click', {
          'event_category': 'Feedback',
          'event_label': this.$router.currentRoute.fullPath
        });
      }
    }
  }
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
}
.searchbox-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  gap: 0.75rem;
  & > * {
    height: 2.5rem;
  }
}
.list-class {
  padding: 0;
  background: transparent;
}
.socials-list {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.list-item-group-class {
  display: flex;
  & > a {
    height: 2.5rem !important;
  }
}
</style>