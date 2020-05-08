<template>
  <div class="fill-height d-flex flex-column">
    <v-list-item style="max-height: 74px;">
      <v-list-item-content>
        <v-list-item-title class="headline">Dashboard</v-list-item-title>
        <v-list-item-subtitle class="overline">{{ profile.login }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-skeleton-loader :loading="loading" transition="fade-transition" type="list-item-three-line">
      <v-expansion-panels flat tile multiple mandatory>
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-header color="sidebar" class="pl-4">
            <span class="caption font-weight-bold text-uppercase">Watch</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="pa-0">
              <template v-for="(contract, i) in watch">
                <v-divider :key="'divider' + i"></v-divider>
                <v-list-item :key="i" class="pr-1" :to="`/${contract.network}/${contract.address}`">
                  <v-list-item-content>
                    <v-list-item-title class="body-2">
                      <span v-if="contract.alias">{{ contract.alias }}</span>
                      <span v-else v-html="shortcut(contract.address)"></span>
                    </v-list-item-title>
                    <v-list-item-subtitle class="overline">{{ contract.network }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text class="d-flex flex-column">
                      <v-chip x-small outlined class="mb-1 grey--text text--darken-1">same</v-chip>
                      <v-chip x-small outlined class="grey--text text--darken-1">similar</v-chip>
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

        <v-expansion-panel disabled class="ma-0 bt-1">
          <v-expansion-panel-header color="sidebar" class="pl-4">
            <span class="caption font-weight-bold text-uppercase">Accounts</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas"></v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel disabled class="ma-0 bt-1 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4">
            <span class="caption font-weight-bold text-uppercase">Deployments</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas"></v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>

    <v-spacer></v-spacer>
    <v-footer color="transparent" bottom class="d-flex justify-center">
      <v-btn x-small text href="https://baking-bad.org/docs" target="_blank" color="border">
        <span>Baking Bad were here</span>
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
import { shortcut } from "@/utils/tz.js";

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
  created() {
    this.getWatchContracts();
  },
  data: () => ({
    loading: true,
    showWatchSettings: false,
    editedContract: null,
    watch: []
  }),
  methods: {
    ...mapActions({
      showError: "showError"
    }),
    shortcut,
    getWatchContracts() {
      this.api
        .getProfileSubscriptions()
        .then(res => {
          this.watch = res;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.loading = false));
    },
    editSettings(contract) {
      this.editedContract = contract;
      this.showWatchSettings = true;
    }
  }
};
</script>

<style>
.v-expansion-panel-content > .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>  