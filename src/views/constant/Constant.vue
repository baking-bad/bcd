<template>
  <div class="fill-height">
    <v-row>
       <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbsItems" divider="/" class="ml-10 pl-0 pt-0 mt-3" />
       </v-col>
    </v-row>
    <v-row class="fill-height px-8 mt-1" no-gutters>
      <v-col cols="12">
        <router-view :network="network" :address="address"></router-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {toTitleCase} from "@/utils/string";
import {shortcutOnly} from "@/utils/tz";

export default {
  name: "Constatnt",
  data: () => ({
    loading: true,
    currentNetwork: null,
  }),
  props: {
    network: String,
    address: String,
  },
  computed: {
    breadcrumbsItems() {
      return [
        {
          text: 'Home',
          to: '/',
        },
        {
          to: `/${this.network}/#`,
          text: toTitleCase(this.network),
        },
        {
          text: this.contract && this.contract.alias ? this.contract.alias : shortcutOnly(this.address),
          to: `/${this.network}/${this.address}`,
          disabled: true,
        },
      ];
    },
  },
  methods: {
    ...mapActions(["showError"]),
  },
  watch: {
    $route: "navigate",
  },
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}
</style>
