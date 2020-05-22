<template>
  <div class="fill-height canvas">
    <v-list-item style="max-height: 74px;">
      <v-list-item-content two-line>
        <v-list-item-title class="headline">Dashboard</v-list-item-title>
        <v-list-item-subtitle class="overline" v-if="profile">{{ profile.login }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-expansion-panels flat tile mandatory active-class="opened-panel">
      <v-expansion-panel class="ma-0 bb-1" v-if="profile">
        <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
          <span class="caption font-weight-bold text-uppercase text--secondary">Watch</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="data">
          <v-list class="sidebar-list">
            <template v-for="(contract, i) in profile.subscriptions">
              <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
              <v-list-item :key="i" class="pr-1" :to="`/${contract.network}/${contract.address}`">
                <v-list-item-content>
                  <v-list-item-title class="body-2">
                    <span v-if="contract.alias">{{ contract.alias }}</span>
                    <span v-else v-html="helpers.shortcut(contract.address)"></span>
                  </v-list-item-title>
                  <v-list-item-subtitle class="overline">{{ contract.network }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text class="d-flex flex-column">
                    <v-chip x-small outlined class="mb-1 text--secondary">same</v-chip>
                    <v-chip x-small outlined class="text--secondary">similar</v-chip>
                  </v-list-item-action-text>
                </v-list-item-action>
                <v-list-item-icon>
                  <v-btn small icon @click.prevent.stop="editSettings(contract)">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </template>
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

    <v-footer
      color="transparent"
      absolute
      bottom
      class="d-flex justify-center ml-6"
      style="z-index: 0"
    >
      <v-btn x-small text href="https://baking-bad.org/docs" target="_blank" color="border">
        <span>Baking Bad</span>
      </v-btn>
    </v-footer>

    <WatchSettings
      v-if="editedContract"
      :show.sync="showWatchSettings"
      :network="editedContract.network"
      :address="editedContract.address"
      :alias="editedContract.alias"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import WatchSettings from "@/components/WatchSettings.vue";

export default {
  name: "SideBar",
  components: {
    WatchSettings
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
    showWatchSettings: false,
    editedContract: null
  }),
  methods: {
    ...mapActions({
      showError: "showError"
    }),
    editSettings(contract) {
      this.editedContract = contract;
      this.showWatchSettings = true;
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
