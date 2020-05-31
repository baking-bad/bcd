<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-overlay :value="loading" color="data" absolute>
      <v-progress-circular v-if="events.length === 0" indeterminate color="primary" size="64" />
    </v-overlay>
    <div class="d-flex mb-4" v-if="events.length > 0">
      <v-btn :disabled="loading" @click="getEvents(true)" small text class="mr-4 text--secondary">
        <v-icon small class="mr-1">mdi-refresh</v-icon>
        <span>Refresh</span>
      </v-btn>
      <v-btn :disabled="loading" small text class="text--secondary" @click="markAllRead">
        <v-icon small class="mr-1">mdi-check-all</v-icon>
        <span>Mark all as read</span>
      </v-btn>
    </div>
    <v-card flat outlined v-if="events.length > 0">
      <v-list class="pa-0" color="data">
        <template v-for="(item, idx) in events">
          <v-list-item :key="idx" :class="isMarkedRead(item) ? 'read-item' : 'unread-item'">
            <v-row no-gutters align="center">
              <v-col cols="2" class="d-flex align-center justify-space-between pl-2 pr-4">
                <v-icon :color="getIconColor(item.type)">{{ getIcon(item.type) }}</v-icon>
                <span class="body-1">{{ helpers.formatDatetime(item.body.timestamp) }}</span>
              </v-col>
              <v-col cols="3">
                <v-btn
                  text
                  style="text-transform: none;"
                  class="ml-4"
                  :to="`/${item.network}/${item.address}`"
                >
                  <span class="body-1" v-if="item.alias">{{ item.alias }}</span>
                  <span v-else v-html="helpers.shortcut(item.address)"></span>
                </v-btn>
              </v-col>
              <v-col cols="5">
                <template v-if="item.type === 'error' || item.type === 'call' || item.type === 'invoke'">
                  <span v-if="item.body.internal" class="hash font-weight-thin mr-1">internal</span>
                  <span :class="item.type === 'error' ? '' : 'secondary--text'" class="hash mr-1">{{ item.body.entrypoint }}</span>
                  <template v-if="item.type === 'error'">
                    <span class="text--secondary" style="font-size: 20px;">→</span>
                    <span class="body-1 error--text ml-1">{{ item.body.errors[0].title }}</span>
                  </template>
                  <template v-else-if="item.type === 'invoke'">
                    <span class="body-1">
                      <span class="text--secondary font-weight-light mr-1">invoked by</span>
                      <span v-if="item.body.source_alias">{{ item.body.source_alias }}</span>
                      <span v-else v-html="helpers.shortcut(item.body.source)"></span>
                    </span>
                  </template>
                  <template v-else-if="item.type === 'call'">
                    <span class="body-1">
                      <span class="text--secondary font-weight-light mr-1">of</span>
                      <span v-if="item.body.destination_alias">{{ item.body.destination_alias }}</span>
                      <span v-else v-html="helpers.shortcut(item.body.destination)"></span>
                      <span class="text--secondary font-weight-light ml-1">called</span>
                    </span>
                  </template>
                </template>
                <template v-else-if="item.type === 'migration'">
                  <span class="font-weight-light body-1">
                    <span v-if="item.body.kind === 'lambda'">
                      One or more stored
                      <span
                        class="font-weight-regular warning--text"
                      >lambda</span>
                      expressions were
                      <span
                        class="font-weight-regular warning--text"
                      >altered</span>
                    </span>
                    <span v-else-if="item.body.kind === 'update'">
                      Contract code was altered during the <span
                        class="hash font-weight-regular warning--text"
                      >{{ item.body.protocol.slice(0, 8) }}</span> update
                    </span>
                    <span v-else-if="item.body.kind === 'bootstrap'">
                      Contract was originated during the <span
                        class="hash font-weight-regular warning--text"
                      >{{ item.body.protocol.slice(0, 8) }}</span> activation
                    </span>
                  </span>
                </template>
                <template v-else-if="item.type === 'same' || item.type === 'similar'">
                  <span class="font-weight-light body-1">
                    <span
                      class="caption text-uppercase font-weight-regular accent--text"
                    >{{ item.type }}</span> contract was deployed to
                    <span
                      class="caption text-uppercase font-weight-regular"
                    >{{ item.body.network }}</span>
                  </span>
                </template>
                <template v-else-if="item.type === 'deploy'">
                  <span class="font-weight-light body-1">
                    <span
                      class="caption text-uppercase font-weight-regular accent--text"
                    >Deployed</span>
                    new contract to
                    <span
                      class="caption text-uppercase font-weight-regular"
                    >{{ item.body.network }}</span>
                  </span>
                </template>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <template v-if="item.type === 'deploy'">
                  <v-btn
                    class="text--secondary hash"
                    text
                    style="text-transform: none;"
                    :to="`/${item.body.network}/${item.body.destination}`"
                  >
                    <span v-html="helpers.shortcut(item.body.destination)"></span>
                  </v-btn>
                </template>
                <template v-if="item.type === 'same' || item.type === 'similar'">
                  <v-btn
                    class="text--secondary hash"
                    text
                    style="text-transform: none;"
                    :to="`/${item.body.network}/${item.body.address}`"
                  >
                    <span v-html="helpers.shortcut(item.body.address)"></span>
                  </v-btn>
                </template>
                <template
                  v-else-if="item.type === 'error' 
                  || item.type === 'call' 
                  || item.type === 'invoke'
                  || (item.type === 'migration' && item.body.kind === 'lambda')"
                >
                  <v-btn
                    class="text--secondary hash"
                    :to="`/${item.body.network}/opg/${item.body.hash}`"
                    style="text-transform: none;"
                    text
                  >
                    <span v-html="helpers.shortcut(item.body.hash)"></span>
                  </v-btn>
                </template>
                <template
                  v-else-if="(item.type === 'migration' && item.body.kind === 'update')"
                >
                  <v-btn
                    class="text--secondary hash"
                    :to="{name: 'diff', query: {
                      addressA: item.body.address, 
                      networkA: item.body.network, 
                      protocolA: item.body.prev_protocol,
                      levelA: Math.max(0, item.body.level - 4096),
                      addressB: item.body.address,
                      networkB: item.body.network,
                      protocolB: item.body.protocol,
                      levelB: item.body.level
                    }}"
                    text
                  >
                    <span>code diff</span>
                  </v-btn>
                </template>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider v-if="idx != events.length - 1" :key="idx + events.length"></v-divider>
        </template>
      </v-list>
      <span v-intersect="onDownloadPage" v-if="!loading && !downloaded"></span>
    </v-card>
    <EmptyState
      v-if="!loading && events.length === 0"
      icon="mdi-bell-sleep"
      title="Still no events"
      text="Check your settings, or perhaps just nothing happens"
    />
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import { mapActions } from "vuex";
import EmptyState from "@/components/EmptyState.vue";

