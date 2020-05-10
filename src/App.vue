<template>
  <v-app>
    <router-view name="toolbar" v-intersect="onIntersect"></router-view>
    <router-view name="nav"></router-view>
    <v-content>
      <ErrorSnackbar v-if="!!$store.state.error" />
      <router-view></router-view>
      <v-fab-transition v-if="$vuetify.breakpoint.smAndUp">
        <v-btn color="primary" fab fixed bottom right v-show="showToTop" @click="scrollToTop">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-content>

    <v-footer v-if="$route.name === 'home'" padless absolute app>
      <v-card flat tile class="text-center" width="100%">
        <v-card-text class="py-1">
          Created by <a
            href="https://baking-bad.org/"
            target="_blank"
          >Baking Bad</a> |
          Pictures by
          <a
            href="https://www.behance.net/gallery/23957341/href"
            target="_blank"
          >Guillermo Prestegui</a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import ErrorSnackbar from "@/components/ErrorSnackbar.vue";

export default {
  name: "App",
  components: {
    ErrorSnackbar
  },
  data: () => ({
    showToTop: false
  }),
  methods: {
    onIntersect(entries, observer, isIntersecting) {
      this.showToTop = !isIntersecting;
    },
    scrollToTop() {
      this.$vuetify.goTo(0, {
        duration: 200,
        offset: 0,
        easing: "easeInOutCubic"
      });
    }
  }
};
</script>

<style>
@font-face {
  font-family: GentiumPlusW;
  src: url(/fonts/GentiumPlus-R.woff);
  font-display: swap;
}

.bt-1 {
  border-top: 1px solid var(--v-border-base) !important;
}
.br-1 {
  border-right: 1px solid var(--v-border-base) !important;
}
.bb-1 {
  border-bottom: 1px solid var(--v-border-base) !important;
}
.bl-1 {
  border-left: 1px solid var(--v-border-base) !important;
}
.ba-1 {
  border: 1px solid var(--v-border-base) !important;
}

.toolbar {
  background-color: var(--v-canvas-base) !important;
  border-bottom: 1px solid var(--v-border-base) !important;
}

.canvas {
  background-color: var(--v-canvas-base) !important;
  height: 100%;
}

.data {
  background-color: var(--v-data-base) !important;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--v-data-base);
  border-left: none
}

::-webkit-scrollbar-thumb {
  background: var(--v-sidenav-base);
  border: solid 3px var(--v-data-base);
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
