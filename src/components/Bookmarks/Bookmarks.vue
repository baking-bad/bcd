<template>
    <v-menu offset-y max-height="500" max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="btn-class text--secondary" icon v-bind="attrs" v-on="on" @click="updateBookmarks">
            <v-icon v-if="keysCount > 0">mdi-star</v-icon>
            <v-icon v-else>mdi-star-outline</v-icon>
        </v-btn>
      </template>
      <v-list v-if="keysCount > 0" class="pa-0">
        <v-list-item v-for="(item, index) in items" :key="index" :to="getItemLink(item)">
            <v-list-item-content>
                <v-list-item-title>{{ item.alias || item.address }}</v-list-item-title>
                <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-btn icon @click.prevent="removeBookmark(index)">
                    <v-icon color="primary">mdi-star</v-icon>
                </v-btn>
            </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
            <span class="text--secondary">You don't have favorite accounts yet. Add them by clicking on ⭐️ on the account page or on the Interact tab.</span>
        </v-list-item>
      </v-list>
    </v-menu>
</template>


<script>
export default {
  name: "Bookmarks",
  data: () => ({
    items: {},
    showList: false
  }),
  computed: {
    keysCount() {
        return Object.keys(this.items).length;
    }
  },
  created() {
    this.bookmarks.registerObserver(this.onStatusChanged)
    this.updateBookmarks();
  },
  methods: {
    removeBookmark(key) {
        this.bookmarks.remove(key);
        delete this.items[key];
        this.updateBookmarks();
    },
    updateBookmarks() {
        this.items = this.bookmarks.getAll();
    },
    onStatusChanged() {
        this.updateBookmarks();
    },
    getItemLink(item) {
        return `/${item.network}/${item.address}${item.entrypoint ? '/interact/' + item.entrypoint : ''}`;
    },
  }
}
</script>


<style scoped>
</style>