export default {
  name: "Events",
  components: {
    EmptyState
  },
  data: () => ({
    events: [],
    loading: false,
    downloaded: false
  }),
  created() {
    this.getEvents();
  },
  computed: {
    profile() {
      return this.$store.state.profile;
    }
  },
  methods: {
    ...mapActions(["showError", "showSuccess"]),
    getEvents(force = false) {
      if (!force && (this.loading || this.downloaded)) return;
      this.loading = true;
      const offset = force ? 0 : this.events.length;
      this.api
        .getProfileEvents(offset)
        .then(res => {
          if (force) {
            this.events = res;
          } else {
            this.events.push(...res);
          }
          this.downloaded = res.length == 0;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
          this.downloaded = true;
        })
        .finally(() => (this.loading = false));
    },
    markAllRead() {
      if (this.events.length === 0) return;
      const ts = this.events[0].body.timestamp;

      this.api.profileMarkAllRead(dayjs(ts).unix())
        .then(() => {
          this.showSuccess("All events marked as read");
          this.$store.state.profile.mark_read_at = ts;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
    },
    isMarkedRead(item) {
      return dayjs(item.body.timestamp).unix() <= dayjs(this.profile.mark_read_at).unix()
    },
    getIcon(itemType) {
      const icons = {
        error: "mdi-alert-outline",
        deploy: "mdi-shape-square-plus",
        same: "mdi-shape-square-plus",
        similar: "mdi-shape-square-plus",
        call: "mdi-swap-horizontal",
        invoke: "mdi-swap-horizontal",
        migration: "mdi-source-pull",
        mempool: "mdi-history"
      };
      return icons[itemType];
    },
    getIconColor(itemType) {
      const colors = {
        error: "error",
        deploy: "accent",
        same: "accent",
        similar: "accent",
        call: "secondary",
        invoke: "secondary",
        migration: "warning",
        mempool: "info"
      };
      return colors[itemType];
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getEvents();
      }
    }
  },
  watch: {
    "$store.state.subscriptionChanged": function() {
      this.getEvents(true);
    }
  }
};
</script>

<style scoped>
.read-item {
  background-color: var(--v-canvas-base);
  opacity: .8;
}
</style>
