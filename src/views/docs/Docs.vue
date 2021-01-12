<template>
  <redoc-wrapper :spec-or-spec-url="'http://localhost:14000/v1/swagger.json'" :options="redocOptions"/>
</template>

<script>
import RedocWrapper from '@hnluu8/vue-redoc-wrapper'

export default {
  name: "Diff",
  components: {
    RedocWrapper
  },
  data() {
    return {
      redocOptions: {
        scrollYOffset: 0,
      },
    }
  }
};
</script>

<style lang="scss" scoped>
#redoc-container {
  .menu-content {
    top: 0 !important;
    height: 100% !important;
  }
  .api-content {
    background: #FAFAFA;
  }
}
</style>
