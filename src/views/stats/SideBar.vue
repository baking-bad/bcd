<template>
  <div class="fill-height canvas">
    <v-list-item style="height: 74px;">
      <v-list-item-content two-line>
        <v-list-item-title class="headline">Statistics</v-list-item-title>
        <v-list-item-subtitle>
          <span class="overline">{{ network }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <v-expansion-panels flat tile mandatory multiple active-class="opened-panel">
        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Networks</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data">
            <v-list class="stats-sidebar-list">
              <v-list-item-group v-model="item" mandatory>
                <template v-for="(state, idx) in states">
                  <v-divider :key="'divider' + idx" v-if="idx > 0"></v-divider>
                  <v-list-item :key="idx" @click="navigate(state)">
                    <v-list-item-content>
                      <v-list-item-title class="overline text--primary">{{ state.network }}</v-list-item-title>
                      <v-list-item-subtitle class="body-2">{{ state.protocol.slice(0, 8) }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text
                        class="overline text--primary"
                      >{{ helpers.formatDatetime(state.timestamp) }}</v-list-item-action-text>
                      <v-list-item-action-text class="body-2">level {{ state.level }}</v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>

    <BakingBadFooter />
  </div>
</template>

<script>
import BakingBadFooter from "@/components/BakingBadFooter.vue";

export default {
  name: "SideBar",
  props: {
    states: Array,
    loading: Boolean,
    network: String,
  },
  components: {
    BakingBadFooter,
  },
  created() {
    this.setItem();
  },
  watch: {
    states() {
      this.setItem();
    }
  },
  data: () => ({
    item: 0,
  }),
  methods: {
    navigate(state) {
      this.$router.push({
        name: this.$router.name,
        params: { network: state.network },
      });
    },
    setItem() {
      this.states.forEach((x, idx) => {
        if (x.network === this.$route.params.network) this.item = idx;
      });
    }
  },
};
</script>

<style lang="scss">
.opened-panel {
  border-bottom: none !important;
}
.opened-panel > .v-expansion-panel-content > .v-expansion-panel-content__wrap {
  padding: 0;
}
.opened-panel > .v-expansion-panel-header {
  min-height: 48px;
}
.stats-sidebar-list {
  max-height: calc(100vh - 75px - 1 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
