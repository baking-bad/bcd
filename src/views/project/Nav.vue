<template>
  <v-navigation-drawer app fixed right width="400" class="elevation-1" v-if="contract">
    <v-list class="py-1">
      <v-list-item two-line class="mb-0" v-if="!contract.alias">
        <v-list-item-content>
          <v-list-item-title class="hash">{{ contract.address }}</v-list-item-title>
          <v-list-item-subtitle class="overline">Deployed {{ formatDate(contract.timestamp) }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item three-line class="mb-0" v-else>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ contract.alias }}</v-list-item-title>
          <v-list-item-subtitle class="hash">{{ contract.address }}</v-list-item-subtitle>
          <v-list-item-subtitle class="overline">Deployed {{ formatDate(contract.timestamp) }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div class="d-flex flex-horizontal pr-5 pl-1 align-center justify-space-between pb-2">
        <div v-if="isAuthorized">
          <v-btn
            small
            text
            @click="subscribe"
            v-if="!contract.profile.subscribed"
            color="primary"
          >Subscribe</v-btn>
          <v-btn small text @click="unsubscribe" color="grey" v-else>Unsubscribe</v-btn>
        </div>
        <Rating :rating="rating" />
      </div>

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
        class="mr-1 caption my-1"
        small
        label
        pill
      >{{ contract.network }}</v-chip>
      <v-chip
        color="secondary"
        text-color="grey darken-1"
        class="mr-1 caption my-1"
        small
        label
        pill
      >{{ contract.language }}</v-chip>
      <template v-for="tag in contract.tags">
        <v-chip
          :key="tag"
          color="secondary"
          text-color="grey darken-1"
          class="mr-1 caption my-1"
          small
          label
          pill
        >{{ tag.replace('_', ' ') }}</v-chip>
      </template>
    </div>

    <v-tabs
      grow
      background-color="transparent"
      slider-color="primary"
      v-model="projectTab"
      v-if="hasSame || hasSimilar"
    >
      <v-tab class="overline" :disabled="!hasSame">
        <v-icon left small>mdi-content-copy</v-icon>
        Same ({{ sameCount }})
      </v-tab>
      <v-tab class="overline" :disabled="!hasSimilar">
        <v-icon left small>mdi-approximately-equal</v-icon>
        Similar ({{ similarCount }})
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="projectTab">
      <v-tab-item>
        <ContractItem
          v-for="(item, key) in same"
          class="py-2"
          :item="item"
          :key="key"
          :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
        />
        <v-btn
          class="mb-3"
          block
          text
          small
          @click="getProjectUpdate"
          v-if="same.length < sameCount"
        >Load more</v-btn>
      </v-tab-item>
      <v-tab-item>
        <SimilarItem
          :item="item"
          :address="$route.params.address"
          :network="$route.params.network"
          v-for="(item, key) in similar"
          :key="key"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script>
import dayjs from "dayjs";
import {
  getSameContracts,
  getSimilarContracts,
  getContractRating
} from "@/api/index.js";
import {
  addProfileSubscription,
  removeProfileSubscription
} from "@/api/profile.js";
import { getTzKTLink } from "@/utils/tzkt.js";

import ContractItem from "@/components/ContractItem.vue";
import SimilarItem from "@/components/SimilarItem.vue";
import Rating from "@/components/Rating.vue";

export default {
  name: "ProjectNav",
  components: {
    ContractItem,
    SimilarItem,
    Rating
  },
  props: {
    contract: Object
  },
  data: () => ({
    projectTab: 0,
    loading: true,
    same: [],
    sameCount: 0,
    similar: [],
    similarCount: 0,
    rating: null
  }),
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    },
    hasSame() {
      return this.sameCount > 0;
    },
    hasSimilar() {
      return this.similarCount > 0;
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
    requestData() {
      this.same = [];
      this.similar = [];
      this.similarCount = 0;
      this.sameCount = 0;
      this.rating = null;

      getSameContracts(
        this.$route.params.network,
        this.$route.params.address,
        this.same.length
      )
        .then(res => {
          this.same.push(...res.contracts);
          this.sameCount = res.count;
          if (this.sameCount > 0) this.projectTab = 0;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));

      getSimilarContracts(
        this.$route.params.network,
        this.$route.params.address
      )
        .then(res => {
          this.similar.push(...res);
          this.similarCount = res.length;
          if (!this.hasSame && this.similarCount > 0) this.projectTab = 1;
        })
        .catch(err => console.log(err));

      getContractRating(
        this.$route.params.network,
        this.$route.params.address
      ).then(res => {
        this.rating = res;
      });
    },
    getTzKTLink(address) {
      return getTzKTLink(this.contract.network, address);
    },
    subscribe() {
      addProfileSubscription(this.contract.id, "contract")
        .then(() => {
          this.contract.profile.subscribed = true;
          this.rating.count += 1;
          if (this.rating.users.length < 5) {
            this.rating.users.push(this.profile);
          }
        })
        .catch(err => console.log(err));
    },
    unsubscribe() {
      removeProfileSubscription(this.contract.id, "contract")
        .then(() => {
          this.contract.profile.subscribed = false;
          this.rating.count -= 1;
          for (let i = 0; i < this.rating.users.length; i++) {
            if (this.rating.users[i].login === this.profile.login) {
              this.rating.users.splice(i, 1);
              break;
            }
          }
        })
        .catch(err => console.log(err));
    },
    getProjectUpdate() {
      getSameContracts(
        this.$route.params.network,
        this.$route.params.address,
        this.same.length
      )
        .then(res => {
          this.same.push(...res.contracts);
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  },
  watch: {
    $route: "requestData"
  }
};
</script>