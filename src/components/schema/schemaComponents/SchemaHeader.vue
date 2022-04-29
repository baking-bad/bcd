<template>
  <h2 class="d-flex justify-space-between font-weight-regular px-6">
    <div>
      <span class="hash">Interact: </span>
      <span class="accent--text">{{ storageName }}</span>
    </div>
    <div>
      <router-link text :to="`/${network}/${address}`" color="transparent" class="px-0 no-decoration">
        <span class="secondary--text text-almost-medium">{{ alias ? alias : shortcutOnly(address) }}</span>
      </router-link>
      <v-btn
        x-small
        icon
        class="ml-2"
        @click="
        () => {
          $clipboard(address);
          showClipboardOK();
        }
      ">
        <v-icon class="text--secondary">mdi-content-copy</v-icon>
      </v-btn>
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
  }
}
</script>
