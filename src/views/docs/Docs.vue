<template>
<div id="docs-wrapper">
  <div class="fill-height">
    <v-navigation-drawer floating app permanent width="56" color="canvas" class="main-navigation">
      <SideNavigation />
    </v-navigation-drawer>
  </div>
  <div v-show="isDocsRerendering" class="ma-3">
    <h2 class="theme-is-changing">Theme is changing...</h2>
  </div>
  <v-container v-show="!isDocsRerendering" class="pa-0 ma-0" fluid>
    <div id="docs" ref="redoc-container"></div>
  </v-container>
</div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import { init as initRedoc } from "redoc/bundles/redoc.standalone.js";

export default {
  name: "Docs",
  components: {
    SideNavigation,
  },
  mounted() {
    this.init();
  },
  watch: {
    theme() {
      setTimeout(() => {
        this.isDocsRerendering = true;
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            this.init();
            window.requestAnimationFrame(() => {
              this.isDocsRerendering = false;
            });
          });
        }, 0);
      }, 0);
    }
  },
  methods: {
    init: async function() {
      return initRedoc(
        `${this.baseURL}/swagger.json`,
        this.redocOptions,
        this.$refs["redoc-container"]
      );
    }
  },
  computed: {
    baseURL() {
      const apiURL = new URL(this.config.API_URI);
      return `${apiURL.protocol}//api.${apiURL.hostname}${apiURL.pathname}`;
    },
    theme() {
      return this.$vuetify.theme.themes[this.$vuetify.theme.isDark ? 'dark' : 'light'];
    },
    redocOptions() {
      return {
        scrollYOffset: 0,
        expandResponses: "200",
        hideDownloadButton: true,
        theme: {
          schema: {
            linesColor: this.theme.border,
            typeNameColor: this.theme.secondary,
            nestedBackground: this.theme.data
          },
          logo: {
            gutter: '2rem'
          },
          sidebar: {
            backgroundColor: this.theme.sidebar,
            textColor: this.theme.text,
            level1Items: {
              textTransform: 'uppercase'
            },
          },
          rightPanel: {
            backgroundColor: this.theme.sidenav,
            textColor: this.$vuetify.theme.themes.dark.text
          },
          codeBlock: {
              backgroundColor: this.$vuetify.theme.themes.dark.data
          },
          colors: {
            primary: {
              main: this.theme.primary,
              dark: this.$vuetify.theme.themes.dark.primary,
              light: this.$vuetify.theme.themes.light.primary,
            },
            success: {
              main: this.theme.success,
              dark: this.$vuetify.theme.themes.dark.success,
              light: this.$vuetify.theme.themes.light.success,
            },
            warning: {
              main: this.theme.warning,
              dark: this.$vuetify.theme.themes.dark.warning,
              light: this.$vuetify.theme.themes.light.warning,
            },
            error: {
              main: this.theme.error,
              dark: this.$vuetify.theme.themes.dark.error,
              light: this.$vuetify.theme.themes.light.error,
            },
            text: {
              primary: this.theme.text,
            },
            border: {
              dark: this.$vuetify.theme.themes.dark.border,
              light: this.$vuetify.theme.themes.light.border,
            },
            gray: {

            },
            http: {
              get: this.theme.primary,
              post: 'rgb(14, 124, 134)'
            }
          },
          typography: {
            headings: {
              fontFamily: 'Roboto, sans-serif'
            },
            code: {
              fontSize: '14px'
            },
            links: {
              color: this.theme.secondary
            }
          }
        }
      };
    }
  },
  data() {
    return {
      isDocsRerendering: false,
    }
  }
};
</script>

<style lang="scss">
body {
  #docs-wrapper {
    .theme-is-changing {
      font-family: Roboto, sans-serif;
      font-weight: 500;
      color: rgb(91, 148, 42);
    }
    #docs {
      .redoc-wrap {
        background-color: var(--v-canvas-base);
      }
      .api-content > div {
        padding: 2rem 0;
      }
      .api-content > div h1 {
        margin-bottom: 0;
      }
      code {
        background-color: #2a2a2a;
        color: #888;
        span.token.punctuation {
          color: #888;
        }
        span.token.boolean, span.ellipsis {
          color:rgb(14, 124, 134);
        }
      }
      td {
        border-color: var(--v-border-base);
      }
      h1 {
        text-transform: uppercase;
        font-weight: 500;
      }
      h2 {
        color: var(--v-text-darken2);
      }
      h3 {
        margin-top: 20px;
        margin-bottom: 10px;
      }
      h5 {
        color: var(--v-text-darken2);
        border-color: var(--v-border-base);
        span {
          color: var(--v-text-darken4);
        }
      }
      ul {
        padding: 0;
      }
      ul[role="navigation"] ~ div > a {
        border-color: var(--v-border-base) !important;
      }
      label[type="tag"] {
        opacity: .7;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: .0333333333em!important;
        line-height: 1.25rem;
      }
      div[role="tabpanel"] {
        margin-top: 10px;
      }
      div[role="button"] > div {
        color: #000;
        &> span {
          color: #000;
        }
      }
      li[role="tab"].react-tabs__tab--selected {
        background-color: #555;
        border-color: #555;
      }
    }
  }
  & > div.theme--dark {
    #docs {
      table {
        td {
          &[colspan="2"] {
            & > div {
              color: white;
              background: var(--v-data-base) !important;
            }
          }
        }
      }
      .api-content {
        & > div {
          & > div {
            & > div:last-child:not(:first-child) {
              & > div:first-child > div:last-child {
                background: var(--v-data-base);
                & > div:first-child > div:last-child > div {
                  border: 0;
                  background: var(--v-data-base);
                }
              }
            }
          }
        }
      }
      div[data-role="search:results"] {
        li {
          background: var(--v-data-darken1);
        }
        background: var(--v-data-darken1);
      }
    }
  }
  & > div.theme--light {
    #docs {
      div[data-role="search:results"] {
        li {
          background-color: rgb(220, 220, 220);
        }
        background-color: rgb(220, 220, 220);
      }
    }
  }
}
</style>
