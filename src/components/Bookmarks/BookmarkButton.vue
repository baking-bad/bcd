<template>
  <div>
    <v-tooltip top v-if="isBookmark || showEmpty">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          small
          :class="customClass"
          :outlined="isTextButton"
          :icon="!isTextButton"
          @click.prevent.stop="bookmarkState"
        >
          <v-icon v-if="showEmpty" :small="isTextButton">{{ isBookmark ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
          <v-icon v-else small>mdi-star</v-icon>
          <span v-if="isTextButton" class="ml-1 text--secondary">{{ isBookmark ? 'Remove bookmark' : 'Add bookmark' }}</span>
        </v-btn>
      </template>
      <span v-if="!isTextButton">{{ isBookmark ? 'Remove bookmark' : 'Add bookmark' }}</span>
    </v-tooltip>
    <BookmarkDialog v-if="showEmpty"
      v-model="openBookMarkDialog"
      :alias="alias || ``"
      :network="network"
      @added="onBookmarkAdded"
    />
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
    address: String,
    network: String,
    alias: String,
    entrypoint: String,
    customClass: String,
    size: String,
    isTextButton: Boolean,
    showEmpty: Boolean,
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
    },
    bookmarkKey() {
      return `${this.network}_${this.address}${this.entrypoint ? '_' + this.entrypoint : ''}`
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
      if (!this.entrypoint) {
        bookmark = {
          network: this.network,
          address: this.address,
          alias: value || this.alias,          
        }
      } else {
        bookmark = {
          network: this.network,
          address: this.address,
          entrypoint: this.entrypoint,
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