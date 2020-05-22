<template>
  <v-skeleton-loader :loading="connecting" type="image">
    <v-item-group>
      <v-container>
        <v-row justify="space-around">
          <v-col v-for="(item, idx) in stats" :key="idx" cols="3">
            <v-item>
              <v-card flat class="data">
                <v-card-title class="d-flex align-center justify-center">
                  <span class="caption font-weight-medium text-uppercase">{{ item.network }}</span>
                </v-card-title>
                <!-- <v-card-subtitle>
                  <div>
                    <span
                      class="text-lowercase d-inline-block text-truncate"
                      style="max-width:100%"
                    >
                      Level
                      <span class="font-weight-bold">{{ item.level }}</span>
                      ({{ item.time | fromNow }})
                    </span>
                    <span
                      class="caption hash d-inline-block text-truncate"
                      style="max-width:100%"
                    >{{ item.protocol }}</span>
                  </div>
                </v-card-subtitle> -->
                <v-card-text>
                  <v-list class="pa-0">
                    <v-list-item class="pa-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-subtitle class="caption">Unique contracts</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{ item.unique_contracts}}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pa-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-subtitle class="caption">FA tokens</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{ item.fa_count}}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pa-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-subtitle class="caption">Total contracts balance</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{ item.total_balance | uxtz }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pa-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-subtitle class="caption">Total withdrawn</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{ item.total_withdrawn | uxtz }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: "NetworkStats",
  data: () => ({
    websocket: null,
    stats: [],
    connecting: true
  }),
  created() {
    this.webSocket = new WebSocket("ws://127.0.0.1:14000/ws");
    this.webSocket.onmessage = this.onMessage;
    this.webSocket.onopen = this.onOpen;
    this.webSocket.onclose = this.onClose;
    this.webSocket.onerror = this.onError;
  },
  beforeRouteLeave() {
    this.webSocket.send(
      JSON.stringify({
        action: "unsubscribe",
        channel: "stats"
      })
    );
  },
  methods: {
    onMessage(event) {
      let data = JSON.parse(event.data);
      this.stats = data.body;
    },
    onError(event) {
      console.log("error: ", event.data);
    },
    onOpen() {
      this.webSocket.send(
        JSON.stringify({
          action: "subscribe",
          channel: "stats"
        })
      );
      this.connecting = false;
    },
    onClose(event) {
      console.log("close: ", event.data);
    }
  }
};
</script>