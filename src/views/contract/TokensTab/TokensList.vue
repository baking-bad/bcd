<template>
  <div class="ma-0 pa-0">
    <v-card flat outlined>
      <v-list class="ma-0 pa-0 data">
        <v-skeleton-loader
          v-if="isLoading"
          :loading="isSpecificLoaded"
          type="image"
        >
        </v-skeleton-loader>
        <v-list-item-group
          v-else
          active-class="token-card-selected"
          mandatory
        >
          <template v-for="(item, i) in tokens">
            <v-divider :key="item.token_id" v-if="i !== 0" />
            <v-list-item @click="selectedToken = item" :key="`${item.contract}:${item.token_id}`" class="token-card">
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="item.name">{{ item.name }}</span>
                  <span v-else class="text--disabled">NO NAME</span>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  <span class="caption text--disabled">token ID:</span>
                  <span>&nbsp;{{ item.token_id }}</span>
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="text-center mt-2">
      <v-pagination
        v-model="tokensPage"
        :length="tokensPageCount"
        v-if="tokensTotal > itemsPerPage"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import {getQuery, isQuery, setQuery} from "../../../utils/url";
import {mapActions} from "vuex";

const TOKEN_ID_QUERY = 'token_id';
const SESSION_STORAGE_TOKEN_KEY = `START_UP_TOKEN_ID`;

export default {
  name: "TokensList",
  props: {
    network: String,
    address: String,
    tokensTotal: Number
  },
  computed: {
    isLoading() {
      return !this.isTokensLoaded;
    }
  },
  beforeCreate() {
    if (sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY)) {
      sessionStorage.removeItem(SESSION_STORAGE_TOKEN_KEY);
    }
    const startUpTokenID = getQuery(TOKEN_ID_QUERY);
    if (startUpTokenID) {
      sessionStorage.setItem(SESSION_STORAGE_TOKEN_KEY, startUpTokenID);
    }
  },
  methods: {
    ...mapActions(["showError"]),
    async getTokens(offset, size) {
      this.isTokensLoaded = false;
      const startUpTokenID = sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY);
      this.api
        .getContractTokens(this.network, this.address, offset, size)
        .then(async (res) => {
          if (!res) return;
          if (this.tokensPage === 1) {
            if (startUpTokenID) {
              this.isSpecificLoaded = false;
              const specificToken = await this.getSpecificToken(startUpTokenID);
              this.isSpecificLoaded = true;
              this.tokens = specificToken.concat(res.filter(token => token.token_id !== Number(startUpTokenID)));
            } else {
              this.tokens = res;
            }
          } else {
            this.tokens = res.filter(token => token.token_id !== Number(startUpTokenID));
          }
          this.selectedToken = this.tokens[0];
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => {
          this.isTokensLoaded = true;
        })
    },
    getSpecificToken(token_id) {
      return this.api
        .getContractToken(this.network, this.address, token_id);
    },
    getNextTokensAmount() {
      const minusator = isQuery(TOKEN_ID_QUERY) && this.tokensPage === 1 ? 1 : 0;
      return this.itemsPerPage - minusator;
    },
  },
  watch: {
    tokensPage: {
      handler(newVal) {
        this.tokens = [];
        this.getTokens((newVal - 1) * this.itemsPerPage, this.getNextTokensAmount());
      },
      immediate: true
    },
    tokensTotal: {
      handler(newVal) { 
        this.tokensPageCount = Math.ceil(newVal / this.itemsPerPage);
      },
      immediate: true
    },
    selectedToken: {
      handler(newVal) {
        this.$emit('selectedToken', newVal);
        setQuery(TOKEN_ID_QUERY, newVal.token_id);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      tokens: [],
      selectedToken: null, 
      tokensPage: 1,
      itemsPerPage: 10,
      tokensPageCount: 0,
      isSpecificLoaded: false,
      isTokensLoaded: false,
    }
  }
}
</script>

<style scoped>
.token-card {
  border-bottom: 1px solid var(--v-border-base);
}

.token-card:last-child {
  border-bottom: none !important;
}

.token-card-selected {
  border-left: 2px solid var(--v-primary-base);
  background-color: var(--v-sidebar-base);
}
</style>