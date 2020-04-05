<template>
  <v-container fluid>
    <v-list v-if="timeline" class="elevation-2 py-0">
      <template v-for="(item, idx) in timeline">
        <v-list-item :key="idx" two-line :to="getTo(item)">
          <v-list-item-avatar>
            <v-icon :color="getIconColor(item)">{{ getIcon(item) }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="hash grey--text text--darken-2" style="font-size: 0.8em;">
              <div v-if="item.kind==='origination'">
                <span class="grey--text">{{item.source}}</span>&nbsp;deployed&nbsp;
                <span class="grey--text">{{item.destination}}</span>
              </div>
              <div v-else-if="item.kind==='migration'">
                <span class="grey--text">{{item.source}}</span>&nbsp;was altered at level&nbsp;
                <span class="grey--text">{{item.level}}</span>
              </div>
              <div v-else-if="item.kind==='transaction'">
                Error occured during call&nbsp;
                <span class="grey--text">{{item.entrypoint}}</span>&nbsp;of&nbsp;
                <span class="grey--text">{{item.destination}}</span>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle class="overline">{{ item.network}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>{{ item.timestamp | fromNow }}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider inset v-if="idx != timeline.length - 1" :key="idx + timeline.length"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import { getProfileTimeline } from "@/api/profile.js";

export default {
  name: "Timeline",
  created() {
    this.getTimeline();
  },
  data: () => ({
    timeline: null,
    loading: true
  }),
  methods: {
    getTimeline() {
      getProfileTimeline()
        .then(res => {
          this.timeline = res;
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
      if (item.hash)
        return { name: "opg", params: { hash: item.hash } };
      return null;
    }
  },
  watch: {
    $route: "getTimeline"
  }
};
</script>