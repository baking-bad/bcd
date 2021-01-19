<template>
  <div id="docs" ref="redoc-container"></div>
</template>

<script>
import { init as initRedoc } from "redoc/bundles/redoc.standalone.js";

export default {
  name: "Diff",
  mounted() {
    initRedoc(
      `http://localhost:14000/v1/swagger.json`,
      this.redocOptions,
      this.$refs["redoc-container"]
    );
  },
  data() {
    return {
      redocOptions: {
        scrollYOffset: 0,
        expandResponses: "200",
        hideDownloadButton: true,
      },
    };
  },
};
</script>

<style lang="scss">
body {
  #docs {
    .api-content > div {
      padding: .5rem 0;
    }
    .api-content > div h1 {
      margin-bottom: 0;
    }
    .menu-content {
      $topPadding: 40px;
      padding-top: $topPadding;
      div[role="search"] {
        margin-top: $topPadding/2;
      }
    }
    code {
      background-color: transparent;
      span.property,
      span:not(.boolean),
      span:not(.string) {
        color: white;
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
      background: var(--v-sidenav-base);
      .redoc-wrap {
        .menu-content {
          background: var(--v-primary-base);
          label {
            &.active {
              background: var(--v-data-base);
            }
            &:hover {
              background: var(--v-data-base);
            }
          }
        }
        .api-content {
          a {
            &::before {
              background-color: white;
            }
          }
          & > div {
            & > div:first-child {
              & > div:first-child {
                color: white;
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                  color: white;
                }
                span,
                p {
                  color: white;
                }
                a {
                  color: lighten(rgb(50, 50, 159), 25);
                }
                table {
                  tr {
                    td[colspan="2"] {
                      div {
                        color: white;
                        background: var(--v-data-base);
                      }
                    }
                  }
                }
              }
              & > div:last-child:not(:first-child) {
                background: var(--v-sidenav-base);
              }
              button.fWqjRd {
                background: var(--v-primary-base);
              }
              button.ZMFUf {
                background: var(--v-error-darken3);
              }
            }
          }
          & > div:not(:first-child) {
            & > div:first-child {
              background: var(--v-sidenav-darken1);
              h1,
              h2 {
                font-weight: bold;
              }
            }
            &:not(.hBHSsv) {
              padding-left: 2.5rem;
              & > div {
                & > div {
                  padding-top: 1.5rem;
                  padding-bottom: 1.5rem;
                }
              }
            }
          }
        }
        & > div:last-child {
          background: var(--v-sidenav-base);
        }
      }
      code {
        span:not(.property).string {
          color: darken(rgb(160, 251, 170), 40);
        }
      }
      span,
      p,
      h2 {
        color: white;
      }
      table {
        span {
          color: rgb(124, 124, 187);
        }
      }
      div[role="button"] {
        span {
          color: rgb(50, 50, 159);
        }
      }
    }
  }
}
</style>