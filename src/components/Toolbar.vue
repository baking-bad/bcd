<template>
  <div>
    <v-app-bar app flat class="toolbar-expanded">
      
      <SearchBox :toolbar="true" />

      <v-divider vertical></v-divider>
      <v-btn
        href="https://twitter.com/tezosbakingbad"
        target="_blank"
        width="64"
        height="64"
        text
        tile
        color="primary"
      >
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
        width="64"
        height="64"
        text
        tile
        color="primary"
        href="https://github.com/baking-bad/better-call-dev/"
        target="_blank"
      >
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";

export default {
  name: "Toolbar",
  components: {
    SearchBox
  }
};
</script>

<style lang="scss" scoped>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
.toolbar-expanded {
  border-bottom: 1px solid lightgrey;
}
</style>

<style>
.v-toolbar__content,
.v-toolbar__extension {
  padding: 0;
}
</style>