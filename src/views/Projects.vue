<template>
  <div>
    <v-navigation-drawer v-if="!loading" absolute temporary width="350" right v-model="showFilters">
      <div class="pa-4">
        <span class="headline">Filters</span>

        <v-row no-gutters>
          <v-col cols="12">
            <v-subheader>Versions count</v-subheader>
            <v-range-slider
              v-model="filters.versionsCount"
              hide-details
              thumb-label
              class="mx-4"
              min="0"
              :max="maxVersionsCount"
            ></v-range-slider>
          </v-col>
          <v-col cols="12">
            <v-subheader>Last action</v-subheader>
            <v-row no-gutters class="mx-4">
              <v-col cols="5">
                <v-menu
                  v-model="menu.last_action.from"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="filters.last_action.from"
                      label="From"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    min="2018-06-30"
                    :max="maxDate()"
                    v-model="filters.last_action.from"
                    @input="menu.last_action.from = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="5" offset="2">
                <v-menu
                  v-model="menu.last_action.to"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="filters.last_action.to" label="To" readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker
                    min="2018-06-30"
                    :max="maxDate()"
                    v-model="filters.last_action.to"
                    @input="menu.last_action.to = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-subheader>First deploy</v-subheader>
            <v-row no-gutters class="mx-4">
              <v-col cols="5">
                <v-menu
                  v-model="menu.first_deploy.from"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="filters.first_deploy.from"
                      label="From"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    min="2018-06-30"
                    :max="maxDate()"
                    v-model="filters.first_deploy.from"
                    @input="menu.first_deploy.from = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="5" offset="2">
                <v-menu
                  v-model="menu.first_deploy.to"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="filters.first_deploy.to" label="To" readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker
                    min="2018-06-30"
                    :max="maxDate()"
                    v-model="filters.first_deploy.to"
                    @input="menu.first_deploy.to = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-subheader>Tx count</v-subheader>
            <v-range-slider
              v-model="filters.txCount"
              thumb-label
              class="mx-4"
              min="0"
              :max="maxTxCount"
            ></v-range-slider>
          </v-col>
          <v-col cols="12">
            <v-subheader>Languages</v-subheader>
            <v-chip-group
              column
              multiple
              active-class="primary--text"
              class="mx-4"
              v-model="filters.languages"
            >
              <v-chip filter v-for="lang in languages" :key="lang">{{ lang }}</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </div>
    </v-navigation-drawer>
    <v-data-table
      :loading="loading"
      loading-text="Loading... Please wait"
      :headers="headers"
      :items="projects"
      :items-per-page="15"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Projects</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="showFilters = !showFilters" v-if="!loading">
            <v-icon class="mr-1">mdi-filter-variant</v-icon>
            <span>Filters</span>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        <v-list-item-content>
          <v-list-item-title class="overline">{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle
            class="caption grey--text text--darken-2"
          >Contains {{ item.contracts_count }} contracts</v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <template v-slot:item.last_action="{ item }">
        <span>{{ checkDate(item.last_action) | fromNow}}</span>
      </template>
      <template v-slot:item.first_deploy="{ item }">
        <span>{{ checkDate(item.first_deploy) | fromNow}}</span>
      </template>
      <template v-slot:item.last="{ item }">
        <router-link
          :to="{name: 'project', params: {address: item.last.address, network: item.last.network}}"
        >
          <v-list-item-content>
            <v-list-item-title class="hash" style="font-size: 12px;">{{ item.last.address }}</v-list-item-title>
            <v-list-item-subtitle class="overline grey--text text--darken-2">{{ item.last.network }}</v-list-item-subtitle>
            <span
              class="caption grey--text"
            >Deployed {{ checkDate(item.last.deploy_time) | fromNow }}</span>
          </v-list-item-content>
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import dayjs from "dayjs";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

import { getProjects } from "@/api/index.js";

export default {
  name: "Projects",
  computed: {
    maxVersionsCount() {
      let max = 0;
      this.projects.forEach(x => {
        if (x.versions_count > max) max = x.versions_count;
      });
      return max;
    },
    maxTxCount() {
      let max = 0;
      this.projects.forEach(x => {
        if (x.tx_count > max) max = x.tx_count;
      });
      return max;
    },
    languages() {
      let langs = [];
      this.projects.forEach(x => {
        if (!langs.includes(x.language)) langs.push(x.language);
      });
      return langs;
    },
    headers() {
      return [
        { text: "Name", value: "name" },
        {
          text: "Last action",
          value: "last_action",
          filter: this.lastActionFilter
        },
        {
          text: "First deploy",
          value: "first_deploy",
          filter: this.firstDeployFilter
        },
        {
          text: "Versions count",
          value: "versions_count",
          filter: this.versionsFilter,
          width: "150px"
        },
        { text: "Tx count", value: "tx_count", filter: this.txCountFilter },
        { text: "Language", value: "language", filter: this.languageFilter },
        {
          text: "Last contract",
          value: "last",
          width: "300px",
          sortable: false
        }
      ];
    }
  },
  data: () => ({
    projects: [],
    loading: true,
    showFilters: false,
    filters: {
      versionsCount: [0, 10],
      txCount: [0, 10],
      last_action: {
        from: "2018-06-30",
        to: dayjs().format("YYYY-MM-DD")
      },
      first_deploy: {
        from: "2018-06-30",
        to: dayjs().format("YYYY-MM-DD")
      },
      languages: []
    },
    menu: {
      last_action: {
        from: false,
        to: false
      },
      first_deploy: {
        from: false,
        to: false
      }
    }
  }),
  methods: {
    versionsFilter(value) {
      return (
        value <= this.filters.versionsCount[1] &&
        value >= this.filters.versionsCount[0]
      );
    },
    lastActionFilter(value) {
      let cur = dayjs(value);
      let from = dayjs(this.filters.last_action.from);
      let to = dayjs(this.filters.last_action.to);
      return cur.isBetween(from, to, "days") || cur.unix() == 0;
    },
    firstDeployFilter(value) {
      let cur = dayjs(value);
      let from = dayjs(this.filters.first_deploy.from);
      let to = dayjs(this.filters.first_deploy.to);
      return cur.isBetween(from, to, "days") || cur.unix() == 0;
    },
    txCountFilter(value) {
      return (
        value <= this.filters.txCount[1] && value >= this.filters.txCount[0]
      );
    },
    languageFilter(value) {
      for (let i = 0; i < this.filters.languages.length; i++) {
        let x = this.filters.languages[i];
        if (this.languages[x] == value) return true;
      }
      return false;
    },
    maxDate() {
      return dayjs().format("YYYY-MM-DD");
    },
    checkDate(value) {
      let d = dayjs(value);
      if (d.isBefore("2018-06-29")) {
        return undefined;
      }
      return d;
    }
  },
  mounted() {
    getProjects()
      .then(res => {
        this.projects = res;
      })
      .catch(err => console.log(err))
      .finally(() => (this.loading = false));
  },
  watch: {
    languages(newValue) {
      this.filters.languages = Object.keys(
        Array.apply(0, Array(newValue.length))
      ).map(Number);
    },
    maxVersionsCount(newValue) {
      this.filters.versionsCount[1] = newValue;
    },
    maxTxCount(newValue) {
      this.filters.txCount[1] = newValue;
    }
  }
};
</script>

<style scoped>
.v-application a {
  color: black;
}

.v-application a:hover {
  color: #5b942a;
}

a:-webkit-any-link {
  text-decoration: none;
}
</style>