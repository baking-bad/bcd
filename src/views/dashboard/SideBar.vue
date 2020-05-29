<template>
  <div class="fill-height canvas">
    <v-list-item style="max-height: 74px;">
      <v-list-item-content two-line>
        <v-list-item-title class="headline">Dashboard</v-list-item-title>
        <v-list-item-subtitle class="overline" v-if="profile">{{ profile.login }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <v-expansion-panels flat tile mandatory active-class="opened-panel">
        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Watch</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data">
            <v-list class="sidebar-list">
              <template v-for="(item, i) in subscriptions">
                <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
                <v-list-item :key="i" class="pr-2" :to="item.address.startsWith('KT') ? `/${item.network}/${item.address}` : `/${item.address}`">
                  <v-list-item-content>
                    <v-list-item-title class="body-2">
                      <span v-if="item.alias">{{ item.alias }}</span>
                      <span v-else v-html="helpers.shortcut(item.address)"></span>
                    </v-list-item-title>
                    <v-list-item-subtitle class="overline">
                      <span :class="item.network === 'mainnet' ? 'secondary--text' : ''">{{ item.network }}</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text class="d-flex">
                      <v-btn small text @click.prevent.stop="watchSettings(item)" class="settings-button pl-1 pr-0">
                        <v-icon v-if="item.watch_errors" color="error" class="mr-1" small>mdi-alert-outline</v-icon>
                        <v-icon v-if="item.watch_migrations" color="warning" class="mr-1" small>mdi-source-pull</v-icon>
                        <v-icon v-if="item.watch_calls" color="secondary" class="mr-1" small>mdi-swap-horizontal</v-icon>
                        <v-icon v-if="item.watch_mempool" color="info" class="mr-1" small>mdi-history</v-icon>
                        <v-icon v-if="item.watch_deployments || item.watch_same || item.watch_similar" color="accent" class="mr-1" small>mdi-shape-square-plus</v-icon>
                      </v-btn>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <div v-if="subscriptions.length === 0" class="pa-4 text--secondary body-2">
                Press<v-icon small class="text--disabled mx-1">mdi-eye-outline</v-icon>button on a contract page
                <br />to receive notifications
              </div>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel disabled class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase">Accounts</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data"></v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel disabled class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase">Deployments</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data"></v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>

    <BakingBadFooter />

    <WatchSettings
      :show.sync="showWatchSettings"
      :data="selected"
      :onUpdate="updateSubscription"
      :onRemove="removeSubscription"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import WatchSettings from "@/components/WatchSettings.vue";
import BakingBadFooter from "@/components/BakingBadFooter.vue";

export default {
  name: "SideBar",
  components: {
    WatchSettings,
    BakingBadFooter
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    }
  },
  data: () => ({
    loading: true,
    subscriptions: [],
    selected: null,
    showWatchSettings: false
  }),
  created() {
    this.getSubscriptions();
  },
  methods: {
    ...mapActions(["showError", "setSubscriptionChanged"]),
    watchSettings(item) {
      this.selected = item;
      this.showWatchSettings = true;
    },
    setProfileUpdated() {
      this.$store.state.profile.updated = true;
    },
    updateSubscription(item) {
      this.subscriptions = this.subscriptions.map(s => {
        if (s.address === item.address && s.network === item.network) {
          return item;
        } else {
          return s;
        }
      });
      this.setSubscriptionChanged(item);
    },
    removeSubscription(item) {
      this.subscriptions = this.subscriptions.filter(
        s => s.address !== item.address || s.network !== item.network
      );
      this.setSubscriptionChanged(item);
    },
    getSubscriptions() {
      this.loading = true;
      this.api
        .getProfileSubscriptions()
        .then(res => {
          if (!res) return;
          this.subscriptions = res;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scss>
.settings-button {
  opacity: .7;
}
.settings-button:hover {
  opacity: 1;
}
.opened-panel {
  border-bottom: none !important;
}
.opened-panel > .v-expansion-panel-content > .v-expansion-panel-content__wrap {
  padding: 0;
}
.opened-panel > .v-expansion-panel-header {
  min-height: 48px;
}
.sidebar-list {
  max-height: calc(100vh - 75px - 3 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
