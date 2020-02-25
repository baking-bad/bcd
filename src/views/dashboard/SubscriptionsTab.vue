<template>
  <v-container fluid>
    <div v-if="loading"></div>
    <div v-else-if="!subscriptions || subscriptions.length == 0" class="d-flex justify-center">
      <v-card max-width="400">
        <v-card-title
          class="justify-center subtitle-1 text-uppercase"
        >You don`t have subscriptions yet</v-card-title>
        <v-img src="/empty.jpg" />
      </v-card>
    </div>
    <v-row v-else>
      <v-col>
        <v-list :elevation="2">
          <v-subheader>Your subscriptions</v-subheader>
          <template v-for="(item, idx) in subscriptions">
            <v-list-item
              three-line
              :key="idx"
              :to="{ name: 'project', params: {address: item.address, network: item.network}}"
            >
              <v-list-item-content>
                <v-list-item-title class="hash card-title">{{ item.address }}</v-list-item-title>
                <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
                <v-list-item-subtitle class="d-flex flex-horizontal">
                  <div class="d-flex flex-horizontal">
                    <v-icon small color="primary">mdi-calendar-clock</v-icon>
                    <span class="ml-2">Last call {{ formatDate(item.last_action) }}</span>
                  </div>
                  <div class="d-flex flex-horizontal ml-5">
                    <v-icon small color="primary">mdi-code-tags</v-icon>
                    <span class="ml-2">{{ item.language }}</span>
                  </div>
                  <div class="d-flex flex-horizontal ml-5">
                    <v-icon small color="primary">mdi-swap-horizontal</v-icon>
                    <span class="ml-2">{{ item.tx_count }} operations</span>
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>Subscribed {{ item.subscribed_at | fromNow }}</v-list-item-action-text>
                <v-btn icon text @click.prevent="unsubscribe(item)">
                  <v-icon>mdi-bell-off</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="subscriptions.length + idx" v-if="idx != subscriptions.length - 1"></v-divider>
          </template>
        </v-list>
      </v-col>
      <v-col cols="4" v-if="recommended && recommended.length > 0">
        <v-list :elevation="2">
          <v-subheader>Recommendations</v-subheader>
          <template v-for="(item, idx) in recommended">
            <v-list-item
              three-line
              :key="idx"
              :to="{ name: 'project', params: {address: item.address, network: item.network}}"
            >
              <v-list-item-content>
                <v-list-item-title class="hash card-title">{{ item.address }}</v-list-item-title>
                <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
                <v-list-item-subtitle class="d-flex flex-horizontal">
                  <div class="d-flex flex-horizontal">
                    <v-icon small color="primary">mdi-calendar-clock</v-icon>
                    <span class="ml-2">Last call {{ formatDate(item.last_action) }}</span>
                  </div>
                  <div class="d-flex flex-horizontal ml-5">
                    <v-icon small color="primary">mdi-code-tags</v-icon>
                    <span class="ml-2">{{ item.language }}</span>
                  </div>
                  <div class="d-flex flex-horizontal ml-5">
                    <v-icon small color="primary">mdi-swap-horizontal</v-icon>
                    <span class="ml-2">{{ item.tx_count }} operations</span>
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon text @click.prevent="subscribe(item)">
                  <v-icon>mdi-bell-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="recommended.length + idx" v-if="idx != recommended.length - 1"></v-divider>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import {
  getProfileSubscriptions,
  addProfileSubscription,
  removeProfileSubscription,
  getRecommendedSubscriptions
} from "@/api/profile.js";
import { getTzKTLink } from "@/utils/tzkt.js";

export default {
  name: "Subscriptions",
  data: () => ({
    subscriptions: null,
    loading: true,
    recommended: null,
    recommendedLoading: true
  }),
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getProfileSubscriptions()
        .then(res => {
          this.subscriptions = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));

      getRecommendedSubscriptions()
        .then(res => {
          this.recommended = res;
        })
        .catch(err => console.log(err))
        .finally(() => (this.recommendedLoading = false));
    },
    getTzKTLink(item) {
      return getTzKTLink(item.network, item.address);
    },
    formatDate(value) {
      if (value) {
        let val = dayjs(value);
        if (val.unix() > 0) return val.format("MMM DD, YYYY");
      }
    },
    unsubscribe(item) {
      removeProfileSubscription(item.id, "contract")
        .then(() => {
          for (var i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions.id === item.id) {
              this.subscriptions.splice(i, 1);
              break;
            }
          }
        })
        .catch(err => console.log(err));
    },
    subscribe(item) {
      addProfileSubscription(item.id, "contract")
        .then(() => {})
        .catch(err => console.log(err));
    }
  },
  $route: "getData"
};
</script>

<style scoped>
.card-title {
  font-size: 1rem;
}
</style>