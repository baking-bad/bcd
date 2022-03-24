<template>
  <div id="docs-wrapper" :class="this.$vuetify.theme.isDark ? 'docs-wrapper_dark' : ''">
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

const RERENDERING_TIMEOUT = 200;

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
        }, RERENDERING_TIMEOUT);
      }, RERENDERING_TIMEOUT);
    }
  },
  methods: {
    init: async function() {
      return initRedoc(
        `https://api.better-call.dev/v1/swagger.json`,
        this.redocOptions,
        this.$refs["redoc-container"]
      );
    }
  },
  computed: {
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
    &.docs-wrapper_dark {
      table td[colspan="2"] > div {
        color: var(--v-text-base);
        background: var(--v-data-base) !important;
      }
      .api-content {
        & > div > div {
          h2 {
            a::before {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0' y='0' width='512' height='512' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Cpath fill='white' d='M459.7 233.4l-90.5 90.5c-50 50-131 50-181 0 -7.9-7.8-14-16.7-19.4-25.8l42.1-42.1c2-2 4.5-3.2 6.8-4.5 2.9 9.9 8 19.3 15.8 27.2 25 25 65.6 24.9 90.5 0l90.5-90.5c25-25 25-65.6 0-90.5 -24.9-25-65.5-25-90.5 0l-32.2 32.2c-26.1-10.2-54.2-12.9-81.6-8.9l68.6-68.6c50-50 131-50 181 0C509.6 102.3 509.6 183.4 459.7 233.4zM220.3 382.2l-32.2 32.2c-25 24.9-65.6 24.9-90.5 0 -25-25-25-65.6 0-90.5l90.5-90.5c25-25 65.5-25 90.5 0 7.8 7.8 12.9 17.2 15.8 27.1 2.4-1.4 4.8-2.5 6.8-4.5l42.1-42c-5.4-9.2-11.6-18-19.4-25.8 -50-50-131-50-181 0l-90.5 90.5c-50 50-50 131 0 181 50 50 131 50 181 0l68.6-68.6C274.6 395.1 246.4 392.3 220.3 382.2z'/%3E%3C/svg%3E");
            }
          }
          & > div:last-child:not(:first-child) > div:first-child > div:last-child {
            background: var(--v-data-base);
            & > div:first-child > div:last-child > div {
              border: none;
              background: var(--v-data-base);
            }
          }
        }
      }
      #docs {
        div[role="button"] > div {
          color: var(--v-secondary-lighten5);
          &> span {
            color: var(--v-secondary-lighten5);
          }
        }
      }
    }
  }
}
</style>
