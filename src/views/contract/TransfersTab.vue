<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-card flat outlined v-if="items.length > 0">
      <v-list class="py-0 item">
        <template v-for="(item, id) in items">
          <v-list-item :key="id">
            <v-row>
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-icon :color="getStatusColor(item.status)">{{ getIcon(item.status) }}</v-icon>
              </v-col>
              <v-col cols="2" class="d-flex align-center">
                <span class="body-1 text--secondary">{{ helpers.formatDatetime(item.timestamp) }}</span>
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-end pr-6">
                <span class="body-1">
                  {{ item.token ? (item.amount / 10 ** item.token.decimals).toFixed(item.token.decimals) : item.amount }}
                  <span
                    class="caption text-uppercase font-weight-regular text--disabled"
                  >{{ item.token ? item.token.symbol : 'tok'}}</span>
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
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TransfersTab",
  props: {
    transfers: Object,
    network: String,
    address: String,
  },
  data: () => ({
    loading: false,
    total: 0,
    items: [],
    downloaded: false,
  }),
  mounted() {
    if (this.transfers) {
      this.total = this.transfers.total;
      this.items = this.transfers.transfers;
      this.downloaded = this.total <= this.items.length;
    }
  },
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    getNextPage() {
      if (this.downloaded || this.loading) return;
      this.loading = true;
      this.api
        .getContractTransfers(this.network, this.address, 20, this.items.length)
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
    transfers: function (newValue) {
      if (!newValue) return;
      this.total = newValue.total;
      this.items = newValue.transfers;
      this.downloaded = this.total === this.items.length;
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
