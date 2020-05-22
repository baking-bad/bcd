<template>
  <v-navigation-drawer :app="app" dark mini-variant permanent floating color="sidenav">
    <router-link
      :to="{name: 'dashboard'}"
      class="d-flex justify-center align-center mt-1"
      style="height: 63px"
      v-if="isAuthorized && profile != null"
    >
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-avatar size="38" v-on="on" class="elevation-2">
            <img :src="profile.avatarURL" :alt="profile.login" />
          </v-avatar>
        </template>
        Dashboard
      </v-tooltip>
    </router-link>
    <router-link
      v-else
      :to="{name: config.HOME_PAGE}"
      class="d-flex justify-center align-center mt-1"
      style="height: 63px"
    >
      <v-avatar color="primary" size="38" class="elevation-1">
        <span class="sidenav--text" style="font-family: 'Roboto Condensed;'">BCD</span>
      </v-avatar>
    </router-link>

    <v-list nav>
      <v-list-item-group>
        <template v-for="(item, idx) in items">
          <v-tooltip v-if="!item.private || (isAuthorized && profile != null)" :key="idx" right>
            <template v-slot:activator="{ on }">
              <v-list-item :to="{name: item.to}" v-on="on" active-class="primary--text">
                <template v-slot:default="{ active }">
                  <v-list-item-icon>
                    <v-icon v-if="active" color="primary">{{ item.icon }}</v-icon>
                    <v-icon v-else color="grey lighten-2">{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>

        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item @click="random" v-on="on" active-class="white--text">
              <v-list-item-icon>
                <v-icon color="grey lighten-2">mdi-dice-3-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Pick random</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Pick random</span>
        </v-tooltip>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="d-flex flex-column align-center justify-center pa-5">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text icon :href="`${config.API_URI}docs/index.html`" target="_blank">
              <v-icon color="grey lighten-2">mdi-api</v-icon>
            </v-btn>
          </template>
          API reference
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text icon @click="toggleTheme" class="mt-6">
              <v-icon v-if="$vuetify.theme.dark" color="grey lighten-2">mdi-white-balance-sunny</v-icon>
              <v-icon v-else color="frey lighten-2">mdi-weather-night</v-icon>
            </v-btn>
          </template>
          <span v-if="$vuetify.theme.dark">Disable dark theme</span>
          <span v-else>Enable dark theme</span>
        </v-tooltip>
        <v-tooltip right v-if="isAuthorized">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text icon @click="clickLogout" class="mt-6">
              <v-icon color="grey lighten-2">mdi-logout</v-icon>
            </v-btn>
          </template>
          Logout
        </v-tooltip>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from "vuex";
import { logout } from "@/utils/auth.js";

export default {
  name: "SideNavigation",
  props: {
    app: Boolean
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    }
  },
  data: () => ({
    items: [
      // {
      //   icon: "mdi-home",
      //   text: "Home page",
      //   to: "home",
      //   private: true
      // },
      {
        icon: "mdi-cloud-search-outline",
        text: "Advanced search",
        to: "search"
      },
      // {
      //   icon: "mdi-view-dashboard-outline",
      //   text: "Projects",
      //   to: "projects"
      // },
      {
        icon: "mdi-poll",
        text: "Statistics",
        to: "stats"
      }
    ]
  }),
  methods: {
    ...mapActions({
      userLogout: "logout",
      showError: "showError"
    }),
    clickLogout() {
      this.userLogout();
      logout();
    },
    random() {
      this.api
        .getRandomContract()
        .then(res => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch(err => {
          if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('dark', this.$vuetify.theme.dark);
    }
  }
};
</script>
