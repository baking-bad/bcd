<template>
  <v-dialog v-model="show" width="800">
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on" class="link" :class="gutters ? '' : 'pa-0 ma-0'" selectable>
        <v-list-item-content>
          <v-list-item-subtitle class="overline">
            <span>{{ title }}</span>
          </v-list-item-subtitle>
          <v-list-item-title class="body-1">
            <span :class="[highlighted ? 'accent' : '']">
              <span v-if="alias">{{ alias }}</span>
              <span v-else v-html="helpers.shortcut(address)"></span>
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card class="data">
      <v-card-title class="sidebar">
        <v-row no-gutters>
          <v-col cols="11">
            <v-row no-gutters>
              <v-col v-if="alias" cols="auto" class="mr-5 my-1 d-flex flex-column justify-center">
                <span class="overline">Alias</span>
                <span class="info-item-title text--secondary">{{ alias }}</span>
              </v-col>
              <v-col cols="2" class="my-1 d-flex flex-column justify-center">
                <span class="overline">Primitive</span>
                <span class="info-item-title text--secondary">address</span>
              </v-col>
              <v-col cols="2" class="my-1 d-flex flex-column justify-center">
                <span class="overline">Network</span>
                <span class="info-item-title  text--secondary">{{ network }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1" class="d-flex align-center justify-end">
            <v-btn icon text @click="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>        
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters class="mt-5">
          <v-col cols="12">
            <ValueInspector prim="address"
                            :value="address"
                            :network="network"
                            :address="address"
                            :label="title"
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
.info-item-title {
  font-family: "Roboto Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.2rem;
}
.link.v-list-item--link:hover::before, .link.v-list-item--link:focus::before {
  opacity: 0;
}
.link.v-list-item--link:hover > .v-list-item__content {
  color: var(--v-secondary-base);
}
.link.v-list-item--link > .v-list-item__content > .v-list-item__title > span {
  border-bottom: 1px solid var(--v-border-base);

}
</style>