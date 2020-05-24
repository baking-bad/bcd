<template>
  <v-expansion-panel class="bl-1 br-1 bt-1 bmd-panel" active-class="bmd-active-panel">
    <v-expansion-panel-header v-if="!single" class="px-4 pb-0 pt-1" ripple>
      <v-row no-gutters>
        <v-col cols="8" class="d-flex align-center justify-start text-truncate">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="hash">{{ diff.data.key_string }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="hash font-weight-light"
              >{{ helpers.plural(diff.count, 'update') }}</v-list-item-title>
              <v-list-item-subtitle class="hash error--text" v-if="!diff.data.value">removed</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="hash font-weight-light"
              >{{ diff.data.timestamp | formatDate }}</v-list-item-title>
              <v-list-item-subtitle class="hash font-weight-light">level {{ diff.data.level }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="pl-1 pt-2">
      <v-row no-gutters>
        <v-col cols="8">
          <v-list-item class="pl-1">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Key hash</v-list-item-subtitle>
              <v-list-item-title class="key-hash">{{ diff.data.key_hash }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <v-btn
            v-if="!single"
            class="mr-4"
            small
            text
            :to="{
              name: 'big_map_history', 
              params: {
                network: network,
                address: address,
                ptr: ptr,
                keyhash: diff.data.key_hash
              }
            }"
          >
            <v-icon small class="mr-1">mdi-history</v-icon>
            <span>View history</span>
          </v-btn>
          <v-btn small text @click="showRaw = true">
            <v-icon small class="mr-1">mdi-code-braces</v-icon>
            <span>Raw JSON</span>
          </v-btn>
        </v-col>
        <v-col cols="12" class="bmd px-2 py-4 my-2 ba-1">
          <span class="overline ml-3">Key</span>
          <MiguelTreeView :miguel="diff.data.key" :network="network" openAll />   
        </v-col>
        <v-col cols="12" class="bmd px-2 py-4 my-2 ba-1" v-if="diff.data.value">
          <span class="overline ml-3">Value</span>
          <MiguelTreeView :miguel="diff.data.value" :network="network" openAll />         
        </v-col>
      </v-row>
    </v-expansion-panel-content>
    <RawJsonViewer
      v-if="diff"
      :show.sync="showRaw"
      type="big_map"
      :network="network"
      :level="diff.data.level"
      :address="address"
      :ptr="ptr"
      :keyhash="diff.data.key_hash"
    />
  </v-expansion-panel>
</template>

<script>
import RawJsonViewer from "@/components/RawJsonViewer.vue"
import MiguelTreeView from "@/components/MiguelTreeView.vue";

export default {
  name: "BigMapDiff",
  components: {
    MiguelTreeView,
    RawJsonViewer
  },
  props: {
    ptr: String,
    diff: Object,
    network: String,
    address: String,
    single: Boolean
  },
  data: () => ({
    showRaw: false
  })
};
</script>

<style lang="scss" scoped>
.key-hash {
  font-size: 14px;
  font-family: "Roboto Mono", monospace;
}

.bmd-panel {
  background-color: var(--v-data-base) !important;
}

.bmd-panel > .v-expansion-panel-header {
  background: var(--v-data-base);
}

.bmd-active-panel > .v-expansion-panel-header {
  background: var(--v-sidebar-base);
  opacity: 0.8;
}

.bmd-active-panel,
.bmd-panel.v-expansion-panel--next-active {
  border-bottom: 1px solid var(--v-border-base);
}
</style>
