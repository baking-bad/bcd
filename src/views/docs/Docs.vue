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
    background: var(--v-sidenav-base) !important;
    #docs {
      background: var(--v-sidenav-base);
      .redoc-wrap {
        input {
          color: white;
        }
        div[data-role="search:results"] {
          li {
            background: var(--v-data-darken1);
          }
          background: var(--v-data-darken1);
        }
        .menu-content {
          background: var(--v-sidebar-base);
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
                  $trBorderColor: rgba(124, 124, 187, 0.5);
                  tr {
                    border-left: 1px solid red;
                    &:first-of-type {
                      & > .eGbWXV {
                        border-left: none;
                        background-image:
                            linear-gradient(
                                    transparent 0%,
                                    transparent 22px,
                                    $trBorderColor 22px,
                                    $trBorderColor 100%
                            );
                      }
                      & > .ekuXnN {
                        border-left-width: 0px;
                        background-position: left top;
                        background-repeat: no-repeat;
                        background-size: 1px 100%;
                        background-image:
                            linear-gradient(
                                    transparent 0%,
                                    transparent 22px,
                                    $trBorderColor 22px,
                                    $trBorderColor 100%
                            );
                      }
                    }
                    &.last {
                      &:first-child {
                        & > .eGbWXV {
                          background: none;
                          border-left-color: transparent;
                        }
                      }
                      & > .eGbWXV {
                        border-left: none;
                        background-image:
                            linear-gradient(
                                    $trBorderColor 0%,
                                    $trBorderColor 22px,
                                    transparent 22px,
                                    transparent 100%
                            );
                      }
                      & > .ekuXnN {
                        border-left-width: 0px;
                        background-position: left top;
                        background-repeat: no-repeat;
                        background-size: 1px 100%;
                        background-image:
                            linear-gradient(
                                    $trBorderColor 0%,
                                    $trBorderColor 22px,
                                    transparent 22px,
                                    transparent 100%
                            );
                      }
                    }
                    td {
                      &[colspan="2"] {
                        div {
                          color: white;
                          background: var(--v-data-base);
                        }
                      }
                      .phsGg {
                        &::after,
                        &::before {
                          background: $trBorderColor;
                        }
                      }
                      &.eGbWXV,
                      &.ekuXnN,
                      &.eviNgt {
                        border-left: 1px solid $trBorderColor;
                      }
                    }
                  }
                }
              }
              & > div:last-child:not(:first-child) {
                background: var(--v-sidenav-base);
              }
              button.fWqjRd {
                background: rgba(117, 163, 79, 0.3)
              }
              button.ZMFUf {
                background: rgba(159, 0, 16, 0.3);
              }
            }
            .react-tabs__tab-panel {
              background: var(--v-canvas-base);
            }
            .react-tabs__tab-list {
              li {
                border: 1px solid rgba(7, 9, 11, 0.25);
                &:not(.react-tabs__tab--selected) {
                  background: var(--v-canvas-base);
                }
              }
            }
            button.sc-prOVx {
              background: var(--v-canvas-base);
            }
          }
          & > div:not(:first-child) {
            div:first-child:not(:last-child) {
              background: var(--v-canvas-base);
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