<template>
  <v-fade-transition>
      <v-data-table
        :items="recentlyCalledContracts"
        :headers="recentlyCalledTableHeaders"
        :class="['ba-1 mt-4 recently-called', {'hide-pagination-count' : hidePaginationCount}]"
        hide-default-footer
        :page.sync="page"
        :options="{itemsPerPage}"
        :loading="loading"
        loading-text="Loading recently called contracts... Please wait"
        no-data-text="No called contracts found"
        no-results-text="No called contracts found"
        :server-items-length="totalItems"
        :footer-props="{
            itemsPerPageOptions: []
        }"
      >
        <template v-slot:item="{item}" >
          <tr class="table-row" :key="item.address">
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
                <Shortcut v-else :str="item.address"/>
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
        <template v-slot:footer v-if="pageable">
          <div class="footer-pagination">
            <span class="caption grey--text mr-2">{{ (page - 1) * itemsPerPage+1 }} - {{ nextPageCount }} of {{ totalItems }}</span>
            <v-btn icon @click="changePage(page-1)" :disabled="page === 1">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="changePage(page+1)" :disabled="(totalItems  / itemsPerPage) < page">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
  </v-fade-transition>
</template>

<script>
import Shortcut from '../Shortcut.vue';
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
        offset() {
            return this.recentlyCalledContracts.length;
        },
        nextPageCount() {
            const count = this.page * this.itemsPerPage;
            return this.totalItems > 0 && count < this.totalItems ? count : this.totalItems;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        changePage(page) {
            const offset = this.page * this.itemsPerPage;
            this.page = page;
            this.requestRecentlyCalledContracts(offset);
        },
        async init() {
            if (!this.network)
                return;

            this.requestRecentlyCalledContracts();
            if (!this.updateable) {
                this.totalItems = Number((await this.api.getContractsCount(this.network)));
            }
        },
        requestRecentlyCalledContracts(offset = 0) {
            if (this.loading)
                return;
            this.loading = true;
            return this.api.getRecentlyCalledContracts(this.network, this.itemsPerPage, offset)
                .then((data) => {
                this.recentlyCalledContracts = data;
                return data;
            })
                .then((data) => this.getAliases(data))
                .finally(() => this.loading = false);
        },
        async getAliases(contracts) {
            for (const idx in contracts) {
                contracts[idx].alias = await this.getAlias(this.network, contracts[idx].address);
            }
        },
    },
    watch: {
        network(val, old) {
          if (val === old)
              return;
          this.recentlyCalledContracts = [];
          this.page = 1;
          this.init();
        },
    },
    data() {
        return {
            aliasMaxLength: 24,
            page: 1,
            totalItems: -1,
            loading: false,
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
        };
    },
    components: { Shortcut }
}
</script>

<style lang="scss" scoped>
.recently-called {
  background: var(--v-data-base)!important;
}

.table-row {  
  & > td:first-child {
    width: 55%;
  }
}

.table-row:hover {
  background: var(--v-sidebar-base)!important;
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