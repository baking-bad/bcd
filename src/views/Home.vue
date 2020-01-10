<template>
  <v-container id="home" fluid>
    <v-row no-gutters style="height:calc(100% - 64); margin-top:10rem">
      <v-col cols="12">
        <v-row justify="center" no-gutters>
          <img
            width="300"
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/9bacdc23957341.5632ba9070591.jpg"
          />
        </v-row>
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" lg="6" xl="4">
            <SearchBox />
          </v-col>
          <v-col cols="12" align="center">
            <v-btn large depressed tile color="primary" class="mr-5">Search</v-btn>
            <v-btn large outlined tile color="primary">Pick Random</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";

export default {
  components: {
    SearchBox
  }
};
</script>

<style lang="scss">
#home {
  height: 100%;
  background-color: white;
}
</style>
