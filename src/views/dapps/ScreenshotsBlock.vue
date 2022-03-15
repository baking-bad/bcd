<template>
  <v-row v-if="tabs.length > 0">
    <v-col cols="12">
      <h3 class="mb-1">Screenshots</h3>
      <v-skeleton-loader :loading="loading" type="image">
        <v-tabs background-color="transparent" class="mt-2" v-model="tab">
          <v-tab :key="data.id" v-for="data in tabs">
            <v-icon small left>{{ getScreenshotTypeIcon(data.name)}}</v-icon>
            {{ data.name }}
          </v-tab>
          <v-tab-item
            :key="`${data.name}-screens`"
            v-for="data in tabs"
            style="background-color: transparent"
          >
            <v-slide-group
              v-model="selected[data.id]"
              class="my-1"
              show-arrows
              active-class="selected"
              mandatory
            >
              <v-slide-item v-for="image in data.items" :key="image.link+'-slide'" class="mr-1">
                <v-card @click="showDialog = !showDialog" width="250" :elevation="0">
                  <v-img
                    :aspect-ratio="getScreenshotAspectRatio(data.name)"
                    max-width="250"
                    :src="image.link"
                    contain
                  />
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-tab-item>
        </v-tabs>
      </v-skeleton-loader>
      <v-dialog v-model="showDialog">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Screenshots</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-carousel v-model="selected[tab]" show-arrows height="800">
            <v-carousel-item
              cycle
              v-for="image in tabs[tab].items"
              :key="image.link"
              style="width: 100%; height: 100%"
            >
              <v-img :src="image.link" contain max-height="800" />
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ScreenshotsBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
  data: () => ({
    selected: {},
    tab: 0,
    showDialog: false,
    tabs: [],
  }),
  created() {
    if (this.dapp && this.dapp.screenshots) {
      this.initTabs();
    }
  },
  methods: {
    initTabs() {
      let value = {};
      this.dapp.screenshots.forEach((x) => {
        if (x.type in value) {
          value[x.type].push(x);
        } else {
          value[x.type] = [x];
        }
      });
      Object.keys(value).forEach((x, i) => {
        this.tabs.push({
          id: i,
          name: x,
          items: value[x],
        });
      });
      this.tabs.forEach((x) => {
        this.selected[x.id] = 0;
      });
    },
    getScreenshotAspectRatio(type) {
      if (type === "desktop") {
        return 16 / 9;
      } else if (type === "iphone") {
        return 2.2;
      }
      return 16 / 9;
    },
    getScreenshotTypeIcon(type) {
      if (type === "desktop") {
        return "mdi-desktop-mac";
      } else if (type === "iphone") {
        return "mdi-apple";
      }
      return "mdi-monitor";
    },
  },
};
</script>

<style lang="scss">
.v-tabs-items {
  background-color: transparent !important;
}
</style>

<style lang="scss" scoped>
.small-image {
  opacity: 0.5;
  background-color: var(--v-data-base);
}
.selected {
  opacity: 1;
}
</style>