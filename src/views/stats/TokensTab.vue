<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="table">
      <v-data-table :items="viewedTokens" :headers="headers" class="ba-1 avg-gas-consumption" hide-default-footer>
        <template v-slot:item="{item}">
          <tr>
            <td>
              <v-btn 
                class="text--secondary hash"
                :to="`/${item.network}/${item.address}`"
                style="text-transform: none;"
                target="_blank"
                text>
                <span v-if="item.alias">{{ item.alias }}</span>
                <span v-else v-html="helpers.shortcut(item.address)"></span>
              </v-btn>
            </td>
            <td>
              <span class="text--secondary">{{ item.last_action | fromNow }}</span>
            </td>
            <template v-for="(method, key) in item.methods">
              <td :key="key">
                <v-icon
                  small
                  class="mb-1 mr-1"
                  :class="method.call_count > 0 ? 'info--text' : 'text--disabled'"
                >mdi-fire</v-icon>
                <span
                  class="hash"
                  :class="method.call_count > 0 ? '' : 'text--disabled'"
                >{{ method.average_consumed_gas }}</span>
              </td>
            </template>
          </tr>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="sidebar">
            <span class="table-title mx-auto">Average gas consumption</span>
          </v-toolbar>
        </template>
        <template v-slot:footer>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <span
              class="caption grey--text mr-4"
            >{{ page*page_size }} - {{ endSlice }} of {{ total }}</span>
            <v-btn icon @click="left" :disabled="page == 0">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="right" :disabled="endSlice == total">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

const PAGE_SIZE = 10;

export default {
  name: "TokenTab",
  props: {
    network: String,
  },
  computed: {
    page_size() {
      return PAGE_SIZE;
    },
    endSlice() {
      return Math.min(this.tokens.length, (this.page + 1) * PAGE_SIZE);
    },
    viewedTokens() {
      return this.tokens.slice(
        this.page * PAGE_SIZE,
        (this.page + 1) * PAGE_SIZE
      );
    },
    selectedVersion() {
      return this.$route.path.split('/').reverse()[0];
    },
  },
  data: () => ({
    loading: true,
    tokens: [],
    page: 0,
    total: 0,
    headers: [
      {
        text: "Contract",
        class: "pl-8",
        sortable: false,
      },
      {
        text: "Last active",
        sortable: false,
      },
    ],
  }),
  created() {
    this.getTokensInfo(this.network, this.selectedVersion);
  },
  methods: {
    ...mapActions(["showError"]),
    getTokensInfo(network, version) {
      this.loading = true;

      this.api
        .getTokensByVersion(network, version, this.tokens.length, PAGE_SIZE)
        .then((res) => {
          if (!res) return;
          this.total = res.total;

          this.tokens.push(...res.tokens);
          if (this.tokens.length > 0) {
            this.headers = this.headers.splice(0, 2);
            let methods = this.tokens[0].methods;
            Object.keys(methods).forEach((element) => {
              this.headers.push({
                text: element,
                align: "left",
                sortable: false
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    left() {
      if (this.page > 0) this.page--;
    },
    right() {
      this.page++;
      if (this.tokens.length == this.page * PAGE_SIZE) {
        this.getTokensInfo(this.network, this.selectedVersion);
      }
    }
  },
  watch: {
    network: function (newValue) {
      this.tokens = [];
      this.page = 0;
      this.total = 0;
      this.getTokensInfo(newValue, this.selectedVersion);
    },
    selectedVersion: function (newValue) {
      this.tokens = [];
      this.page = 0;
      this.total = 0;
      this.getTokensInfo(this.network, newValue);
    },
  },
};
</script>

<style>
thead.v-data-table-header > tr > th {
  font-size: 16px;
  font-weight: 400;
}
.avg-gas-consumption tbody tr:hover {
  background: var(--v-sidebar-base) !important;
}
.avg-gas-consumption {
  background: var(--v-data-base) !important;
}
.table-title {
  font-family: "Roboto Condensed", sans-serif;
  font-size: 18px;
}
.custom-link:hover {
  cursor: pointer;
}
</style>