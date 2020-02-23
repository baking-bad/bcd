<template>
  <v-container fluid>
    <div v-if="loading"></div>
    <div v-else-if="!subscriptions || subscriptions.length == 0" class="d-flex justify-center">
      <v-card max-width="400">
        <v-card-title class="justify-center subtitle-1 text-uppercase">You don`t have subscriptions yet</v-card-title>
        <v-img src="/empty.jpg" />
      </v-card>
    </div>
    <div v-else class="d-flex flex-horizontal flex-wrap">
      <template v-for="(item, idx) in subscriptions">
        <v-card
          hover
          tile
          max-width="600px"
          class="ma-2"
          :key="idx"
          :to="{ name: 'project', params: {address: item.address, network: item.network}}"
        >
          <v-toolbar flat class="transparent pb-0">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="hash card-title">{{ item.address }}</v-list-item-title>
                <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>Subscribed {{ item.subscribed_at | fromNow }}</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-toolbar>
          <v-card-text class="py-0">
            <v-list class="py-0">
              <v-list-item v-if="item.manager" :href="getTzKTLink(item)" target="_blank">
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
                  <v-list-item-subtitle>{{ item.manager }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.delegate" :href="getTzKTLink(item)" target="_blank">
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
                  <v-list-item-subtitle>{{ item.delegate }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.last_action">
                <v-list-item-avatar size="28" class="mr-3">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-on="on">mdi-calendar-clock</v-icon>
                    </template>
                    <span>Last call</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle>Last call {{ formatDate(item.last_action) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.tx_count">
                <v-list-item-avatar size="28" class="mr-3">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon small v-on="on">mdi-swap-horizontal</v-icon>
                    </template>
                    <span>Operations count</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle>{{ item.tx_count }} operations</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="mx-5 mb-2">
            <v-row>
              <v-col>
                <template v-for="(tag, idx) in getTags(item)">
                  <v-chip
                    :key="idx"
                    color="secondary"
                    text-color="grey darken-1"
                    class="mr-1 caption"
                    small
                    label
                    pill
                  >{{ tag.replace('_', ' ')}}</v-chip>
                </template>
              </v-col>
              <v-col cols="1">
                <v-btn icon text @click.prevent="unsubscribe(item)">
                  <v-icon>mdi-bell-off</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </template>
    </div>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import {
  getProfileSubscriptions,
  removeProfileSubscription
} from "@/api/profile.js";
import { getTzKTLink } from "@/utils/tzkt.js";

export default {
  name: "Subscriptions",
  data: () => ({
    subscriptions: null,
    loading: true
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
    },
    getTags(item) {
      let tags = [item.language];
      if (item.tags) {
        tags.push(...item.tags);
      }
      return tags;
    },
    getTzKTLink(item) {
      return getTzKTLink(item.network, item.address);
    },
    formatDate(value) {
      if (value) {
        let val = dayjs(value);
        if (val.unix() > 0) return val.format("MMM D, YYYY");
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