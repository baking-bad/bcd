<template>
  <v-navigation-drawer app fixed right touchless width="350" class="elevation-1" v-if="contract">
    <v-list class="py-1">
      <v-list-item two-line class="mb-0">
        <v-list-item-content>
          <v-list-item-title class="headline" v-if="contract.alias">{{ contract.alias }}</v-list-item-title>
          <v-list-item-subtitle class="hash" :class="contract.alias ? '' : 'subtitle-2'">{{ contract.address }}</v-list-item-subtitle>
          <v-list-item-subtitle 
            class="overline" 
            :class="contract.network === 'mainnet' ? 'primary--text' : ''">
              {{ contract.network }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <div class="d-flex flex-horizontal pr-5 pl-1 align-center justify-space-between pb-2">
        <div v-if="isAuthorized">
          <v-btn
            small
            text
            @click="subscribe"
            v-if="contract.profile == undefined || !contract.profile.subscribed"
            color="primary"
          >Subscribe</v-btn>
          <v-btn small text @click="unsubscribe" color="grey" v-else>Unsubscribe</v-btn>
        </div>
        <Rating :rating="rating" />
      </div>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="overline">Active</v-list-item-title>
          <v-list-item-subtitle class="body-2">
            {{ formatDate(contract.timestamp) }}
            <span v-if="contract.last_action"> — {{ formatDate(contract.last_action) }}</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="contract.balance">
        <v-list-item-content>
          <v-list-item-title class="overline">Locked amount</v-list-item-title>
          <v-list-item-subtitle class="body-2">{{ contract.balance| uxtz }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="withdrawn">
        <v-list-item-content>
          <v-list-item-title class="overline">Total withdrawn</v-list-item-title>
          <v-list-item-subtitle class="body-2">{{ withdrawn| uxtz }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="contract.manager" :href="getTzKTLink(contract.manager)" target="_blank">
        <v-list-item-content>
          <v-list-item-title class="overline">Deployed by</v-list-item-title>
          <v-list-item-subtitle class="body-2">{{ contract.manager }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="contract.delegate" :href="getTzKTLink(contract.delegate)" target="_blank">
        <v-list-item-content>
          <v-list-item-title class="overline">Delegated to</v-list-item-title>
          <v-list-item-subtitle class="body-2">{{ contract.delegate }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

    </v-list>

    <div class="pb-4 px-4">
      <v-chip
        color="secondary"
        text-color="grey darken-3"
        class="mr-1 overline my-1"
        small
        label
        pill
      >{{ contract.language }}</v-chip>
      <template v-for="tag in contract.tags">
        <v-chip
          :key="tag"
          color="secondary "
          text-color="grey darken-3"
          class="mr-1 overline my-1"
          small
          label
          pill
        >{{ tag.replace('_', ' ') }}</v-chip>
      </template>
    </div>

    <v-skeleton-loader
      :loading="sameLoading || similarLoading"
      transition="fade-transition"
      type="list-item-three-line"
    >
      <div>
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
              :key="key + '_' + item.address + '_' + item.network"
              :to="{name: 'project', params: {'address': item.address, 'network': item.network}}"
            />
            <v-btn
              class="mb-3"
              block
              text
              small
              :loading="isSameUpdating"
              @click="getProjectUpdate"
              v-if="same.length < sameCount"
            >Load more</v-btn>
          </v-tab-item>
          <v-tab-item>
            <SimilarItem
              :item="item"
              :address="contract.address"
              :network="contract.network"
              v-for="(item, key) in similar"
              :key="key + '_' + item.address + '_' + item.network"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-skeleton-loader>
  </v-navigation-drawer>
</template>

<script>
import dayjs from "dayjs";
import { mapActions } from "vuex";

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
    isSameUpdating: false,
    sameLoading: true,
    similarLoading: true,
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
    },
    withdrawn() {
      if (this.contract.sum_tx_amount) {
        return (this.sum_tx_amount - (this.contract.balance || 0)) / 2;
      } else {
        return 0;
      }
    }
  },
  created() {
    this.requestData();
  },
  methods: {
    ...mapActions(["showError"]),
    formatDate(value) {
      if (value) {
        let val = dayjs(value);
        if (val.unix() > 0) return val.format("MMM D, YYYY");
      }
    },
    requestData() {
      this.contract.same = [];
      this.contract.similar = [];
      this.contract.similarCount = 0;
      this.contract.sameCount = 0;
      this.rating = null;
      this.similarLoading = true;
      this.sameLoading = true;

      getSameContracts(this.contract.network, this.contract.address, 0)
        .then(res => {
          this.contract.same = res.contracts;
          this.contract.sameCount = res.count;
          if (this.contract.sameCount > 0) {
            this.projectTab = 0;
          }
          this.same = this.contract.same;
          this.sameCount = this.contract.sameCount;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
      .finally(() => (this.sameLoading = false));

      getSimilarContracts(this.contract.network, this.contract.address)
        .then(res => {
          this.contract.similar = res;
          this.contract.similarCount = res.length;
          if (this.contract.similarCount > 0) {
            if (!this.hasSame) this.projectTab = 1;
          }
          this.similar = this.contract.similar;
          this.similarCount = this.contract.similarCount;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.similarLoading = false));

      getContractRating(this.contract.network, this.contract.address).then(
        res => {
          this.rating = res;
        }
      );
    },
    getTzKTLink(address) {
      if (address.startsWith("tz"))
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
        .catch(err => {
          this.showError(err);
          console.log(err);
        });
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
        .catch(err => {
          this.showError(err);
          console.log(err);
        });
    },
    getProjectUpdate() {
      this.isSameUpdating = true;
      getSameContracts(
        this.contract.network,
        this.contract.address,
        this.contract.same.length
      )
        .then(res => {
          this.contract.same.push(...res.contracts);
          this.same = this.contract.same;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.isSameUpdating = false));
    }
  },
  watch: {
    contract: "requestData"
  }
};
</script>