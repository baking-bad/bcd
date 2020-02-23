<template>
  <v-navigation-drawer app fixed right width="445" class="elevation-1" v-if="contract && contracts">
    <v-list class="py-1">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="hash">{{ contract.address }}</v-list-item-title>
          <v-list-item-subtitle class="overline">Deployed {{ formatDate(contract.timestamp) }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action v-if="isAuthorized">
          <v-btn text icon @click="subscribe" v-if="!contract.profile.subscribed">
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
          <v-btn text icon @click="unsubscribe" v-else>
            <v-icon color="primary">mdi-bell</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-list-item v-if="contract.manager" :href="getTzKTLink(contract.manager)" target="_blank">
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
      <v-list-item v-if="contract.delegate" :href="getTzKTLink(contract.delegate)" target="_blank">
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
      <template v-for="tag in contract.tags">
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

    <v-tabs grow background-color="transparent" slider-color="primary" v-model="projectTab" v-if="hasSame || hasSimilar">
      <v-tab class="overline" :disabled="!hasSame">
        <v-icon left small>mdi-content-copy</v-icon>
        Same ({{ contracts.same.length }})
      </v-tab>
      <v-tab class="overline" :disabled="!hasSimilar">
        <v-icon left small>mdi-approximately-equal</v-icon>
        Similar ({{ contracts.similar.length }})
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="projectTab">
      <v-tab-item>
        <v-list two-line class="pa-0">
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
      </v-tab-item>
      <v-tab-item>
        <v-list two-line class="pa-0">
          <v-list-item-group active-class="light-green--text text--darken-2">
            <template v-for="(item) in contracts.similar">
              <v-list-item
                :three-line="item.count > 1"
                :two-line="item.count <= 1"
                :key="item.address"
                :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
                class="py-2"
              >
                <v-list-item-avatar size="25">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" text icon @click.prevent="onDiffClick(item)">
                        <v-icon small>mdi-vector-difference</v-icon>
                      </v-btn>
                    </template>
                    <span>Show diff</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="contract-item-address hash" v-text="item.address"></v-list-item-title>
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
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script>
import dayjs from "dayjs";
import * as api from "@/api/index.js";
import { addProfileSubscription, removeProfileSubscription } from "@/api/profile.js";
import { getTzKTLink } from "@/utils/tzkt.js";

import ContractItem from "@/components/ContractItem.vue";

export default {
  name: "ProjectNav",
  components: {
    ContractItem
  },
  props: {
    contract: Object
  },
  data: () => ({
    contracts: null,
    projectTab: 0,
    loading: true
  }),
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    },
    hasSame() {
      return this.contracts.same && this.contracts.same.length > 0;
    },
    hasSimilar() {
      return this.contracts.similar && this.contracts.similar.length > 0;
    }
  },
  created() {
    this.requestData();
  },
  methods: {
    formatDate(value) {
      if (value) {
        let val = dayjs(value);
        if (val.unix() > 0) return val.format("MMM D, YYYY");
      }
    },
    onDiffClick(item) {
      let routeData = this.$router.resolve({
        name: "diff",
        params: {
          address: this.$route.params.address,
          network: this.$route.params.network,
          address2: item.address,
          network2: item.network
        }
      });
      window.open(routeData.href, "_blank");
    },
    requestData() {
      api
        .getContractProject(
          this.$route.params.network,
          this.$route.params.address
        )
        .then(res => {
          this.contracts = res;
          if (this.hasSame) this.projectTab = 0;
          else if (this.hasSimilar) this.projectTab = 1;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    },
    getTzKTLink(address) {
      return getTzKTLink(this.contract.network, address);
    },
    subscribe() {
      addProfileSubscription(this.contract.id, 'contract')
      .then(() => {
        this.contract.profile.subscribed = true
      })
      .catch(err => console.log(err))
    },
    unsubscribe() {
      removeProfileSubscription(this.contract.id, 'contract')
      .then(() => {
        this.contract.profile.subscribed = false
      })
      .catch(err => console.log(err))
    }
  },
  watch: {
    $route: "requestData"
  }
};
</script>