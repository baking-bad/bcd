<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-skeleton-loader :loading="isLoading" type="table">
      <v-data-table :items="currentlyLoadedSameContracts" :headers="headers" class="ba-1 avg-gas-consumption" hide-default-footer>
        <template v-slot:top>
          <v-toolbar flat color="sidebar">
            <span class="table-title mx-auto">Same contracts</span>
          </v-toolbar>
        </template>
        <template v-slot:item="{item}">
          <tr>
            <td>
              <v-btn
                class="text--secondary hash"
                :to="`/${item.network}/${item.address}/`"
                style="text-transform: none;"
                target="_blank"
                text>
                <span v-if="item.alias">
                  {{
                    item.alias.length > aliasMaxLength
                      ? item.alias.slice(0, aliasMaxLength).trim()
                      : item.alias
                  }}<i
                  v-if="item.alias.length > aliasMaxLength"
                  class="v-icon notranslate mdi mdi-dots-horizontal"
                  style="font-size: 16px;"
                />
                </span>
                <span v-else v-html="helpers.shortcut(item.address)"></span>
              </v-btn>
            </td>
            <td>
              <span class="text--secondary">{{ item.network }}</span>
            </td>
            <td>
              <span class="text--secondary">{{ item.last_action | fromNow }}</span>
            </td>
          </tr>
        </template>
        <template v-slot:footer>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <span
              class="caption grey--text mr-4"
            >{{ page*page_size }} - {{ endSlice }} of {{ totalPages }}</span>
            <v-btn icon @click="left" :disabled="page === 0">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="right" :disabled="endSlice === totalPages">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import {DATA_LOADING_STATUSES} from "../../../utils/network";
import {mapActions} from "vuex";

const PAGE_SIZE = 10;

export default {
  name: "SameContractsTab",
  props: {
    sameContracts: Array,
    sameCount: Number,
    network: String,
    address: String,
  },
  computed: {
    page_size() {
      return PAGE_SIZE;
    },
    endSlice() {
      return Math.min(this.sameCount, (this.page + 1) * PAGE_SIZE);
    },
    totalPages() {
      return Math.max(Math.floor(this.sameCount / this.page_size), 1);
    },
    isLoading() {
      return this.sameContractsLoadingStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
  },
  methods: {
    ...mapActions(['showError']),
    left() {
      if (this.page > 0) this.page--;
    },
    right() {
      this.page++;
    },
    requestSame(offset) {
      this.sameContractsLoadingStatus = DATA_LOADING_STATUSES.PROGRESS;
      this.api
        .getSameContracts(this.network, this.address, offset)
        .then((res) => {
          if (!res) return;
          this.currentlyLoadedSameContracts = res.contracts;
          this.sameContractsLoadingStatus = DATA_LOADING_STATUSES.SUCCESS;
        })
        .catch((err) => {
          this.showError(err);
          this.sameContractsLoadingStatus = DATA_LOADING_STATUSES.ERROR;
        });
    }
  },
  watch: {
    page(val) {
      this.requestSame(this.page_size * val);
    },
  },
  created() {
    this.currentlyLoadedSameContracts = this.sameContracts;
    if (this.sameContracts.length === 0) {
      this.requestSame(0);
    }
  },
  data() {
    return {
      page: 0,
      aliasMaxLength: 12,
      currentlyLoadedSameContracts: [],
      sameContractsLoadingStatus: DATA_LOADING_STATUSES.NOTHING,
      headers: [
        {
          text: "Contract",
          class: "pl-8",
          sortable: false,
        },
        {
          text: "Network",
          sortable: false,
        },
        {
          text: "Last active",
          sortable: false,
        },
      ],
    }
  }
}
</script>