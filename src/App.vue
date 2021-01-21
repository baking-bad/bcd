<template>
  <v-app>
    <v-content>
      <ErrorSnackbar v-if="!!$store.state.error" />
      <SuccessSnackbar v-if="!!$store.state.success" />
      <router-view></router-view>
      <v-fab-transition v-if="$vuetify.breakpoint.smAndUp">
        <v-btn color="primary" fab fixed bottom right v-show="showToTop" @click="scrollToTop">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-content>
  </v-app>
</template>

<script>
import ErrorSnackbar from "@/components/Snackbar/ErrorSnackbar.vue";
import SuccessSnackbar from "@/components/Snackbar/SuccessSnackbar.vue";

export default {
  name: "App",
  components: {
    ErrorSnackbar,
    SuccessSnackbar
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
html {
  overflow-y: auto !important;
}

:focus {
  outline: none !important;
}

.hash {
  font-family: "Roboto Mono", monospace;
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

.fill-canvas {
  min-height: calc(100% - 75px);
}

.toolbar {
  background-color: var(--v-canvas-base) !important;
  border-bottom: 1px solid var(--v-border-base) !important;
}

.canvas {
  background-color: var(--v-canvas-base) !important;
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
  background: #99999950;
  border: solid 3px var(--v-data-base);
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: #99999990;
}

/* Change the white to any color ;) */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active  {
  -webkit-box-shadow: 0 0 0 30px var(--v-data-base) inset !important;
  -webkit-text-fill-color: var(--v-text-base) !important;
}
</style>
