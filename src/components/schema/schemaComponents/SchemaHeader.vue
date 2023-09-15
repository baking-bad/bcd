<template>
  <h2 class="d-flex justify-space-between align-center font-weight-regular px-6">
    <div>
      <span class="hash">{{ header }}</span>
      <span class="accent--text">{{ isForkPage ? (alias || shortcutOnly(address)) : storageName }}</span>
    </div>
    <BookmarkButton v-if="isInteractPage"
      :key="network + '_' + address + '_' + storageName"
      :mode="'entrypoint'"
      :bookmarkKey="network + '_' + address + '_' + storageName"
      :network="network"
      :address="address"
      :alias="storageName"
    />
  </h2>
</template>

<script>
import { shortcutOnly } from "../../../utils/tz";
import {mapActions} from "vuex";
import BookmarkButton from "../../Bookmarks/BookmarkButton.vue";

export default {
  name: "SchemaHeader",
  components: {
    BookmarkButton,
  },
  props: {
    isStorage: Boolean,
    storageHtml: String,
    storageName: String,
    title: String,
    address: String,
    alias: String,
    network: String,
  },
  data: () => ({
    page: '',
  }),
  created() {
    this.setPage();
  },
  computed: {
    isForkPage() {
      return this.page === 'fork';
    },
    isInteractPage() {
      return this.page === 'interact';
    },
    header() {
      if (this.page === 'fork') {
        return 'Fork: ';
      }
      if (this.page === 'deploy') {
        return 'Deploy';
      }
      return 'Interact: '
    }
  },
  methods: {
    ...mapActions(["showClipboardOK"]),
    shortcutOnly,

    setPage() {
      if (this.$route.name === 'fork') {
        this.page = 'fork';
      } else if (this.$route.name === 'deploy') {
        this.page = 'deploy';
      } else {
        this.page = 'interact';
      }
    },
  },
  watch: {
    $route() {
      this.setPage()
    },
  },
}
</script>
