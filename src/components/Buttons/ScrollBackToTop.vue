<template>
  <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
  >
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "ScrollBackToTop",
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > window.outerHeight * 2
    },
    toTop () {
      this.$vuetify.goTo(0)
    }
  },
  data: () => ({
    fab: false
  }),
}
</script>
