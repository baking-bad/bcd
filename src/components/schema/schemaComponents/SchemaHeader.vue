<template>
  <h2 class="ml-6 font-weight-regular">
    <p class="mr-2 hash mb-1">
      <span class="font-weight-thin">Interact with</span>
      &nbsp;
      <router-link text :to="`/${network}/${address}`" color="transparent" class="px-0 no-decoration">
        <span class="secondary--text">{{ shortcutOnly(address) }}</span>
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
    </p>
    <span class="mr-2 hash font-weight-thin text-almost-medium">{{ title }}</span>
    <span v-if="isStorage" class="accent--text text-almost-medium" v-html="storageHtml"></span>
    <span v-else class="hash accent--text text-almost-medium">{{ storageName }}</span>
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
    network: String,
  },
  methods: {
    ...mapActions(["showClipboardOK"]),
    shortcutOnly,
  }
}
</script>
