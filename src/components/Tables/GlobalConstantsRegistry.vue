<template>
  <v-fade-transition>
    <v-skeleton-loader :loading="isGlobalConstantsLoading" type="article" class="global-constant-loader" transition="fade-transition">
      <v-data-table
          :items="globalConstantsItems"
          :headers="globalConstantsTableHeaders"
          :class="['ba-1 mt-4 avg-gas-consumption', {'hide-pagination-count' : hidePaginationCount}]"
          hide-default-footer
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
            <v-btn icon @click="changePage(page - 1)" :disabled="page === 0">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="changePage(page + 1)" :disabled="isLastPage">
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
  directives: {
    pastHtml: {
      inserted(el, binding) {
        el.insertAdjacentHTML('afterbegin', binding.value);
      }
    }
  },
  methods: {
    init() {
      this.page = 0
      this.globalConstantsItems = [];
      this.fetchConstants();
    },
    changePage(newPageNum) {
      this.page = newPageNum;
      this.fetchConstants();
    },
    async fetchConstants() {
      this.loadingGlobalConstantsStatus = DATA_LOADING_STATUSES.PROGRESS;

      const offset = this.page * this.itemsPerPage;
      const constants = await this.api.getGlobalConstants(this.network, offset, this.itemsPerPage);
      this.globalConstantsItems = [...constants];

      this.isLastPage = this.globalConstantsItems.length < this.itemsPerPage;

      this.loadingGlobalConstantsStatus = DATA_LOADING_STATUSES.SUCCESS;

    }
  },
  computed: {
    isGlobalConstantsLoading() {
      return this.loadingRecentlyCalledContractsStatus === DATA_LOADING_STATUSES.PROGRESS;
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
      page: 0,
      isLastPage: true,
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
.avg-gas-consumption {
  background: var(--v-data-base) !important;

  tbody tr:hover {
    background: var(--v-sidebar-base) !important;
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


.footer-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: thin solid rgba(255, 255, 255, 0.12);
  padding: 0 8px;

  button {
    width: 43px;
    margin-left: 7px;
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