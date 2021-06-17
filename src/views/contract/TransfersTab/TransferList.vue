<template>
  <v-skeleton-loader :loading="loading && items.length == 0" type="list-item@5">
    <v-card flat outlined v-if="token && !contract" class="mb-4">
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
              <v-list-item-subtitle>{{
                token.decimals ? token.decimals : "not set"
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" v-if="token.supply">
          <v-list-item selectable>
            <v-list-item-content>
              <v-list-item-title class="overline">Supply</v-list-item-title>
              <v-list-item-subtitle
                >{{ helpers.round(token.supply, token.decimals) }}
                {{ token.symbol }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2" v-if="token.transfered">
          <v-list-item selectable>
            <v-list-item-content>
              <v-list-item-title class="overline">Transfered</v-list-item-title>
              <v-list-item-subtitle
                >{{
                  helpers.round(
                    token.transfered,
                    token.decimals ? token.decimals : 0
                  )
                }}
                {{ token.symbol }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <template v-for="(value, key) in token.extras">
          <v-col cols="2" :key="key">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-list-item selectable v-on="on">
                  <v-list-item-content>
                    <v-list-item-title class="overline">{{
                      key
                    }}</v-list-item-title>
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
          <v-list-item class="item__list-item" :class="statusHeaderClass(item.status)" :key="id">
            <v-row>
              <v-col cols="2" class="d-flex align-center justify-center pa-0">
                <span class="body-2 text--secondary">{{
                  helpers.formatDatetime(item.timestamp)
                }}</span>
              </v-col>
              <v-col cols="4" class="d-flex align-center justify-center pr-6">
                <span class="body-2">
                  {{
                    token
                        ? localizeNumber(helpers
                            .round(
                                item.amount,
                                token.decimals ? token.decimals : 0
                            ))
                        : item.amount
                  }}
                  <span v-if="token.symbol"
                    class="caption text-uppercase font-weight-regular text--disabled"
                    >{{ token.symbol }}</span
                  >
                </span>
              </v-col>
              <v-col cols="4" class="d-flex align-center">
                <div>
                  <span
                    class="caption text-uppercase font-weight-regular accent--text"
                    v-if="!item.to && address === item.from"
                  >
                    {{ item.parent || 'Burn' }}&nbsp;
                  </span>
                  <span
                    class="caption text-uppercase font-weight-regular text--secondary"
                    v-else-if="item.from && item.from !== address"
                  >
                    {{ item.parent }}&nbsp;From&nbsp;
                  </span>
                  <span
                    v-else-if="!item.from && address === item.to"
                    class="caption text-uppercase font-weight-regular secondary--text"
                  >
                    {{ item.parent || 'Mint' }}&nbsp;
                  </span>
                  <router-link
                    v-if="item.from && address !== item.from"
                    text
                    v-html="item.from_alias || helpers.shortcut(item.from)"
                    style="text-transform: none; text-decoration: none"
                    class="px-1 text--primary hash"
                    :to="`/${item.network}/${item.from}`"
                  />&nbsp;
                  <span
                    v-if="item.to && address !== item.to"
                    class="caption text-uppercase font-weight-regular text--secondary"
                    >&nbsp;{{ item.parent }}&nbsp;to&nbsp;</span
                  >
                  <router-link
                    v-if="item.to && address !== item.to"
                    text
                    :to="`/${item.network}/${item.to}`"
                    v-html="item.to_alias || helpers.shortcut(item.to)"
                    style="text-transform: none; text-decoration: none"
                    class="px-1 text--primary hash"
                  />
                </div>
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-end">
                <v-btn
                  class="text--secondary hash hash-link"
                  text
                  style="text-transform: none"
                  :to="{
                    name: 'operation_group',
                    params: { hash: item.hash, network: item.network },
                  }"
                  target="_blank"
                >
                  <v-icon color="lightgrey" small>mdi-open-in-new</v-icon>
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
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@/components/Cards/EmptyState.vue";
import { numberToLocalizeString } from '@/utils/tz';
import {getContentItemHeaderClass} from "@/utils/styles";

export default {
  name: "TransferList",
  props: {
    network: String,
    address: String,
    contract: String,
    token: Object,
  },
  components: {
    EmptyState,
  },
  data: () => ({
    items: [],
    loading: false,
    downloaded: false,
    total: 0,
    lastId: "",
    maxSize: 10
  }),
  mounted() {
    this.getNextPage();
  },
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    statusHeaderClass(status) {
      return getContentItemHeaderClass(status);
    },
    localizeNumber(number) {
      return numberToLocalizeString(number, this.token.decimals ? this.token.decimals : 0)
    },
    getNextPage() {
      if (!this.token) return;
      if (this.downloaded || this.loading) return;
      this.loading = true;

      if (!this.contract) {
        this.api_contract
          .getContractTransfers(
            this.network,
            this.address,
            this.token.token_id,
            this.maxSize,
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
          .finally(() => (this.loading = false));
      } else {
         this.api_tokens
          .getAccountTransfers(
            this.network,
            this.address,
            this.token.token_id,
            [this.contract],
            this.maxSize,
            this.lastId
          )
          .then((res) => {
            if (!res) return;
            this.items.push(...res.transfers);
            this.lastId = res.last_id;
            this.total = res.total;
            this.downloaded = this.total <= this.items.length;
          })
          .catch((err) => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => (this.loading = false));
      }
    },
    onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getNextPage();
      }
    },
  },
  watch: {
    address: "getNextPage",
    token: {
      deep: true,
      handler: function (){
        this.downloaded = false;
        this.items = [];
        this.lastId = '';
        this.getNextPage();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  background-color: var(--v-canvas-base);
  opacity: 0.8;
}
.hash-link {
  max-width: 100%;
}
.item-header-applied {
  border-color: transparent;
}
</style>
