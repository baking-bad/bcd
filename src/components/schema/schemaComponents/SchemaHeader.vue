<template>
  <h2 class="d-flex justify-space-between align-center font-weight-regular px-6">
    <div>
      <span class="hash">{{ isForkPage ? 'Fork: ' : 'Interact: '}}</span>
      <span class="accent--text">{{ isForkPage ? (alias || shortcutOnly(address)) : storageName }}</span>
    </div>
  </h2>
</template>

<script>
import { shortcutOnly } from "../../../utils/tz";
import {mapActions} from "vuex";

export default {
  name: "SchemaHeader",
  props: {
    isStorage: Boolean,
    storageHtml: String,
    storageName: String,
    title: String,
    address: String,
    alias: String,
    network: String,
  },
  methods: {
    ...mapActions(["showClipboardOK"]),
    shortcutOnly,
  },
  computed: {
    isForkPage() {
      return this.$route.name === 'fork';
    }
  },
}
</script>
