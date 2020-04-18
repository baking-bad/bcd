<template>
  <v-menu
    v-model="expanded"
    left
    offset-x
    :close-on-click="false"
    :close-on-content-click="false"
    style="max-width: 400px;"
    class="transparent"
    :min-width="400"
    :nudge-left="10"
    :nudge-top="2"
    :z-index="10"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon @click="expanded = !expanded" v-on="on">
        <v-icon :color="expanded ? 'primary': ''">mdi-magnify</v-icon>
      </v-btn>
    </template>

    <template v-show="expanded">
      <SearchBox :expandable="true" />
    </template>

  </v-menu>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";

export default {
  name: "ExpandableSearch",
  components: {
    SearchBox
  },
  data: () => ({
    expanded: false
  }),
  watch: {
    '$route.params': function () {
        this.expanded = false;
    }
  }
};
</script>
