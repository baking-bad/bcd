<template>
  <v-tooltip
    :top="top"
    :bottom="bottom"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        :icon="!text"
        :class='classOfShareLink'
        @click="openNativeSharing"
        :outlined="!!text"
        :small="!!text"
      >
        <v-icon class="text--secondary" :small="!!text">mdi-share-variant</v-icon>
        <span v-if="!!text" class="ml-1 text--secondary">
          Share
        </span>
      </v-btn>
    </template>
    Share link
  </v-tooltip>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ShareLink",
  props: {
    top: Boolean,
    bottom: Boolean,
    alias: String,
    link: String,
    text: Boolean,
  },
  computed: {
    classOfShareLink() {
      return `text--secondary ${this.text ? 'pl-2 pr-2' : ''}`;
    }
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    openNativeSharing() {
      if (navigator.share) {
        navigator.share({
          title: this.alias,
          url: this.link
        });
      } else {
        this.$clipboard(this.link);
        this.showClipboardOK();
      }
    }
  }
}
</script>