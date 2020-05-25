<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-overlay :value="loading" color="data" absolute>
      <v-progress-circular v-if="events.length === 0" indeterminate color="primary" size="64" />
    </v-overlay>
    <div class="d-flex mb-4" v-if="!loading && events.length > 0">
      <v-btn small text class="mr-4 text--secondary">
        <v-icon small class="mr-1">mdi-refresh</v-icon>
        <span>Refresh</span>
      </v-btn>
      <v-btn small text class="text--secondary">
        <v-icon small class="mr-1">mdi-check-all</v-icon>
        <span>Mark all as read</span>
      </v-btn>
    </div>
    <v-card flat outlined v-if="!loading && events.length > 0">
      <v-list class="pa-0" color="data">
        <template v-for="(item, idx) in events">
          <v-list-item :key="idx" two-line :to="getTo(item)">
            <v-list-item-avatar>
              <v-icon :color="getIconColor(item)">{{ getIcon(item) }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="hash grey--text text--darken-2" style="font-size: 0.8em;">
                <div v-if="item.kind==='origination'">
                  <span class="grey--text">{{item.source_alias || item.source}}</span>&nbsp;deployed&nbsp;
                  <span
                    class="grey--text"
                  >{{item.destination_alias || item.destination}}</span>
                </div>
                <div v-else-if="item.kind==='migration'">
                  <span class="grey--text">{{item.source_alias || item.source}}</span>&nbsp;was altered at level&nbsp;
                  <span class="grey--text">{{item.level}}</span>
                </div>
                <div v-else-if="item.kind==='transaction'">
                  Error occured during call&nbsp;
                  <span class="grey--text">{{item.entrypoint}}</span>&nbsp;of&nbsp;
                  <span
                    class="grey--text"
                  >{{item.destination_alias || item.destination}}</span>
                </div>
              </v-list-item-title>
              <v-list-item-subtitle class="overline">{{ item.network}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>{{ item.timestamp | fromNow }}</v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx != events.length - 1" :key="idx + events.length"></v-divider>
        </template>
      </v-list>
      <span v-intersect="onDownloadPage" v-if="!downloaded"></span>
    </v-card>
    <EmptyState 
      v-if="!loading && events.length === 0"
      icon="mdi-bell-sleep"
      title="Still no events"
      text="Check your settings, or perhaps just nothing happens" />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@/components/EmptyState.vue"

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
  methods: {
    ...mapActions(["showError"]),
    getEvents() {
      if (this.loading || this.downloaded) return;
      this.loading = true;
      this.api
        .getProfileTimeline(this.events.length)
        .then(res => {
          this.events.push(...res);
          this.downloaded = res.length < 20;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getIcon(item) {
      if (item.kind === "migration") return "mdi-transfer";
      if (item.kind === "origination") return "mdi-new-box";
      if (item.kind === "transaction") return "mdi-alert-outline";
      return "mdi-new";
    },
    getIconColor(item) {
      if (item.kind === "migration") return "purple";
      if (item.kind === "origination") return "green";
      if (item.kind === "transaction") return "red";
      return "grey";
    },
    getTo(item) {
      if (item.hash) return { name: "opg", params: { hash: item.hash } };
      return null;
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getEvents();
      }
    }
  },
  $route: "getEvents"
};
</script>
