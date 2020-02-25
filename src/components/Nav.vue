<template>
  <v-navigation-drawer app fixed mini-variant permanent class="elevation-1">
    <router-link
      :to="{name: 'home'}"
      class="d-flex justify-center align-center"
      style="height: 63px"
    >
      <v-avatar color="primary" size="38"  class="elevation-2">
        <span class="white--text">BCD</span>
      </v-avatar>
    </router-link>

    <v-list nav>
      <v-list-item-group>
        <template v-for="(item, idx) in publicItems">
          <v-tooltip :key="idx" right>
            <template v-slot:activator="{ on }">
              <v-list-item :to="{name: item.to}" v-on="on" active-class="primary--text">
                <template v-slot:default="{ active }">
                  <v-list-item-icon>
                    <v-icon v-if="active" color="primary">{{ item.icon }}</v-icon>
                    <v-icon v-else color="grey">{{ item.icon }}</v-icon>
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
      <v-divider v-if="isAuthorized"></v-divider>

      <router-link
        :to="{name: 'dashboard'}"
        class="d-flex justify-center align-center"
        style="height: 63px"
        v-if="isAuthorized && profile != null"
      >
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-avatar size="38" v-on="on" class="elevation-2">
              <img :src="profile.avatarURL" :alt="profile.login" />
            </v-avatar>
          </template>
          {{ profile.login }}
        </v-tooltip>
      </router-link>
      <v-list-item-group v-if="isAuthorized && profile != null">
        <template v-for="(item, idx) in privateItems">
          <v-tooltip :key="idx" right>
            <template v-slot:activator="{ on }">
              <v-list-item :to="{name: item.to}" v-on="on" active-class="primary--text">
                <template v-slot:default="{ active }">
                  <v-list-item-icon>
                    <v-icon v-if="active" color="primary">{{ item.icon }}</v-icon>
                    <v-icon v-else color="grey">{{ item.icon }}</v-icon>
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

    <template v-slot:append>
      <div class="d-flex align-center justify-center pa-5" v-if="isAuthorized">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text icon @click="clickLogout">
              <v-icon>mdi-logout</v-icon>
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
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    }
  },
  data: () => ({
    publicItems: [
      {
        icon: "mdi-layers-search-outline",
        text: "Advanced search",
        to: "search"
      },
      {
        icon: "mdi-rhombus-split",
        text: "Projects",
        to: "projects"
      }
    ],
    privateItems: [
      {
        icon: "mdi-content-duplicate",
        text: "Subscriptions",
        to: "subscriptions"
      },
      {
        icon: "mdi-poll",
        text: "Statistics",
        to: "projects"
      }
    ]
  }),
  methods: {
    ...mapActions({
      userLogout: "logout"
    }),
    clickLogout() {
      this.userLogout();
      logout();
    }
  }
};
</script>