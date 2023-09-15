<template>
  <div>
    <v-btn v-if="mode === 'contract'"
      class="mr-2 pl-2 pr-2 text--secondary"
      outlined
      small
      @click="bookmarkState"
    >
      <v-icon class="text--secondary" small>{{ isBookmark ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
      <span class="ml-1 text--secondary">{{ isBookmark ? 'Remove bookmark' : 'Add bookmark' }}</span>
    </v-btn>

    <v-btn v-else-if="mode === 'entrypoint'"
      icon
      small
      class="mr-5 text--secondary"
      @click="bookmarkState"
    >
      <v-icon>{{ isBookmark ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
      <!-- <v-icon>mdi-star-outline</v-icon> -->
    </v-btn>

    <BookmarkDialog v-model="openBookMarkDialog" :alias="alias || ``" @added="onBookmarkAdded"/>
  </div>
</template>


<script>
import BookmarkDialog from "./BookmarkDialog.vue";

export default {
  name: "BookmarkButton",
  components: {
    BookmarkDialog,
  },
  props: {
    mode: String,
    bookmarkKey: String,
    address: String,
    network: String,
    alias: String,
  },
  data: () => ({
    items: {},
    showList: false,
    isBookmark: false,
    openBookMarkDialog: false,
  }),
  created() {
    this.bookmarks.registerObserver(this.onBookmarkStateChanged);
    this.detectBookmark();
  },
  computed: {
    keysCount() {
        return Object.keys(this.items).length;
    }
  },
  methods: {
    bookmarkState() {
      if (this.isBookmark) {
        this.bookmarks.remove(this.bookmarkKey);
      } else {
        this.openBookMarkDialog = !this.openBookMarkDialog;
        this.name = this.alias || "";
        
      }
    },
    detectBookmark() {
      let bookmarks = this.bookmarks.getAll();
      this.isBookmark = bookmarks[this.bookmarkKey] !== undefined;
    },
    onBookmarkStateChanged(event, key) {
      if (this.bookmarkKey !== key) {
        return;
      }
      if (event === 'remove') {
        this.isBookmark = false;
      } else {
        this.isBookmark = true;
      }
    },
    onBookmarkAdded(value) {
      let bookmark = {}
      if (this.mode === 'contract') {
        bookmark = {
          network: this.network,
          address: this.address,
          alias: value || this.alias,          
        }
      } else if (this.mode === 'entrypoint') {
        bookmark = {
          network: this.network,
          address: this.address,
          entrypoint: this.alias,
          alias: value || this.alias,          
        }
      }
      this.bookmarks.add(this.bookmarkKey, bookmark);
      this.openBookMarkDialog = false;
    },
  }
}
</script>


<style scoped>
</style>