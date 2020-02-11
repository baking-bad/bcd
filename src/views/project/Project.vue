<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="contracts != null">
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

      <v-navigation-drawer app fixed right width="400" class="elevation-1" v-if="contract">
        <v-list class="py-1">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="hash">{{ contract.address }}</v-list-item-title>
              <v-list-item-subtitle class="overline">Deployed {{ formatDate(contract.timestamp) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <InfoItem title="Deployed by" :subtitle="contract.manager" v-if="contract.manager" />
          <InfoItem title="Delegated to" :subtitle="contract.delegate" v-if="contract.delegate" />
        </v-list>

        <div class="px-4 pb-4">
          <v-chip
            color="secondary"
            text-color="grey darken-1"
            class="mr-1 caption"
            small
            label
            pill
          >{{ contract.network }}</v-chip>
          <v-chip
            color="secondary"
            text-color="grey darken-1"
            class="mr-1 caption"
            small
            label
            pill
          >{{ contract.language }}</v-chip>
          <template v-for="tag in tags">
            <v-chip
              :key="tag"
              color="secondary"
              text-color="grey darken-1"
              class="mr-1 caption"
              small
              label
              pill
            >{{ tag.replace('_', ' ') }}</v-chip>
          </template>
        </div>

        <v-tabs grow background-color="transparent" slider-color="primary" v-model="projectTab">
          <v-tab class="overline">
            <v-icon left small>mdi-content-copy</v-icon>The same
          </v-tab>
          <v-tab class="overline">
            <v-icon left small>mdi-approximately-equal</v-icon>Similar
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="projectTab">
          <v-tab-item>
            <v-list two-line class="pa-0" v-if="contracts.same && contracts.same.length > 0">
              <v-list-item-group active-class="light-green--text text--darken-2">
                <template v-for="(item) in contracts.same">
                  <ContractItem
                    class="py-2"
                    :item="item"
                    :key="item.address"
                    :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
                  />
                </template>
              </v-list-item-group>
            </v-list>
            <div v-else class="d-flex flex-column align-center justify-center mt-10">
              <v-icon size="75">mdi-blur</v-icon>
              <span class="overline mt-3">No the same contracts</span>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-list two-line class="pa-0" v-if="contracts.similar && contracts.similar.length > 0">
              <v-list-item-group active-class="light-green--text text--darken-2">
                <template v-for="(item) in contracts.similar">
                  <ContractItem
                    class="py-2"
                    :item="item"
                    :key="item.address"
                    :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
                  />
                </template>
              </v-list-item-group>
            </v-list>
            <div v-else class="d-flex flex-column align-center justify-center mt-10">
              <v-icon size="75">mdi-blur</v-icon>
              <span class="overline mt-3">No similar contracts</span>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-navigation-drawer>

      <v-container class="py-0 my-0">
        <v-row no-gutters>
          <v-col cols="7" style="height: 64px;" class="d-flex align-end">
            <v-tabs background-color="transparent" slider-color="primary" v-if="contract">
              <v-tab :to="{name: 'operations'}" replace class="overline">
                <v-icon left small>mdi-swap-horizontal</v-icon>Operations
              </v-tab>
              <v-tab :to="{name: 'code'}" replace class="overline">
                <v-icon left small>mdi-code-braces</v-icon>Code
              </v-tab>
              <v-tab :to="{name: 'entrypoints'}" replace v-if="hasEntrypoints" class="overline">
                <v-icon left small>mdi-doorbell</v-icon>Entrypoints
              </v-tab>
              <v-tab :to="{name: 'storage'}" replace class="overline">
                <v-icon small left>mdi-alphabetical</v-icon>Storage
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="5" class="d-flex align-end">
            <ExpandableSearch></ExpandableSearch>
            <v-btn icon style="margin-bottom: 2px;" class="mx-1">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon style="margin-bottom: 2px;">
              <v-icon>mdi-eye-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-slide-x-reverse-transition mode="out-in">
              <router-view :contract="contract" />
            </v-slide-x-reverse-transition>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/index.js";
import ContractItem from "@/components/ContractItem.vue";
import InfoItem from "@/components/InfoItem.vue";
import ExpandableSearch from "@/components/ExpandableSearch.vue";

import dayjs from "dayjs";

export default {
  name: "Project",
  components: {
    ContractItem,
    InfoItem,
    ExpandableSearch
  },
  computed: {
    hasEntrypoints() {
      return (
        this.contract != null &&
        this.contract !== undefined &&
        this.contract.entrypoints !== undefined &&
        this.contract.entrypoints.length > 0
      );
    },
    tags() {
      if (
        this.contract != null &&
        this.contract !== undefined &&
        this.contract.tags !== undefined &&
        this.contract.tags.length > 0
      )
        return [];
      return this.contract.tags;
    }
  },
  data: () => ({
    contracts: null,
    loading: true,
    projectTab: 0,
    contract: null
  }),
  created() {
    this.requestData(this.$route.params.network, this.$route.params.address);
  },
  methods: {
    requestData(network, address) {
      this.loading = true;
      api
        .getContract(network, address)
        .then(res => {
          this.contract = res;
          return api.getProject(address);
        })
        .then(res => {
          this.contracts = res;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.loading = false;
        });
    },
    formatDate(value) {
      if (value) {
        return dayjs(value).format("MMM D, YYYY");
      }
    }
  },
  watch: {
    "$route.params.address": function(address) {
      this.requestData(this.$route.params.network, address);
    }
  }
};
</script>

