<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-skeleton-loader :loading="isLoading" type="table">
      <v-data-table v-show="currentlyLoadedSameContracts.length > 0" :items="currentlyLoadedSameContracts" :headers="headers" class="ba-1 avg-gas-consumption" hide-default-footer>
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
            <v-btn icon @click="right" :disabled="isRightDisabled">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <v-data-table v-show="migrations.length > 0" :items="migrations" :headers="migrationHeaders" class="ba-1 avg-gas-consumption mt-6" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat color="sidebar">
          <span class="table-title mx-auto">Migrations</span>
        </v-toolbar>
      </template>
      <template v-slot:item="{item}">
        <tr>
          <td class="px-8">
            <v-icon v-if="item.kind === 'bootstrap'" color="blue">mdi-information-outline</v-icon>
            <v-icon v-if="item.kind === 'lambda'" color="orange">mdi-alert-outline</v-icon>
            <v-icon v-else color="purple">mdi-alert-outline</v-icon>
            <span class="text--secondary">
              {{
                item.kind === 'lambda'
                  ? 'Potential change in logic'
                  : item.kind === 'update'
                    ? 'Code was altered'
                    : 'Vesting contract'
              }}
            </span>
          </td>
          <td>
            <span class="text--secondary">{{ item.timestamp | formatDate }}</span>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {DATA_LOADING_STATUSES} from "../../../utils/network";
import {mapActions} from "vuex";

const PAGE_SIZE = 10;

export default {
  name: "DetailsTab",
  props: {
    sameContracts: Array,
    sameCount: Number,
    network: String,
    address: String,
    migrations: Array,
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
    isRightDisabled() {
      return this.endSlice >= this.totalPages;
    }
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
    sameContracts: {
      handler(val) {
        this.currentlyLoadedSameContracts = val;
        if (this.sameContracts.length === 0) {
          this.requestSame(0);
        }
      },
      immediate: true,
    },
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
      migrationHeaders: [
        {
          text: "Action",
          class: "pl-8",
          sortable: false,
        },
        {
          text: "Date",
          sortable: false,
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  margin-top: 1.25rem;
}
</style>