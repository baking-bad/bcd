<template>
  <v-expansion-panel class="bl-1 br-1 bt-1 bmd-panel" active-class="bmd-active-panel" @change="onPanelStateChanged">
    <v-expansion-panel-header v-if="!single" class="pa-0 pr-4" :class="is_active ? 'item-header-applied' : 'item-header-failed'">
      <v-row no-gutters class="big-map-row">
        <v-col cols="10" class="d-flex align-center justify-start text-truncate">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="hash">
                <span>{{ name || key_hash }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" class="d-flex align-center text-truncate">
          <v-list-item class="pl-0">
            <v-list-item-content>
              <v-list-item-title
                class="hash font-weight-light"
              >{{ timestamp | formatDate }}</v-list-item-title>
              <v-list-item-subtitle class="hash font-weight-light">{{ is_active ? 'active' : 'removed' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-skeleton-loader v-if="loading" :loading="loading" type="article" transition="fade-transition"/>
        <v-row no-gutters class="py-2 pr-7 pl-1" v-else>
          <v-col cols="8">
            <v-list-item class="pl-1">
              <v-list-item-content>
                <v-list-item-subtitle class="overline">Key hash</v-list-item-subtitle>
                <v-list-item-title class="d-flex align-center">
                  <span>
                    {{ key_hash }}
                  </span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        icon
                        class="mr-2"
                        @click="
                          () => {
                            $clipboard(key_hash);
                            showClipboardOK();
                          }
                        "
                      >
                        <v-icon small class="text--secondary">mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                    Copy key hash
                  </v-tooltip>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="d-flex align-center justify-end">
            <v-btn
              v-if="!single"
              small
              text
              :to="{
                name: 'big_map_history',
                params: {
                  network: network,
                  address: address,
                  ptr: ptr,
                  keyhash: key_hash
                }
              }"
            >
              <v-icon small class="mr-1">mdi-history</v-icon>
              <span>View history</span>
            </v-btn>
            <portal to="storage-actions">
              <v-btn v-if="diff.value" class="mr-4 cursor-pointer" small text @click="showRaw = true">
                <v-icon small class="mr-1">mdi-code-braces</v-icon>
                <span>Raw JSON</span>
              </v-btn>
            </portal>
          </v-col>
          <v-col cols="12" class="px-2 py-4 my-2 ba-1">
            <span class="overline ml-3">Key</span>
            <MiguelTreeView :miguel="diff.key" :network="network" openAll />
          </v-col>
          <v-col cols="12" class="px-2 py-4 my-2 ba-1" v-if="diff.value">
            <span class="overline ml-3">Value</span>
            <MiguelTreeView :miguel="diff.value" :network="network" openAll />
          </v-col>
        </v-row>
    </v-expansion-panel-content>
    <RawJsonViewer
      v-if="diff"
      :show.sync="showRaw"
      type="big_map"
      :network="network"
      :level="diff.last_update_level"
      :address="address"
      :ptr="ptr"
      :keyhash="key_hash"
    />
  </v-expansion-panel>
</template>

<script>
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue"
import MiguelTreeView from "@/components/MiguelTreeView.vue";
import {mapActions} from "vuex";
import { shortcutOnly } from "../../utils/tz";

export default {
  name: "BigMapDiff",
  components: {
    MiguelTreeView,
    RawJsonViewer
  },
  props: {
    ptr: String,
    key_hash: String,
    name: String,
    network: String,
    address: String,
    is_active: Boolean,
    timestamp: String,
    single: Boolean,
    value: Object
  },
  data: () => ({
    showRaw: false,
    diff: null,
    loading: true
  }),
  created() {
    if (this.value) {
      this.diff = this.value;
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    shortcutOnly,

    onPanelStateChanged() {
      if (this.diff === null) {
        this.loadDiff();
      }
    },

    loadDiff() {
      this.api.getBigMapKeyState(this.network, this.ptr, this.key_hash)
        .then(state => this.diff = state)
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(()=> this.loading = false)
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.diff = newValue;
        this.loading = false;
      }
    }
  }
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

.big-map-row {
  max-width: calc(100% -  3em - 10px);
}

.v-expansion-panel-content__wrap {
  padding: 0px !important;
}
</style>
