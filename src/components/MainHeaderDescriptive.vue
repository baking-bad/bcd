<template>
  <header class="header-class pl-4 pr-4" :class="headerAdditionalClass">
    <div class="d-flex align-center">
      <RouterLink to="/" class="no-decoration d-flex align-center">
        <h2 class="script-casual primary--text">BCD</h2>
        <span class="ml-3 text-small overline text--secondary">Tezos Contract Explorer</span>
      </RouterLink>
    </div>
    <div>
      <v-btn text small :to="{ name: 'search' }" class="text--secondary" active-class="bg-before-transparent">
        Search
      </v-btn>
      <v-btn text small :to="{ path: `/stats/${config.networks[0]}/general` }" class="text--secondary" active-class="bg-before-transparent">
        Stats
      </v-btn>
      <v-btn text small :to="{ name: 'dapps' }" class="text--secondary" active-class="bg-before-transparent">
        Dapps
      </v-btn>
      <v-btn
        text
        active-class="bg-before-transparent"
        class="text--secondary"
        to="/docs"
        small
      >
        API
      </v-btn>
    </div>
    <div class="searchbox-wrapper">
      <SearchBox v-if="!noSearch" :inplace="true"></SearchBox>
      <v-btn text small @click="openFeedback" class="text--secondary" outlined rounded active-class="bg-before-transparent">
        Feedback
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
      let addClass = this.isHome ? 'home-header ' : '';
      if (this.isHome && this.isDarkTheme) {
        addClass += 'bg-sidenav-base ';
      } else addClass += 'bg-canvas-base ';
      addClass += this.isDarkTheme ? 'theme--dark ' : 'theme--light ';
      return addClass;
    },
    isHome() {
      return this.$route.path === '/';
    },
    isDarkTheme() {
      return this.$vuetify.theme.dark;
    }
  },
  methods: {
    openFeedback() {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSdTkewJ9UJHZByjpFndubp6kwEOENRBtvGIg9FisIdUJHB1mA/viewform', '_blank');
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
  &:not(.home-header) {
    border-bottom-width: thin;
    border-bottom-style: solid;
    &.theme--dark {
      border-bottom-color: rgba(255,255,255,0.12);
    }
    &.theme--light {
      border-bottom-color: rgba(0,0,0,0.12);
    }
  }
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