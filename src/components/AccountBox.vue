<template>
  <v-dialog v-model="show" width="800">
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on" class="link" :class="gutters ? '' : 'pa-0 ma-0'" selectable>
        <v-list-item-content>
          <v-list-item-subtitle v-if="title" class="overline">
            <span>{{ title }}</span>
          </v-list-item-subtitle>
          <v-list-item-title>
            <span class="body-1" :class="highlighted ? 'text--secondary' : ''">
              <span v-if="alias">{{ alias }}</span>
              <span v-else v-html="helpers.shortcut(address)"></span>
            </span>
            <v-icon v-if="highlighted" class="ml-1 mb-1 text--disabled" small>mdi-radiobox-marked</v-icon>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card class="data">
      <v-card-title class="py-3 px-6 align-center sidebar">
        <span class="body-1 font-weight-medium text-uppercase text--secondary mr-2">
          {{ title }}:
        </span>
        <span v-if="alias" class="ml-2 body-1">{{ alias }}</span>
        <span v-else class="ml-2 body-1" v-html="helpers.shortcut(address)"></span>
        <v-spacer></v-spacer>
        <span
          class="caption text-uppercase font-weight-medium"
          :class="network === 'mainnet' ? 'primary--text' : 'text--secondary'"
        >{{ network }}</span>
      </v-card-title>
      <v-card-text class="pt-7">
        <v-row no-gutters>
          <v-col cols="12">
            <ValueInspector prim="address"
                            :value="address"
                            :network="network"
                            label="Address"
                            :sameTab="true">
            </ValueInspector>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ValueInspector from "@/components/ValueInspector.vue"

export default {
  name: "AccountBox",
  props: {
    title: String,
    address: String,
    alias: String,
    highlighted: Boolean,
    gutters: Boolean,
    network: String
  },
  components: {
    ValueInspector
  },
  data: () => ({
    show: false
  })
}
</script>

<style scoped>
.link.v-list-item--link:hover::before, .link.v-list-item--link:focus::before {
  opacity: 0;
}
.link.v-list-item--link:hover > .v-list-item__content {
  color: var(--v-accent-base);
}
.link.v-list-item--link > .v-list-item__content > .v-list-item__title > span {
  border-bottom: 1px solid var(--v-border-base);
}
</style>