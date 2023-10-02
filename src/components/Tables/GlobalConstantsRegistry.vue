<template>
  <v-fade-transition>
    <v-skeleton-loader :loading="isGlobalConstantsLoading" type="article" class="global-constant-loader" transition="fade-transition">
      <v-data-table
          :items="globalConstantsItems"
          :headers="globalConstantsTableHeaders"
          :class="['ba-1 mt-4 bcd-table', {'hide-pagination-count' : hidePaginationCount}]"
          hide-default-footer
          :page.sync="page"
          :options="{itemsPerPage}"
          no-data-text="No global constants found"
          no-results-text="No global constants found"
          :server-items-length="constantsNumber"
          :footer-props="{
            itemsPerPageOptions: []
          }"
      >
        <template v-slot:item="{item}">
          <tr class="table-row" :key="item.address">
            <td>
              <v-btn
                  :to="`/constant/${network}/${item.address}/`"
                  class="text--secondary hash"
                  style="text-transform: none;"
                  text>
                <span v-past-html="helpers.shortcut(item.address, 8)"></span>
              </v-btn>
            </td>
            <td>
              <span class="text--secondary">{{ helpers.formatDatetime(item.timestamp) }}</span>
            </td>
            <td>
              <span class="text--secondary">{{ item.level }}</span>
            </td>
            <td>
              <span class="text--secondary">{{ item.links_count }}</span>
            </td>
          </tr>
        </template>
        <template v-slot:footer>
          <div class="footer-pagination">
            <span class="caption grey--text mr-2">{{ (page - 1) * itemsPerPage + 1 }} - {{ nextPageCount }} of {{ constantsNumber }}</span>
            <v-btn icon @click="changePage(page - 1)" :disabled="page === 1">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="changePage(page + 1)" :disabled="(constantsNumber / itemsPerPage) < page">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-fade-transition>
</template>

<script>
import {DATA_LOADING_STATUSES} from "../../utils/network";

export default {
  name: "GlobalConstantsRegistry",
  props: {
    network: String,
    constantsNumber: Number,
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
  methods: {
    init() {
      if (!this.network)
        return;

      this.recentlyCalledContracts = [];
      this.page = 1;
      this.fetchConstants();
    },
    // previousPage(newPage) {
    //   const offset = (newPage - 1) * this.itemsPerPage;
    //   this.changePage(newPage, offset)
    // },
    // nextPage(newPage) {
    //   this.changePage(newPage, offset)
    // },
    changePage(newPage) {
      const offset = (newPage - 1) * this.itemsPerPage;
      this.page = newPage;
      this.fetchConstants(offset);
    },
    async fetchConstants(offset = 0) {
      this.loadingGlobalConstantsStatus = DATA_LOADING_STATUSES.PROGRESS;

      this.globalConstantsItems = await this.api.getGlobalConstants(this.network, offset, this.itemsPerPage);

      this.loadingGlobalConstantsStatus = DATA_LOADING_STATUSES.SUCCESS;

    }
  },
  computed: {
    isGlobalConstantsLoading() {
      return this.loadingRecentlyCalledContractsStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    nextPageCount() {
      const count = this.page * this.itemsPerPage;
      return this.constantsNumber > 0 && count < this.constantsNumber ? count : this.constantsNumber;
    },
  },
  watch: {
    network: {
      handler() {
        this.init();
      },
      immediate: true
    },
  },
  data() {
    return {
      aliasMaxLength: 24,
      page: 1,
      loadingGlobalConstantsStatus: DATA_LOADING_STATUSES.NOTHING,
      globalConstantsTableHeaders: [
        {
          text: "Address",
          class: "pl-8",
          sortable: false,
        },
        {
          text: "Created",
          sortable: false,
        },
        {
          text: "Level",
          sortable: false,
        },
        {
          text: "References",
          sortable: false,
        },
      ],
      globalConstantsItems: [],
    }
  }
}
</script>

<style lang="scss" scoped>
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

.global-constant-loader {
  min-height: 420px;

  ::v-deep {
    .v-skeleton-loader__article {
      min-height: 420px;
    }
  }
}
</style>