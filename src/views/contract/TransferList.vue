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
              <v-list-item-subtitle>{{ token.decimals }}</v-list-item-subtitle>
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
                >{{ helpers.round(token.transfered, token.decimals) }}
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
          <v-list-item :key="id">
            <v-row>
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-icon :color="getStatusColor(item.status)">{{
                  getIcon(item.status)
                }}</v-icon>
              </v-col>
              <v-col cols="2" class="d-flex align-center">
                <span class="body-2 text--secondary">{{
                  helpers.formatDatetime(item.timestamp)
                }}</span>
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-end pr-6">
                <span class="body-2">
                  {{
                    token
                      ? helpers
                          .round(item.amount, token.decimals)
                          .toLocaleString(undefined, {
                            maximumFractionDigits: token.decimals,
                          })
                      : item.amount
                  }}
                  <span
                    class="caption text-uppercase font-weight-regular text--disabled"
                    >{{
                      token.symbol ? token.symbol : `tok_${item.token_id}`
                    }}</span
                  >
                </span>
              </v-col>
              <v-col cols="5" class="d-flex align-center">
                <div>
                  <span
                    class="caption text-uppercase font-weight-regular text--secondary"
                    >From&nbsp;</span
                  >
                  <router-link
                    v-if="address != item.from"
                    text
                    v-html="item.from_alias || helpers.shortcut(item.from)"
                    style="text-transform: none; text-decoration: none"
                    class="px-1 text--primary hash"
                    :to="`/${item.network}/${item.from}`"
                  /><span
                    v-else
                    v-html="item.from_alias || helpers.shortcut(item.from)"
                    style="text-transform: none; text-decoration: none"
                    class="px-1 text--secondary hash"
                  />&nbsp;
                  <span
                    class="caption text-uppercase font-weight-regular text--secondary"
                    >&nbsp;to&nbsp;</span
                  >
                  <router-link
                    v-if="address != item.to"
                    text
                    :to="`/${item.network}/${item.to}`"
                    v-html="item.to_alias || helpers.shortcut(item.to)"
                    style="text-transform: none; text-decoration: none"
                    class="px-1 text--primary hash"
                  /><span
                    v-else
                    v-html="item.to_alias || helpers.shortcut(item.to)"
                    style="text-transform: none; text-decoration: none"
                    class="px-1 text--secondary hash"
                  />
                </div>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="text--secondary hash"
                  text
                  style="text-transform: none"
                  :to="{
                    name: 'operation_group',
                    params: { hash: item.hash, network: item.network },
                  }"
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
</template>

<script>
import { mapActions } from "vuex";

import EmptyState from "@/components/EmptyState.vue";

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
  }),
  mounted() {
    this.getNextPage();
  },
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    getNextPage() {
      if (!this.token) return;
      if (this.downloaded || this.loading) return;
      this.loading = true;

      if (!this.contract) {
        this.api
          .getContractTransfers(
            this.network,
            this.address,
            this.token.token_id,
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
          .finally(() => (this.loading = false));
      } else {
        this.api
          .getAccountTransfers(
            this.network,
            this.address,
            this.token.token_id,
            [this.contract],
            20,
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
    address: "getNextPage",
    token: "getNextPage",
  },
};
</script>


<style scoped>
.item {
  background-color: var(--v-canvas-base);
  opacity: 0.8;
}
</style>
