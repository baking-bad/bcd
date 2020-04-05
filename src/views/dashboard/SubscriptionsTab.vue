<template>
  <v-container fluid>
    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <div
        v-if="!subscriptions || subscriptions.length == 0"
        class="d-flex flex-column align-center justify-center mt-12 transparent message-card"
      >
        <v-card flat outlined>
          <v-card-text class="pa-10">
            <div class="d-flex flex-row justify-start align-center">
              <v-icon size="50">mdi-text-box-check-outline</v-icon>
              <span class="display-1 ml-5">Subscribe to contract</span>
            </div>
            <div class="d-flex flex-row mt-5">
              <span
                class="overline"
              >After subcription you can easy find interesting you contracts and watch for them</span>
            </div>
          </v-card-text>
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
                  <v-list-item-title v-if="!item.alias" class="hash card-title">{{ item.address }}</v-list-item-title>
                  <v-list-item-title v-else class="card-title">
                    {{ item.alias }}&nbsp;
                    <span
                      class="body-2 grey--text text--darken-1 hash"
                    >{{ item.address}}</span>
                  </v-list-item-title>
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
                      <v-icon small color="primary" v-if="item.last_action">mdi-calendar-clock</v-icon>
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
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
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
    ...mapActions(["showError"]),
    getData() {
      getProfileSubscriptions()
        .then(res => {
          this.subscriptions = res;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.loading = false));

      getRecommendedSubscriptions()
        .then(res => {
          this.recommended = res;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.recommendedLoading = false));
    },
    getTzKTLink(item) {
      if (item.address.startsWith("tz"))
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
        .catch(err => {
          this.showError(err);
          console.log(err);
        });
    },
    subscribe(item) {
      addProfileSubscription(item.id, "contract")
        .then(() => {})
        .catch(err => {
          this.showError(err);
          console.log(err);
        });
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