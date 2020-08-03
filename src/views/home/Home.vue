<template>
  <v-container class="fill-height canvas" fluid>
    <HomeToolbar />
    <v-row no-gutters style="height:calc(100% - 64);">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center primary--text">
            <span style="font-family: Script1-Casual; font-size: 72px;">Better Call Dev</span>
          </v-col>
        </v-row>
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" lg="6" xl="4">
            <SearchBox />
          </v-col>
          <v-col cols="12" align="center">
            <v-btn
              large
              depressed
              color="border"
              class="text--secondary mr-5"
              to="/search"
            >Advanced Search</v-btn>
            <v-btn
              large
              depressed
              color="border"
              class="text--secondary"
              :loading="pickingRandom"
              @click="pickRandom"
            >Pick Random</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-fade-transition>
      <v-row justify="center" v-show="stats.length > 0">
        <v-col cols="6">
          <v-row
            class="caption font-weight-medium text-uppercase text-right text--secondary"
            no-gutters
          >
            <v-col class="pl-12"></v-col>
            <v-col>Unique contracts</v-col>
            <v-col>
              <router-link
                style="text-decoration: none;"
                :to="`/stats/mainnet/fa12`"
              >
                <span class="secondary--text">FA tokens</span>
              </router-link>
            </v-col>
            <v-col>Contract calls</v-col>
            <v-col class="text-left pl-12">Synced</v-col>
          </v-row>
          <v-row
            v-for="(item, idx) in stats"
            :key="idx"
            class="text-right my-2"
            justify="center"
            align="center"
            no-gutters
          >
            <v-col class="text-left pl-12">
              <v-btn
                small
                text
                :to="`/stats/${item.network}/general`"
                :class="item.network === 'mainnet' ? 'secondary--text' : 'text--primary'"
              >
                <span>{{ item.network }}</span>
              </v-btn>
            </v-col>
            <v-col>{{ item.unique_contracts }}</v-col>
            <v-col>{{ item.fa_count }}</v-col>
            <v-col>{{ item.contract_calls }}</v-col>
            <v-col class="body-2 text-left pl-12">{{ helpers.formatDatetime(item.time) }}</v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-fade-transition>

    <v-footer
      color="transparent"
      absolute
      bottom
      class="d-flex justify-center align-center text--disabled"
      style="z-index: 0"
    >
      <span class="overline">Tezos smart contract explorer by </span>
      <v-btn small text href="https://baking-bad.org/docs" target="_blank" class="text--secondary mb-1 ml-1 pa-1">
        <span>Baking Bad</span>
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import HomeToolbar from "@/views/home/HomeToolbar.vue";
import SearchBox from "@/components/SearchBox.vue";

export default {
  name: "Home",
  components: {
    HomeToolbar,
    SearchBox
  },
  data: () => ({
    webSocket: null,
    stats: [],
    connecting: true,
    pickingRandom: false
  }),
  mounted() {
    if (this.$route.name != this.config.HOME_PAGE) {
      this.$router.push({ path: this.config.HOME_PAGE });
    }
  },
  created() {
    this.webSocket = new WebSocket(this.config.WS_URI);
    this.webSocket.onmessage = this.onMessage;
    this.webSocket.onopen = this.onOpen;
    this.webSocket.onclose = this.onClose;
    this.webSocket.onerror = this.onError;
  },
  beforeRouteLeave(to, from, next) {
    if (this.webSocket && this.webSocket.readyState === 1) {
      this.webSocket.send(
        JSON.stringify({
          action: "unsubscribe",
          channel: "stats"
        })
      );
    }
    next();
  },
  methods: {
    ...mapActions(["showError"]),
    pickRandom() {
      if (this.pickingRandom) return;
      this.pickingRandom = true;
      this.api
        .getRandomContract()
        .then(res => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch(err => {
          if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        })
        .finally(() => {
          this.pickingRandom = false;
        });
    },
    onMessage(event) {
      let data = JSON.parse(event.data);
      if (data.body) {
        this.stats = data.body.sort(function(a, b) {
          if (a.network === "mainnet" || b.network === "zeronet") {
            return -1;
          } else if (b.network === "mainnet" || a.network === "zeronet") {
            return 1;
          } else {
            return b.network.localeCompare(a.network);
          }
        });
      }
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

<style lang="scss">
@font-face {
  font-family: "Script1-Casual";
  src: url("/fonts/script1-script-casual-normal.ttf");
}
</style>
