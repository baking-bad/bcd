<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>   
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          color="primary"
          placeholder="Start typing token name"
          clearable
          outlined
          background-color="data"
          single-line
          hide-details
            >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <EmptyState
          v-if="tokens.length === 0 && !loading"
          icon="mdi-code-brackets"
          title="Nothing found"
        />
        <v-expansion-panels v-show="tokens.length > 0" multiple hover flat class="bb-1">
          <v-expansion-panel v-for="(token) in tokens"
                      :key="token.token_id"
                      class="bl-1 br-1 bt-1 token-panel" 
                      active-class="token-active-panel">
            <v-expansion-panel-header class="py-0 px-4" :class="getHeaderClass(token)" ripple :title="title(token)">
              <template>
                <v-list-item class="fill-height pa-0">
                    <v-list-item-content>
                      <v-list-item-title>{{ title(token) }}</v-list-item-title>
                      <v-list-item-subtitle class="font-weight-light hash text--secondary">
                        Token ID: {{ token.token_id }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="token-content py-4">
              <v-list-item class="pl-0" v-if="token.link">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Token metadata link</v-list-item-subtitle>
                  <v-list-item-title class="d-flex align-center">
                    <span>{{ token.link }}</span>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          v-on="on"
                          icon
                          class="mr-2"
                          @click="
                            () => {
                              $clipboard(token.link);
                              showClipboardOK();
                            }
                          "
                        >
                          <v-icon small class="text--secondary">mdi-content-copy</v-icon>
                        </v-btn>
                      </template>
                      Copy token link
                    </v-tooltip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-alert v-if="token.status === 2 && token.metadata === null" type="error" prominent text class="ma-0 align-center">
                <div class="overline">Resolving token metadata error {{ token.retry_count ? `(after ${token.retry_count} attempts)`: ''}}</div>
                <div class="text--primary">{{ token.error }}</div>
              </v-alert>
              <v-alert v-if="token.status === 1 && token.metadata === null" icon="mdi-progress-download" color="grey" prominent text class="ma-0 align-center">
                <span class="overline">We're trying to get your file. Please, wait...</span>
              </v-alert>
              <v-row v-if="token.metadata">
                <v-col :cols="token.metadata.thumbnailUri ? 10 : 12">
                  <vue-json-pretty
                    
                    class="raw-json-viewer py-3"
                    :data="token.metadata"
                    :highlightMouseoverNode="true"
                    :customValueFormatter="formatValue"
                ></vue-json-pretty>
                </v-col>
                <v-col cols="2" v-if="token.metadata.thumbnailUri" class="d-flex flex-column align-center justify-start">
                  <span class="overline mt-10" v-if="!token.loaded">Loading thumbnail...</span>
                  <div class="d-flex flex-column align-center justify-start">
                    <v-img @load="loadedImage(token)" :src="getIPFS(token.metadata.thumbnailUri)" max-width="200" alt="Thumbnail" eager max-height="200">
                    </v-img>
                    <div class="mt-4" v-if="token.loaded">
                      <p class="overline">Image from thumbnail URL</p>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-progress-linear v-show="loading" indeterminate />
      </v-col>
    </v-row>    
    <span
      v-intersect="onDownloadPage"
      v-if="!loading && !downloaded"
    ></span>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@/components/Cards/EmptyState.vue";
import VueJsonPretty from "vue-json-pretty";
import { DipDupTokenMetadataApi } from "@/api/token_metadata.js";

export default {
  name: "ContractTokensTab",
  props: {
    network: String,
    address: String
  },
  components: {
    EmptyState,
    VueJsonPretty
  },
  data: () => ({
    tokens: [],
    loading: false,
    downloaded: false,
    ubisoft: {},
    domains: {},
    search: '',
    _timerId: null
  }),
  created() {
    this.ubisoft = new DipDupTokenMetadataApi('https://quartz.dipdup.net');
    this.domains = new DipDupTokenMetadataApi('https://domains.dipdup.net/');
  },
  computed: {
    metadataApi() {
      if (this.address === 'KT1TnVQhjxeNvLutGvzwZvYtC7vKRpwPWhc6') {
        return this.ubisoft;
      } else if (this.address === 'KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS') {
        return this.domains;
      }
      return this.tokenMetadata;
    }
  },
  methods: {
    ...mapActions(["showError", "hideError"]),
    title(token) {
      if (token.metadata !== null) {
        return token.metadata.name;
      }
      return `${token.token_id}`;
    },
    getIPFS(url) {
      if (!url) {
        return '';
      }

      return `${this.config.IPFS_NODE}/ipfs/${url.replace('ipfs://', '')}`
    },
    getHeaderClass(metadata) {
      if (metadata === null) return 'item-header-failed';
      if (metadata.status === 1) return 'item-header-mempool';
      if (metadata.status === 2) return 'item-header-failed';
      if (metadata.status === 3) return 'item-header-applied';
      return 'item-header-applied';
    },
    loadedImage(token) {
      token.loaded = true;
    },
    async onDownloadPage(_entries, _observer, isIntersecting) {
      if (isIntersecting) {
        if (this.search === '') {
          await this.getTokens();
        } else {
          await this.searchTokens(this.search);
        }
      }
    },
    async getTokens() {
      if (this.loading || this.downloaded) return;
      this.loading = true;
      
      await this.metadataApi.get( this.network, this.address, 20, this.tokens.length)
        .then(res => {
          if (!res) {
            this.downloaded = true; // prevent endless polling
          } else {
            this.downloaded = res.length === 0;
            res.forEach(x => x.loaded = false);
            this.tokens.push(...res);
          }
        })
        .catch((err) => {
          this.showError(err);
          this.downloaded = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async searchTokens(text) {
      if (this.loading || this.downloaded) return;
      clearTimeout(this._timerId);

      this._timerId = setTimeout(async () => {
        this.loading = true;

        try {
          let searchResult = await this.searchService.tokens(text, this.network, this.address, 20, this.tokens.length)
          if (searchResult.items.length === 0) {
            this.downloaded = true; // prevent endless polling
            return;
          }
          let token_ids = [];
          for(let i = 0; i < searchResult.items.length; i++) {
            token_ids.push(searchResult.items[i].body.TokenID);
          }
          let tokens = await this.metadataApi.token(this.network, this.address, token_ids);
          tokens.forEach(x => x.loaded = false);
          this.tokens.push(...tokens);
        }
        catch (err) {
            this.showError(err);
            console.log(err);
        }
        finally {
          this.loading = false;
        }
      }, 500)
      
    },
    formatValue(_data, _key, _path, defaultFormatResult) {
      return defaultFormatResult
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
  },
  watch: {
    address: "getTokens",
    async search(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.tokens = [];

      const text = newValue ? newValue.trim(): '';
      if (!text || text.length === 0) {
        await this.getTokens()
        return;
      }

      await this.searchTokens(text);
    }
  },
};
</script>

<style scoped>
.token-content > .v-expansion-panel-content__wrap {
  padding: 0;
}

.token-panel {
  background-color: var(--v-data-base) !important;
}

.token-active-panel > .v-expansion-panel-header {
  opacity: 0.8;
  background-color: var(--v-border-base) !important;
}

.token-active-panel,
.token-panel.v-expansion-panel--next-active {
  border-bottom: 1px solid var(--v-border-base);
}
</style>

<style lang="scss">
@import '../../../styles/vue-json-pretty.css';
</style>