<template>
  <v-fade-transition>
    <v-skeleton-loader :loading="isRecentlyCalledLoading" class="recently-loader" type="article" transition="fade-transition">
      <v-data-table
        :items="recentlyCalledContracts"
        :headers="recentlyCalledTableHeaders"
        :class="['ba-1 mt-4 avg-gas-consumption', {'hide-pagination-count' : hidePaginationCount}]"
        :hide-default-footer="!pageable"
        :page.sync="page"
        :options="{itemsPerPage}"
        :footer-props="{
            itemsPerPageOptions: []
        }"
      >
        <template v-slot:item="{item}">
          <tr class="table-row">
            <td>
              <v-btn
                class="text--secondary hash"
                :to="`/${network}/${item.address}/`"
                style="text-transform: none;"
                text>
                        <span v-if="item.alias">
                          {{
                            item.alias.length > aliasMaxLength
                              ? item.alias.slice(0, aliasMaxLength).trim()
                              : item.alias
                          }}<em
                          v-if="item.alias.length > aliasMaxLength"
                          class="v-icon notranslate mdi mdi-dots-horizontal"
                          style="font-size: 16px;"
                        />
                        </span>
                <span v-else v-html="helpers.shortcut(item.address, 8)"></span>
              </v-btn>
            </td>
            <td>
              <span class="text--secondary">{{ item.tx_count }}</span>
            </td>
            <td>
              <span class="text--secondary">{{ helpers.formatDatetime(item.last_action)  }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-fade-transition>
</template>

<script>
import {DATA_LOADING_STATUSES} from "../../utils/network";

export default {
  name: "RecentlyCalledContracts",
  props: {
    network: String,
    updateable: {
      type: Boolean,
      default: true,
    },
    hidePaginationCount: {
      type: Boolean,
      default: false,
    },
    pageable: {
      type: Boolean,
      default: false,
    },
    itemsPerPage: {
      type: Number,
      default: 3,
    }
  },
  computed: {
    isRecentlyCalledLoading() {
      return this.loadingRecentlyCalledContractsStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
  },
  created() {
    this.init();
  },
  destroyed() {
    if (this.updateable) {
      this.stopListeningRecentlyCalledContracts();
    }
  },
  methods: {
    init() {
      if (this.updateable) {
        this.listenRecentlyCalledContracts();
      } else {
        const request = this.requestRecentlyCalledContracts();
        if (this.pageable) {
          request.then(() => this.page = 1);
        }
      }
    },
    listenRecentlyCalledContracts() {
      this.requestRecentlyCalledContracts();
      this.listenerRecentlyCalledContracts = setTimeout(() => {
        this.listenRecentlyCalledContracts();
      }, 30 * 1000);
    },
    stopListeningRecentlyCalledContracts() {
      this.recentlyCalledContracts = [];
      clearTimeout(this.listenerRecentlyCalledContracts);
    },
    requestRecentlyCalledContracts(offset = 0) {
      this.loadingRecentlyCalledContractsStatus = DATA_LOADING_STATUSES.PROGRESS;
      return this.api.getRecentlyCalledContracts(this.network, this.itemsPerPage, offset)
        .then((data) => {
          this.recentlyCalledContracts = this.pageable ? this.recentlyCalledContracts.concat(data) : data;
          this.loadingRecentlyCalledContractsStatus = DATA_LOADING_STATUSES.SUCCESS;
          return data;
        })
        .then((data) => this.getAliases(data));
    },
    async getAliases(contracts) {
      for (const idx in contracts) {
        if (contracts[idx].alias) continue;        
        contracts[idx].alias = await this.getAlias(this.network, contracts[idx].address);
      }
    },
  },
  watch: {
    network() {
      this.recentlyCalledContracts = [];
      this.page = -1;
      this.init();
    },
    page(val) {
      if (val === this.recentlyCalledContracts.length / this.itemsPerPage) {
        this.requestRecentlyCalledContracts(this.recentlyCalledContracts.length);
      }
    }
  },
  data() {
    return {
      aliasMaxLength: 24,
      page: 0,
      loadingRecentlyCalledContractsStatus: DATA_LOADING_STATUSES.NOTHING,
      recentlyCalledTableHeaders: [
        {
          text: "Contract",
          class: "pl-8",
          sortable: false,
        },
        {
          text: "Calls",
          sortable: false,
        },
        {
          text: "Last active",
          class: "pl-8",
          sortable: false,
        },
      ],
      recentlyCalledContracts: [],
      listenerRecentlyCalledContracts: null,
    }
  }
}
</script>

<style lang="scss" scoped>
.avg-gas-consumption {
  background: var(--v-data-base)!important;
  tbody tr:hover {
    background: var(--v-sidebar-base)!important;
  }
}
.table-row {
  & > td:first-child {
    width: 55%;
  }
}
::v-deep .v-data-table-header {
  & > tr > th:last-child,
  & + tbody > tr > td:last-child {
    padding-left: 0 !important;
  }
  & > tr > th > span {
    font-size: 16px;
    font-weight: 400;
  }
}

.recently-loader {
  min-height: 420px;

  ::v-deep {
    .v-skeleton-loader__article {
      min-height: 420px;
    }
  }
}

</style>