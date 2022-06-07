<template>
  <v-fade-transition>
    <v-skeleton-loader :loading="isRecentlyCalledLoading" type="article" transition="fade-transition">
      <v-data-table
        :items="recentlyCalledContracts"
        :headers="recentlyCalledTableHeaders"
        class="ba-1 mt-4 avg-gas-consumption"
        :hide-default-footer="!pageable"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :footer-props="{
            itemsPerPageOptions: []
        }"
      >
        <template v-slot:item="{item}">
          <tr class="table-row">
            <td>
              <v-btn
                class="text--secondary hash"
                :to="`${network}/${item.address}/`"
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
                <span v-else v-html="helpers.shortcut(item.address)"></span>
              </v-btn>
            </td>
            <td>
              <span class="text--secondary">{{ item.tx_count }}</span>
            </td>
            <td>
              <span class="text--secondary">{{ item.last_action | fromNow }}</span>
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
          this.recentlyCalledContracts = this.recentlyCalledContracts.concat(data);
          this.loadingRecentlyCalledContractsStatus = DATA_LOADING_STATUSES.SUCCESS;
        });
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
      aliasMaxLength: 12,
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
.header-table {
  padding-left: 3px;
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
</style>