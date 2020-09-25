<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row>
      <v-col cols="3">
        <v-card flat outlined>
          <v-skeleton-loader :loading="loading" type="list-item@5">
            <v-list class="py-0 item">
              <AccountBox
                v-if="tokens && tokens.length > 0 && tokens[0].registry_address"
                title="Metadata Registry"
                :address="tokens[0].registry_address"
                :network="network"
                gutters
              />

              <v-list-item-group v-model="selectedToken">
                <template v-for="(token) in tokens">
                  <v-list-item :key="token.token_id">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ token.name }}
                        <span
                          v-if="token.symbol"
                          class="overline"
                        >({{ token.symbol }})</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="`divider-${token.token_id}`" />
                </template>
              </v-list-item-group>
            </v-list>
          </v-skeleton-loader>
        </v-card>
      </v-col>
      <v-col>
        <v-skeleton-loader :loading="loadingTransfers && items.length == 0" type="list-item@5">
          <v-card flat outlined v-if="token" class="mb-4 item">
            <v-row>
              <v-col cols="2">
                <v-list-item selectable>
                  <v-list-item-content>
                    <v-list-item-title class="overline">Symbol</v-list-item-title>
                    <v-list-item-subtitle>{{ token.symbol }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="2">
                <v-list-item selectable>
                  <v-list-item-content>
                    <v-list-item-title class="overline">Decimals</v-list-item-title>
                    <v-list-item-subtitle>{{ token.decimals }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="2" v-if="token.supply">
                <v-list-item selectable>
                  <v-list-item-content>
                    <v-list-item-title class="overline">Supply</v-list-item-title>
                    <v-list-item-subtitle>{{ helpers.round(token.supply, token.decimals) }} {{ token.symbol }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="2" v-if="token.transfered">
                <v-list-item selectable>
                  <v-list-item-content>
                    <v-list-item-title class="overline">Transfered</v-list-item-title>
                    <v-list-item-subtitle>{{ helpers.round(token.transfered, token.decimals) }} {{ token.symbol }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <template v-for="(value, key) in token.extras">
                <v-col cols="2" :key="key">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-list-item selectable v-on="on">
                        <v-list-item-content>
                          <v-list-item-title class="overline">{{ key }}</v-list-item-title>
                          <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span>{{ value }}</span>
                  </v-tooltip>
                </v-col>
              </template>
            </v-row>
          </v-card>

          <v-card flat outlined v-if="items.length > 0">
            <v-list class="py-0 item">
              <template v-for="(item, id) in items">
                <v-list-item :key="id">
                  <v-row>
                    <v-col cols="1" class="d-flex align-center justify-center">
                      <v-icon :color="getStatusColor(item.status)">{{ getIcon(item.status) }}</v-icon>
                    </v-col>
                    <v-col cols="2" class="d-flex align-center">
                      <span
                        class="body-2 text--secondary"
                      >{{ helpers.formatDatetime(item.timestamp) }}</span>
                    </v-col>
                    <v-col cols="2" class="d-flex align-center justify-end pr-6">
                      <span class="body-2">
                        {{ token ? helpers.round(item.amount, token.decimals).toLocaleString(undefined, { maximumFractionDigits: token.decimals }) : item.amount }}
                        <span
                          class="caption text-uppercase font-weight-regular text--disabled"
                        >{{ token.symbol ? token.symbol : `tok_${item.token_id}`}}</span>
                      </span>
                    </v-col>
                    <v-col cols="5" class="d-flex align-center">
                      <div>
                        <span
                          class="caption text-uppercase font-weight-regular text--secondary"
                        >From&nbsp;</span>
                        <router-link
                          text
                          v-html="item.from_alias || helpers.shortcut(item.from)"
                          style="text-transform: none; text-decoration: none;"
                          class="px-1 text--primary hash"
                          :to="item.from.startsWith('tz') ? `/${item.from}`: `/${item.network}/${item.from}`"
                        />&nbsp;
                        <span
                          class="caption text-uppercase font-weight-regular text--secondary"
                        >&nbsp;to&nbsp;</span>
                        <router-link
                          text
                          :to="item.to.startsWith('tz') ? `/${item.to}`: `/${item.network}/${item.to}`"
                          v-html="item.to_alias || helpers.shortcut(item.to)"
                          style="text-transform: none; text-decoration: none;"
                          class="px-1 text--primary hash"
                        />
                      </div>
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        class="text--secondary hash"
                        text
                        style="text-transform: none;"
                        :to="{name: 'operation_group', params: {hash: item.hash, network: item.network}}"
                        target="_blank"
                      >
                        <span v-html="helpers.shortcut(item.hash)"></span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider :key="`${id}-divider`" />
              </template>
            </v-list>
            <span v-intersect="onDownloadPage" v-if="!loading && !downloaded"></span>
          </v-card>

          <EmptyState v-else icon="mdi-transfer" text title="No transfers yet" />
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import EmptyState from "@/components/EmptyState.vue";
import AccountBox from "@/components/AccountBox.vue";

export default {
  name: "ContractTokensTab",
  props: {
    tokens: Array,
    network: String,
    address: String,
  },
  components: {
    EmptyState,
    AccountBox,
  },
  computed: {
    token() {
      if (this.selectedToken < 0 || this.selectedToken >= this.tokens.length)
        return null;
      return this.tokens[this.selectedToken];
    },
  },
  data: () => ({
    loading: false,
    loadingTransfers: false,
    total: 0,
    items: [],
    downloaded: false,
    selectedToken: -1,
  }),
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    getNextPage(tokenID) {
      if (this.downloaded || this.loadingTransfers) return;
      this.loadingTransfers = true;
      this.api
        .getContractTransfers(
          this.network,
          this.address,
          tokenID,
          20,
          this.items.length
        )
        .then((res) => {
          if (!res) return;
          this.items.push(...res.transfers);
          this.total = res.total;
          this.downloaded = this.total <= this.items.length;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loadingTransfers = false));
    },
    getIcon(status) {
      if (status === "applied") {
        return "mdi-check";
      } else if (status === "failed") {
        return "mdi-close";
      }
      return "mdi-information-outline";
    },
    getStatusColor(status) {
      if (status === "applied") {
        return "primary";
      } else if (status === "failed") {
        return "red";
      }
      return "lightgrey";
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getNextPage();
      }
    },
  },
  watch: {
    tokens: function () {
      this.selectedToken = 0;
    },
    selectedToken: function (newValue) {
      this.items = [];
      this.downloaded = false;
      this.total = 0;
      let token = this.tokens[newValue];
      this.getNextPage(token.token_id);
    },
  },
};
</script>


<style scoped>
.item {
  background-color: var(--v-canvas-base);
  opacity: 0.8;
}
</style>
