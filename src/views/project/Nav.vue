<template>
  <v-navigation-drawer app fixed right touchless width="350" v-if="contract">
    <v-list class="pa-0">
      <v-list-item two-line class="mb-0">
        <v-list-item-content>
          <v-list-item-title class="headline" v-if="contract.alias">{{ contract.alias }}</v-list-item-title>
          <v-list-item-subtitle
            class="hash"
            :class="contract.alias ? '' : 'subtitle-2'"
          >{{ contract.address }}</v-list-item-subtitle>
          <v-list-item-subtitle
            class="overline"
            :class="contract.network === 'mainnet' ? 'primary--text' : ''"
          >{{ contract.network }}</v-list-item-subtitle>
        </v-list-item-content>        
      </v-list-item>

      <div class="pb-3 px-4">
        <v-chip
          color="grey"
          text-color="grey darken-3"
          class="mr-1 mb-1 caption"
          small
          outlined
        >{{ contract.language }}</v-chip>
        <template v-for="tag in contract.tags">
          <v-chip
            :key="tag"
            color="grey"
            text-color="grey darken-3"
            class="mr-1 mb-1 caption"
            small
            outlined
          >{{ tag.replace('_', ' ') }}</v-chip>
        </template>
      </div>

      <v-divider></v-divider>

      <div class="d-flex flex-horizontal align-center mx-4 mt-4 mb-1">
        <v-snackbar color="light-green darken-1" v-model="shared" :timeout="2000" top>
          Link copied to clipboard!
          <v-btn text @click="shared = false">OK</v-btn>
        </v-snackbar>
        <v-btn v-clipboard="getContractLink()" v-clipboard:success="onShare" small depressed class="mr-2">
          <v-icon x-small class="mr-1">mdi-share-variant</v-icon>
          <span class="overline">Share</span>
        </v-btn>
        <div v-if="isAuthorized">
          <WatchSettings 
            :show.sync="showWatch"
            :id="contract.id"
            :address="contract.address" 
            :network="contract.network"
            :alias="contract.alias" />
          <v-btn 
            v-if="contract.profile == undefined || !contract.profile.subscribed" 
            small depressed class="d-flex align-center"
            @click="showWatch = true"
          >
            <v-icon x-small>mdi-eye-outline</v-icon>
            <span class="overline ml-1">Watch</span>
          </v-btn>
          <v-btn 
            v-else 
            small text class="d-flex align-center"
            @click="showWatch = true"
          >
            <v-icon x-small>mdi-eye-off-outline</v-icon>
            <span class="overline ml-1">Unwatch</span>
          </v-btn>
        </div>
      </div>

      <InfoItem title="Was active" :subtitle="wasActive" gutters />
      <InfoItem
        v-if="contract.balance"
        title="Locked balance"
        :subtitle="contract.balance | uxtz"
        gutters
      />
      <InfoItem
        v-if="contract.total_withdrawn"
        title="Total withdrawn"
        :subtitle="contract.total_withdrawn | uxtz"
        gutters
      />
      <AccountBox
        v-if="contract.manager"
        title="Deployed by"
        :address="contract.manager"
        :network="contract.network"
        gutters
      />
      <AccountBox
        v-if="contract.delegate"
        title="Delegated to"
        :address="contract.delegate"
        :network="contract.network"
        :alias="contract.delegate_alias"
        gutters
      />
    </v-list>

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
              :basetime="contract.timestamp"
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
              :basetime="contract.timestamp"
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

import ContractItem from "@/components/ContractItem.vue";
import SimilarItem from "@/components/SimilarItem.vue";
import InfoItem from "@/components/InfoItem.vue";
import AccountBox from "@/components/AccountBox.vue";
import WatchSettings from "@/components/WatchSettings.vue"

export default {
  name: "ProjectNav",
  components: {
    ContractItem,
    SimilarItem,
    InfoItem,
    AccountBox,
    WatchSettings
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
    shared: false,
    showWatch: false
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
    wasActive() {
      let res = this.formatDate(this.contract.timestamp);
      if (this.contract.last_action) {
        let lastAction = this.formatDate(this.contract.last_action);
        res = `${res} — ${lastAction}`;
      }
      return res;
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
      this.similarLoading = true;
      this.sameLoading = true;

      this.api.getSameContracts(this.contract.network, this.contract.address, 0)
        .then(res => {
          if (!res) return;
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

      this.api.getSimilarContracts(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
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
    },
    getProjectUpdate() {
      this.isSameUpdating = true;
      this.api.getSameContracts(
        this.contract.network,
        this.contract.address,
        this.contract.same.length
      )
        .then(res => {
          if (!res) return;
          this.contract.same.push(...res.contracts);
          this.same = this.contract.same;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.isSameUpdating = false));
    },
    getContractLink() {
      let routeData = {};
      if (this.contract.slug) {
        routeData = this.$router.resolve({
          name: "slug",
          params: { slug: this.contract.slug }
        });
      } else if (this.contract.network && this.contract.address) {
        routeData = this.$router.resolve({
          name: "project",
          params: {
            address: this.contract.address,
            network: this.contract.network
          }
        });
      } else {
        routeData = this.$router.resolve({ name: "home" });
      }
      return `${window.location.protocol}//${window.location.host}${routeData.href}`;
    },
    onShare() {
      this.shared = true;
    }
  },
  watch: {
    contract: "requestData"
  }
};
</script>