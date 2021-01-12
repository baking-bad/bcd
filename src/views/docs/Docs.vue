<template>
  <div id="docs" ref="redoc-container"></div>
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

<style lang="scss">
body {
  #docs {
    .menu-content {
      $topPadding: 40px;
      padding-top: $topPadding;
      div[role="search"] {
        margin-top: $topPadding/2;
      }
    }
  }
  & > div.theme--dark {
    #docs {
      .menu-content {
        background: darken(#F5F5F5, 100);
        label {
          &.active {
            background: darken(#F5F5F5, 50);
          }
          &:hover {
            background: darken(#F5F5F5, 80);
          }
        }
      }
      span {
        color: lighten(rgb(51, 51, 51), 100)
      }
    }
  }
}
</style>
