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
      :loading="!bigmap.address"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <v-expansion-panels flat tile mandatory active-class="opened-panel">
        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Details</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="bigmap-sidebar-list">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Status</v-list-item-subtitle>
                  <v-list-item-title class="caption text-uppercase">
                    <span v-if="removed" class="error--text">Removed</span>
                    <span v-else>Allocated</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Active / total keys</v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    <span>{{ bigmap.active_keys }} / {{ bigmap.total_keys }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <AccountBox
                title="Owner contract"
                :address="bigmap.address"
                :alias="bigmap.contract_alias"
                :network="network"
                gutters
              />
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1" v-if="actions.length > 0">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Actions</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="bigmap-sidebar-list">
              <template v-for="(item, idx) in actions">
                <v-divider v-if="idx > 0" :key="'divider' + idx"></v-divider>
                <v-list-item :key="idx">
                  <v-list-item-content>
                    <v-list-item-title class="hash">
                      <span class="mr-2">{{ item.action }}</span>
                      <template v-if="item.action == 'copy'">
                        <span
                          class="text--secondary font-weight-light"
                          v-if="item.destination_ptr"
                        >to</span>
                        <span 
                          class="text--secondary font-weight-light" 
                          v-else-if="item.source_ptr"
                        >from</span>
                      </template>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <span class="overline">{{ helpers.formatDatetime(item.timestamp) }}</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-if="item.action == 'copy'">
                      <v-btn
                        :to="`/${network}/big_map/${item.destination_ptr}`"
                        class="text--primary"
                        text
                        small
                        v-if="item.destination_ptr"
                      >
                        <v-icon small class="mr-1 text--secondary">mdi-link-variant</v-icon>
                        Big Map {{ item.destination_ptr }}
                      </v-btn>
                      <v-btn
                        :to="`/${network}/big_map/${item.source_ptr}`"
                        class="text--primary"
                        text
                        small
                        v-else-if="item.source_ptr"
                      >
                        <v-icon small class="mr-1 text--secondary">mdi-link-variant</v-icon>
                        Big Map {{ item.source_ptr }}
                      </v-btn>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Type</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content
            v-if="bigmap"
            color="data"
            class="hash"
            style="font-size: 12px;"
          >
            <div v-for="(def, i) in bigmap.typedef" :key="i" class="ma-4">
              <span v-if="i === 0"></span>
              <span v-else-if="def.name" class="font-weight-light">{{ def.name }}&nbsp;</span>
              <span class="tree--text" v-html="highlightType(def.type)"></span>
              <div v-for="(arg, j) in def.args" :key="i + j" class="pl-4">
                <span>{{ arg.key }}&nbsp;</span>
                <span class="tree--text" v-html="highlightType(arg.value)"></span>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>

    <BakingBadFooter />
  </div>
</template>

<script>
import AccountBox from "@/components/AccountBox.vue";
import BakingBadFooter from "@/components/BakingBadFooter.vue";
import { mapActions } from "vuex";

export default {
  name: "SideBar",
  components: {
    AccountBox,
    BakingBadFooter
  },
  props: {
    ptr: String,
    network: String,
    bigmap: Object
  },
  data: () => ({
    actions: []
  }),
  computed: {
    removed() {
      return this.actions.some(item => item.action === "remove");
    }
  },
  created() {
    this.getBigMapActions();
  },
  methods: {
    ...mapActions(["showError"]),
    getBigMapActions() {
      this.api
        .getContractBigMapActions(this.network, this.ptr)
        .then(res => {
          if (!res) return;
          this.actions = res.items;
        })
        .catch(err => {
          console.log(err);
          if (err.code !== 204) {
            this.showError(err);
          }
        });
    },
    highlightType(expr) {
      return expr.replace(/(\$\w+)/g, '<span class="accent--text">$1</span>');
    }
  },
  watch: {
    ptr: 'getBigMapActions'
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
  max-height: calc(100vh - 75px - 3 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
