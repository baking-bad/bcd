<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="table">
      <v-data-table
        :items="viewedDomains"
        :headers="headers"
        class="ba-1 avg-gas-consumption"
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <span class="text--secondary">{{ item.name }}</span>
            </td>
            <td>
              <v-btn
                class="text--secondary hash"
                :to="`/${network}/${item.address}`"
                style="text-transform: none"
                target="_blank"
                text
              >
                <span v-html="helpers.shortcut(item.address)"></span>
              </v-btn>
            </td>
            <td>
              <span
                class="text--secondary"
                v-if="item.expiration !== '0001-01-01T00:00:00Z'"
                >{{ item.expiration | formatShortTime }}</span
              >
            </td>
            <td>
              <span
                class="text--secondary"
                >{{ item.timestamp | fromNow }}</span
              >
            </td>
          </tr>
        </template>
        <template v-slot:footer>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <span class="caption grey--text mr-4"
              >{{ page * page_size }} - {{ endSlice }} of {{ total }}</span
            >
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
  name: "DomainTab",
  props: {
    network: String,
  },
  computed: {
    page_size() {
      return PAGE_SIZE;
    },
    endSlice() {
      return Math.min(this.domains.length, (this.page + 1) * PAGE_SIZE);
    },
    viewedDomains() {
      return this.domains.slice(
        this.page * PAGE_SIZE,
        (this.page + 1) * PAGE_SIZE
      );
    },
    headers() {
      return [
        {
          text: "Name",
          sortable: false,
        },
        {
          text: "Address",
          class: "pl-8",
          sortable: false,
        },
        {
          text: "Expiration",
          sortable: false,
        },
        {
          text: "Last update",
          sortable: false,
        },
      ];
    },
  },
  data: () => {
    return {
      loading: true,
      domains: [],
      page: 0,
      total: 0,
    };
  },
  mounted() {
    this.getDomains(this.network);
  },
  methods: {
    ...mapActions(["showError"]),
    getDomains(network) {
      this.loading = true;

      this.api
        .listDomains(network, this.domains.length, PAGE_SIZE)
        .then((res) => {
          if (!res) return;
          this.total = res.total;
          if (res.domains)
            this.domains.push(...res.domains);
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
      if (this.domains.length == this.page * PAGE_SIZE) {
        this.getDomains(this.network);
      }
    },
  },
  watch: {
    network: function (newValue) {
      this.domains = [];
      this.page = 0;
      this.total = 0;
      this.getDomains(newValue);
    },
  },
};
</script>