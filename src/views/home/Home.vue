<template>
  <v-container class="fill-height canvas" fluid>
    <HomeToolbar /> 
    <v-row no-gutters style="height:calc(100% - 64);">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center primary--text">
            <span style="font-family: Script1-Casual; font-size: 72px;">
              Better Call Dev
            </span>
          </v-col>
        </v-row>
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" lg="6" xl="4">
            <SearchBox />
          </v-col>
          <v-col cols="12" align="center">
            <v-btn large depressed color="border" class="text--secondary mr-5" to="/search">
              Advanced Search
            </v-btn>
            <v-btn large depressed color="border" class="text--secondary" @click="pickRandom">
              Pick Random
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <!-- <v-col>
        <NetworkStats />
      </v-col> -->
      <v-col cols="6">
        <v-row class="caption font-weight-medium text-uppercase text-center secondary--text" no-gutters>
          <v-col></v-col>
          <v-col>Unique contracts</v-col>
          <v-col>Contract calls</v-col>
          <v-col>FA tokens</v-col>
          <v-col>Total locked</v-col>
          <v-col>Total volume</v-col>
        </v-row>
        <v-row class="caption font-weight-medium text-uppercase text-center secondary--text" no-gutters>
          <v-col>Mainnet</v-col>
          <v-col>203</v-col>
          <v-col>12324</v-col>
          <v-col>12</v-col>
          <v-col>123,131,232.123456</v-col>
          <v-col>123,131,232.123456</v-col>
        </v-row>
      </v-col>      
    </v-row>

    <v-footer color="transparent" absolute bottom class="d-flex justify-center ml-6" style="z-index: 0">
      <v-btn x-small text href="https://baking-bad.org/docs" target="_blank" class="text--secondary">
        <span>Baking Bad</span>
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import HomeToolbar from "@/views/home/HomeToolbar.vue"
import SearchBox from "@/components/SearchBox.vue";
// import NetworkStats from "@/components/NetworkStats.vue";

export default {
  components: {
    HomeToolbar,
    SearchBox,
    // NetworkStats
  },
  mounted() {
    if (this.$route.name != this.config.HOME_PAGE) {
      this.$router.push({ path: this.config.HOME_PAGE });
    }
  },
  methods: {
    ...mapActions(["showError"]),
    pickRandom() {
      this.api.getRandomContract()
        .then(res => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch(err => {
          if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        });
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Script1-Casual";
  src: url("/fonts/script1-script-casual-normal.ttf");
}

@font-face {
  font-family: "Dancing-Script";
  src: url("/fonts/DancingScript-Regular.otf");
}

#home {
  height: 100%;
  background-color: white;
}

.hash {
  font-family: "Roboto Mono", monospace;
}

.logo {
  max-height: 350px;
}
</style>
