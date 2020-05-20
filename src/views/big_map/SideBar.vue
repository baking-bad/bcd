<template>
  <div class="fill-height canvas">
    <v-list-item style="  height: 74px;">
      <v-list-item-content two-line>
        <v-list-item-title class="headline">Big Map {{ ptr }}</v-list-item-title>
        <v-list-item-subtitle>
          <span
          class="overline"
          :class="network === 'mainnet' ? 'secondary--text' : ''"
        >{{ network }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-skeleton-loader 
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line">
      <v-expansion-panels flat tile mandatory multiple active-class="opened-panel">
        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Details</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="bigmap-sidebar-list">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Status</v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    <span>Allocated</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Owner</v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    <span v-html="helpers.shortcut('KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn')"></span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text>
                    <v-btn icon :to="`/${network}/KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn`">
                      <v-icon small>mdi-vector-link</v-icon>
                    </v-btn>
                  </v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Type</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
           
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-expansion-panels>
    </v-skeleton-loader>

    <v-footer color="transparent" absolute bottom class="d-flex justify-center ml-6" style="z-index: 0">
      <v-btn x-small text href="https://baking-bad.org/docs" target="_blank" color="border">
        <span>Baking Bad</span>
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SideBar",
  props: {  
    ptr: String,
    network: String  
  },
  created() {
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    ...mapActions({
      showError: "showError"
    })
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
.bigmap-sidebar-list {
  max-height: calc(100vh - 75px - 2 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
