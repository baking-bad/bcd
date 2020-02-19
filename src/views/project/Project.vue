<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="contracts != null">
      <v-navigation-drawer app fixed right width="400" class="elevation-1" v-if="contract">
        <v-list class="py-1">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="hash">{{ contract.address }}</v-list-item-title>
              <v-list-item-subtitle class="overline">Deployed {{ formatDate(contract.timestamp) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="contract.manager">
            <v-list-item-avatar size="28" class="mr-3">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">mdi-doctor</v-icon>
                </template>
                <span>Deployed by</span>
              </v-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="overline">Deployed by</v-list-item-title>
              <v-list-item-subtitle>{{ contract.manager }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="contract.delegate">
            <v-list-item-avatar size="28" class="mr-3">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">mdi-account-check-outline</v-icon>
                </template>
                <span>Delegated to</span>
              </v-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="overline">Delegated to</v-list-item-title>
              <v-list-item-subtitle>{{ contract.delegate }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="contract.last_action">
            <v-list-item-avatar size="28" class="mr-3">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">mdi-calendar-clock</v-icon>
                </template>
                <span>Last call</span>
              </v-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle>Last call {{ formatDate(contract.last_action) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="contract.tx_count">
            <v-list-item-avatar size="28" class="mr-3">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">mdi-swap-horizontal</v-icon>
                </template>
                <span>Operations count</span>
              </v-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle>{{ contract.tx_count }} operations</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="contract.sum_tx_amount">
            <v-list-item-avatar size="28" class="mr-3">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on">mdi-sigma</v-icon>
                </template>
                <span>Summary amount</span>
              </v-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle>{{ contract.sum_tx_amount| uxtz }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
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
            <v-icon left small>mdi-content-copy</v-icon>Same
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
              <span class="overline mt-3">No same contracts</span>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-list two-line class="pa-0" v-if="contracts.similar && contracts.similar.length > 0">
              <v-list-item-group active-class="light-green--text text--darken-2">
                <template v-for="(item) in contracts.similar">
                  <v-list-item
                    three-line
                    :key="item.address"
                    :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
                    class="py-2"
                  >
                    <v-list-item-avatar size="25">
                      <v-tooltip left>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            text
                            icon
                            :to="{ name: 'diff', params: { address: $route.params.address, network: $route.params.network, address2: item.address, network2: item.network}}"
                          >
                            <v-icon small>mdi-vector-difference</v-icon>
                          </v-btn>
                        </template>
                        <span>Show diff</span>
                      </v-tooltip>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        class="contract-item-address hash"
                        v-text="item.address"
                      ></v-list-item-title>
                      <v-list-item-subtitle class="overline">{{item.language}}</v-list-item-subtitle>
                      <v-list-item-subtitle
                        class="caption grey--text text-lighten-5"
                        v-if="item.count > 1"
                      >{{item.count - 1}} same contracts</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-chip
                        x-small
                        label
                        v-text="item.network"
                        color="secondary"
                        class="grey--text text--darken-3"
                      ></v-chip>
                      <v-list-item-action-text>{{ item.timestamp | fromNow }}</v-list-item-action-text>
                      <v-list-item-action-text>
                        <span v-if="item.added" class="primary--text">+&nbsp;{{item.added }}&#9;</span>
                        <span v-if="item.removed" class="red--text">-&nbsp;{{item.removed }}</span>
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
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
import ExpandableSearch from "@/components/ExpandableSearch.vue";

import dayjs from "dayjs";

export default {
  name: "Project",
  components: {
    ContractItem,
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
    },
    loading() {
      return this.successRequests < 2;
    }
  },
  data: () => ({
    contracts: null,
    projectTab: 0,
    contract: null,
    successRequests: 0
  }),
  created() {
    this.requestData(this.$route.params.network, this.$route.params.address);
  },
  methods: {
    requestData(network, address) {
      api
        .getContract(network, address)
        .then(res => {
          this.contract = res;
        })
        .catch(err => console.log(err))
        .finally(() => this.successRequests++);

      api
        .getProject(address)
        .then(res => {
          this.contracts = res;
        })
        .catch(err => console.log(err))
        .finally(() => this.successRequests++);
    },
    formatDate(value) {
      if (value) {
        let val = dayjs(value);
        if (val.unix() > 0) return val.format("MMM D, YYYY");
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

<style lang="scss" scoped>
.info-title {
  color: grey;
  font-size: 12px;
}

.info-data {
  font-size: 12px;
}
</style>