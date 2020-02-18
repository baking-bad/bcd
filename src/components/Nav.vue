<template>
  <v-navigation-drawer app fixed mini-variant permanent class="elevation-1">
    <router-link
      :to="{name: 'home'}"
      class="d-flex justify-center align-center"
      style="height: 63px"
    >
      <v-avatar color="primary" size="38">
        <span class="white--text">BCD</span>
      </v-avatar>
    </router-link>

    <v-list nav>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-list-item link :to="{name: 'search'}" v-on="on">
            <v-list-item-icon>
              <v-icon color="grey">mdi-layers-search-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Search</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>Advanced search</span>
      </v-tooltip>

      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-list-item link :to="{name: 'projects'}" v-on="on">
            <v-list-item-icon>
              <v-icon color="grey">mdi-rhombus-split</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Projects</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>Projects</span>
      </v-tooltip>
    </v-list>
    <v-divider></v-divider>

    <router-link
      :to="{name: 'home'}"
      class="d-flex justify-center align-center"
      style="height: 63px"
    >
      <v-avatar color="secondary" size="38">
        <span class="grey--text">UN</span>
      </v-avatar>
    </router-link>

    <v-list nav>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-list-item link :to="{name: 'search'}" v-on="on">
            <v-list-item-icon>
              <v-icon color="grey">mdi-file-document-box-multiple-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Contracts</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>Contracts</span>
      </v-tooltip>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-list-item link :to="{name: 'search'}" v-on="on">
            <v-list-item-icon>
              <v-icon color="grey">mdi-poll</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Statistics</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>Statistics</span>
      </v-tooltip>
    </v-list>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>