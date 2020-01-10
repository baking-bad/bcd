<template>
  <v-app>
      <router-view name="toolbar" v-intersect="onIntersect"></router-view>
      <v-content>
          <ErrorSnackbar v-if="!!$store.state.error" />
          <router-view></router-view>
          <v-fab-transition v-if="$vuetify.breakpoint.smAndUp">
              <v-btn color="primary" fab fixed bottom right v-show="showToTop" @click="scrollToTop">
                  <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
          </v-fab-transition>
      </v-content>

      <v-footer v-if="$vuetify.breakpoint.xsOnly && $route.name !== 'home'" padless absolute style="z-index:0;" app>
          <v-card flat tile class="grey lighten-4 text-center" width="100%">
              <v-divider />
              <v-card-text class="py-1">
                  Copyright © 2019 <a href="https://baking-bad.org/docs" target="_blank">Baking Bad</a><span class="hide-nano">. All rights reserved.</span>
              </v-card-text>
          </v-card>
      </v-footer>
  </v-app>
</template>

<script>
import ErrorSnackbar from "@/components/ErrorSnackbar.vue";


export default {
  name: 'App',

  components: {
    ErrorSnackbar,  
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
