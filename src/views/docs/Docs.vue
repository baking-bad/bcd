<template>
  <div ref="redoc-container"></div>
</template>

<script>
import { init as initRedoc } from 'redoc/bundles/redoc.standalone.js';

export default {
  name: "Diff",
  mounted() {
    const SWAGGER_API = this.isTrue
        ? 'http://localhost:14000/v1/swagger.json'
        : `${this.config.API_URI}swagger.json`; // while development
    initRedoc(
        SWAGGER_API,
        this.redocOptions,
        this.$refs['redoc-container']
    )
  },
  data() {
    return {
      redocOptions: {
        scrollYOffset: 0,
      },
      isTrue: true // while development
    }
  },
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
