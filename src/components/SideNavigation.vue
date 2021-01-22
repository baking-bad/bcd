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
            <img :src="profile.avatar_url" :alt="profile.login" />
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
              <v-list-item :to="item.to" v-on="on" active-class="primary--text">
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
      </v-list-item-group>
    </v-list>

    <div class="d-flex flex-column align-center justify-center">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="random" :loading="pickingRandom" class="mt-3">
            <v-icon color="grey lighten-2">mdi-dice-3-outline</v-icon>
          </v-btn>
        </template>
        <span>Pick random</span>
      </v-tooltip>

      <v-tooltip v-if="config.JUPYTER_PATH" right>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon :href="config.JUPYTER_PATH" target="_blank" class="mt-6">
            <v-icon color="grey lighten-2">mdi-language-python</v-icon>
          </v-btn>
        </template>
        <span>Jupyter notebooks</span>
      </v-tooltip>
    </div>

    <template v-slot:append>
      <div class="d-flex flex-column align-center justify-center pa-5">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon to="/docs">
              <v-icon color="grey lighten-2">mdi-api</v-icon>
            </v-btn>
          </template>
          API reference
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="toggleTheme" class="mt-6">
              <v-icon v-if="$vuetify.theme.dark" color="grey lighten-2">mdi-white-balance-sunny</v-icon>
              <v-icon v-else color="frey lighten-2">mdi-weather-night</v-icon>
            </v-btn>
          </template>
          <span v-if="$vuetify.theme.dark">Disable dark theme</span>
          <span v-else>Enable dark theme</span>
        </v-tooltip>
        <v-tooltip right v-if="isAuthorized && !config.SANDBOX_MODE">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="clickLogout" class="mt-6">
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
    app: Boolean,
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    },
    apiDocsUrl() {
      return `${window.location.origin}/docs`;
    },
  },
  data: () => ({
    items: [
      {
        icon: "mdi-cloud-search-outline",
        text: "Advanced search",
        to: { name: "search" },
      },
      {
        icon: "mdi-poll",
        text: "Statistics",
        to: {
          path: "/stats/mainnet/general",
        },
      },
      {
        icon: "mdi-apps",
        text: "DApps",
        to: {
          path: "/dapps",
        },
      },
    ],
    pickingRandom: false,
  }),
  methods: {
    ...mapActions({
      userLogout: "logout",
      showError: "showError",
    }),
    clickLogout() {
      this.userLogout();
      logout();
      this.$router.push({ path: "/" });
    },
    random() {
      if (this.pickingRandom) return;
      this.pickingRandom = true;
      this.api
        .getRandomContract()
        .then((res) => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch((err) => {
          if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        })
        .finally(() => {
          this.pickingRandom = false;
        });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark", this.$vuetify.theme.dark);
    },
  },
};
</script>
