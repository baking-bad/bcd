<template>
  <div class="fill-height canvas">
    <v-list-item style="height: 74px;">
      <v-list-item-content two-line>
        <v-list-item-title class="headline">
          <span v-if="contract.alias">{{ contract.alias }}</span>
          <span v-else v-html="helpers.shortcut(address)"></span>
        </v-list-item-title>
        <v-list-item-subtitle class="overline">{{ network }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <div class="d-flex align-center px-4 sidebar" style="height: 48px;">
      <span class="caption font-weight-bold text-uppercase text--secondary">Actions</span>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2">
            <v-icon class="text--secondary">mdi-eye-outline</v-icon>
          </v-btn>
        </template>
        Watch settings
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2">
            <v-icon class="text--secondary">mdi-content-copy</v-icon>
          </v-btn>
        </template>
        Copy address
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon class="text--secondary">mdi-share-variant</v-icon>
          </v-btn>
        </template>
        Share link
      </v-tooltip>
    </div>
    <v-divider></v-divider>

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <v-expansion-panels flat tile mandatory multiple active-class="opened-panel">
        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Details</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="sidebar-list">
              
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1" disabled>
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Same contracts</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas"></v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1" disabled>
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">Similar contracts</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas"></v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>

    <v-footer
      color="transparent"
      absolute
      bottom
      class="d-flex justify-center ml-6"
      style="z-index: 0"
    >
      <v-btn x-small text href="https://baking-bad.org/docs" target="_blank" color="border">
        <span>Baking Bad</span>
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  props: {
    contract: Object,
    address: String,
    network: String,
    loading: Boolean
  },
  methods: {}
};
</script>