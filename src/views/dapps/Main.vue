<template>
  <div class="fill-height canvas">
    <div>
      <v-toolbar flat class color="toolbar" height="75">
        <v-toolbar-title class="headline">
          <router-link style="text-decoration: none; color: inherit;" to="/dapps">
        <span class="font-weight-light">
          Tezos
          <span class="font-weight-regular">DApps</span>
        </span>
          </router-link>
        </v-toolbar-title>
      </v-toolbar>
      <v-container style="max-width: 1280px">
          <v-card-text class="d-flex flex-column align-center justify-center">
            <v-img :src="imageName" max-height="300" contain></v-img>
            <div class="information font-weight-regular mt-2">
            <span>
              The Dapps store is permanently moved to tzkt.<br/>
              All information and statistics about dapps can be found
              <a
                  style="text-decoration: none"
                  target="_blank"
                  rel="noopener"
                  href="https://tzkt.io/dapps"
              >here</a>
            </span>
            </div>
          </v-card-text>
      </v-container>
    </div>
  </div>
</template>

<script>
const images = require.context('@/assets/', false, /\.png$/)

export default {
  name: "MainDApp",
  computed: {
    imageName() {
      if (this.$vuetify.theme.isDark) return images('./api_relocate_dark.png');
      return images('./api_relocate_light.png');
    }
  }
};
</script>

<style scoped>
.information {
  width: 650px;
  font-style: normal;
  font-size: 20px;
  line-height: 160%;
  text-align: center;
  color: #959595;
}
</style>