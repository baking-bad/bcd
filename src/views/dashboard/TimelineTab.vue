<template>
  <v-container>
    <v-list v-if="timeline" max-width="1280">
      <template v-for="(item, idx) in timeline">
        <v-list-item :key="idx">
          <v-list-item-avatar>
            <v-icon :color="getIconColor(item)">{{ getIcon(item) }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="hash grey--text text--darken-2">
              <div v-if="item.kind==='origination'">
                <span class="grey--text">{{item.source}}</span>&nbsp;deployed&nbsp;
                <span class="grey--text">{{item.destination}}</span>
              </div>
              <div v-else-if="item.entrypoint">
                <span class="grey--text">{{item.source}}</span>&nbsp;calls&nbsp;
                <span class="grey--text">{{item.entrypoint}}</span>
              </div>
              <div v-else-if="item.kind==='transaction'">
                <span class="grey--text">{{item.source}}</span>&nbsp;sent&nbsp;
                <span class="grey--text">{{item.amount | uxtz}}</span>&nbsp;to&nbsp;
                <span class="grey--text">{{item.destination}}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>{{ item.timestamp | fromNow }}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="idx != timeline.length - 1" :key="idx + timeline.length"></v-divider>
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
      if (item.kind === "origination") return "mdi-new-box";
      if (item.entrypoint) return "mdi-play-speed";
      if (item.kind === "transaction") return "mdi-swap-horizontal";
      return "mdi-new";
    },
    getIconColor(item) {
      if (item.kind === "origination") return "green";
      if (item.entrypoint) return "primary";
      if (item.kind === "transaction") return "blue";
      return "grey";
    }
  },
  watch: {
    $route: "getTimeline"
  }
};
</script>