<template>
  <v-container id="home" fluid>
    <v-row no-gutters style="height:calc(100% - 64);">
      <v-col cols="12">
        <v-row justify="center" no-gutters>
          <img class="logo"
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/9bacdc23957341.5632ba9070591.jpg"
          />
        </v-row>
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" lg="6" xl="4">
            <SearchBox :expandable="false" />
          </v-col>
          <v-col cols="12" align="center">
            <v-btn large depressed tile color="primary" class="mr-5" to="/search">Advanced Search</v-btn>
            <v-btn large outlined tile color="primary" @click="pickRandom">Pick Random</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import SearchBox from "@/components/SearchBox.vue";

export default {
  components: {
    SearchBox
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
          console.log(err);
          this.showError(err);
        });
    }
  }
};
</script>

<style lang="scss">
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
