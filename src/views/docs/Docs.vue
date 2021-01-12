<template>
  <div id="docs" ref="redoc-container"></div>
</template>

<script>
import { init as initRedoc } from 'redoc/bundles/redoc.standalone.js';

export default {
  name: "Diff",
  mounted() {
    initRedoc(
        `${this.config.API_URI}swagger.json`,
        this.redocOptions,
        this.$refs['redoc-container']
    )
  },
  data() {
    return {
      redocOptions: {
        scrollYOffset: 0,
      }
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
    code {
      span.property,
      span:not(.boolean)
      span:not(.string) {
        color: black;
      }
      span:not(.property).string {
        color: darken(rgb(160, 251, 170), 50);
      }
      span:not(.property).boolean {
        color: rgb(230, 68, 65);
      }
    }
  }
  & > div.theme--dark {
    #docs {
      .menu-content {
        background: black;
        label {
          &.active {
            background: darken(#F5F5F5, 50);
          }
          &:hover {
            background: darken(#F5F5F5, 80);
          }
        }
      }
      .api-content {
        a {
          &::before {
            background-color: white;
          }
        }
      }
      code {
        span.property,
        span:not(.boolean)
        span:not(.string) {
          color: black;
        }
      }
      h1 {
        color: lighten(rgb(50, 50, 159), 25);
      }
      span,
      p,
      h2 {
        color: white;
      }
      h3,
      h4,
      h5,
      h6 {
        color: darken(white, 25);
      }
    }
  }
}
</style>
