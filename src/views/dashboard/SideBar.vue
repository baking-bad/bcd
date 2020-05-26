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
                <v-list-item :key="i" class="pr-1" :to="`/${item.network}/${item.address}`">
                  <v-list-item-content>
                    <v-list-item-title class="body-2">
                      <span v-if="item.alias">{{ item.alias }}</span>
                      <span v-else v-html="helpers.shortcut(item.address)"></span>
                    </v-list-item-title>
                    <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text class="d-flex flex-column">
                      <v-chip
                        v-if="item.watch_same"
                        x-small
                        outlined
                        class="mb-1 text--secondary"
                      >same</v-chip>
                      <v-chip
                        v-if="item.watch_similar"
                        x-small
                        outlined
                        class="text--secondary"
                      >similar</v-chip>
                      <v-chip
                        v-if="item.watch_deployed"
                        x-small
                        outlined
                        class="text--secondary"
                      >deployed</v-chip>
                    </v-list-item-action-text>
                  </v-list-item-action>
                  <v-list-item-icon>
                    <v-btn small icon @click.prevent.stop="watchSettings(item)">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </template>
              <div v-if="subscriptions.length === 0" class="pa-4 text--secondary body-2">
                Press
                <v-icon small class="text--disabled">mdi-eye-outline</v-icon>button on a contract page
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
    ...mapActions({
      showError: "showError"
    }),
    watchSettings(item) {
      this.selected = item;
      this.showWatchSettings = true;
    },
    updateSubscription(item) {
      this.subscriptions = this.subscriptions.map(s => {
        if (s.address === item.address && s.network === item.network) {
          return item;
        } else {
          return s;
        }
      });
    },
    removeSubscription(item) {
      this.subscriptions = this.subscriptions.filter(
        s => s.address !== item.address || s.network !== item.network
      );
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
