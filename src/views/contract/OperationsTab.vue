<template>
  <v-container fluid class="pa-8 ma-0 canvas fill-canvas">
    <OperationFilters :contract="contract" v-model="openFilters" @filterChanged="filterChanged" :filters="filters" v-if="searchable"/>
    <v-row>
      <v-col cols="9">
        <v-row v-if="searchable">
          <v-col cols="12">
             <v-text-field
              v-model="search"
              color="primary"
              placeholder="Start entering hash of operation, source or destination address"
              clearable
              outlined
              background-color="data"
              single-line
              hide-details
            >
              <template v-slot:append-outer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">                    
                      <v-btn icon @click="openFilters = !openFilters" v-bind="attrs" v-on="on" style="top: -6px;">
                        <v-badge dot overlap bordered :value="isEmptyFilters ? '' : 'F'">
                          <v-icon>mdi-filter-variant</v-icon>
                        </v-badge>
                      </v-btn>
                  </template>
                  <span>Filters</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-skeleton-loader
              :loading="loading"
              type="list-item-two-line, list-item-two-line, list-item-two-line"
            >
              <EmptyState
                v-if="items.length === 0"
                title="Nothing found"
                text="Empty set is also a result, otherwise try a broader query"
              />
              <v-expansion-panels
                v-show="items.length !== 0"
                multiple
                hover
                flat
                class="bb-1"
              >
                <ContentItem
                  :data="item"
                  :address="address"
                  :network="network"
                  v-for="(item, key) in items"
                  :key="item.hash + '_' + item.counter + '_' + key"
                />
              </v-expansion-panels>
              <v-skeleton-loader
                v-show="operationsLoading || mempoolLoading"
                :loading="operationsLoading || mempoolLoading"
                type="list-item-two-line, list-item-two-line, list-item-two-line"
              >
              </v-skeleton-loader>
              <span
                v-intersect="onDownloadPage"
                v-if="!loading && !downloaded"
              ></span>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
          <template v-if="isContract">
            <ContractInfo
              :address="address"
              :network="network"
              :alias="alias"
              :contract="contract"
              :balance="balance"
            />
          </template>
          <template v-else-if="isSmartRollup">
            <SmartRollupInfo
              :address="address"
              :network="network"
              :alias="alias"
            />
          </template>
          <template v-else-if="isAccount">
            <AccountInfo
              :address="address"
              :network="network"
              :alias="alias"
              :contract="contract"
              :balance="balance"
            />
          </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import OperationFilters from "@/views/contract/OperationFilters.vue";
import ContentItem from "@/views/contract/ContentItem.vue";
import EmptyState from "@/components/Cards/EmptyState.vue";
import dayjs from "dayjs";
import AccountInfo from "./InfoSection/AccountInfo.vue";
import ContractInfo from "./InfoSection/ContractInfo.vue";
import SmartRollupInfo from "./InfoSection/SmartRollupInfo.vue";

export default {
  name: "OperationsTab",
  props: {
    accountType: String,
    address: String,
    network: String,
    alias: String,
    balance: Number,
    contract: Object,
  },
  components: {
    ContentItem,
    EmptyState,
    OperationFilters,
    AccountInfo,
    ContractInfo,
    SmartRollupInfo,
  },
  data: () => ({
    openFilters: false,
    operations: [],
    mempool: [],
    downloaded: false,
    operationsLoading: false,
    mempoolLoading: false,
    last_id: 0,
    filters: {
      entrypoints: [],
      status: [],
      dates: []
    },
    search: '',
  }),
  created() {
    this.fetchOperations();
  },
  computed: {
    searchable() {
      return this.searchService.created()
    },
    loading() {
      return this.items.length === 0 && (this.operationsLoading || this.mempoolLoading);
    },
    items() {
      if (this.operations.length === 0) {
        return [];
      }
      let operations = this.operations;
      if (this.config.mempool_enabled) {
        let mempoolOperations = this.getDisplayedMempool();
        if (mempoolOperations.length > 0) {
          operations = operations
              .concat(mempoolOperations)
              .sort(this.compareOperations);
        }
      }
      return operations;
    },
    isContract() {
      return this.accountType === 'contract';
    },
    isAccount() {
      return this.accountType === 'account';
    },
    isSmartRollup() {
      return this.accountType === 'smart_rollup';
    },
    isEmptyFilters() {
      return this.filters.dates.length == 0 &&
        this.filters.entrypoints.length == 0 &&
        this.filters.status.length == 0 &&
        (this.search === '' || this.search === null)
    },
    timestampFilter() {
      let timestamps = this.filters.dates.map((d) => dayjs(d).unix() * 1000).sort();
      if (timestamps.length === 2) {
        return {
          gt: timestamps[0], 
          lte: timestamps[1] + 86400000
        };
      } else if (timestamps.length === 1) {
        return {
          gt: timestamps[0], 
          lte: timestamps[0] + 86400000
        };
      }
      return null;
    }
  },
  destroyed() {
    this.hideError();
  },
  methods: {
    ...mapActions(["showError", "hideError"]),
    filterChanged(filters) {
      this.filters = filters;
      this.applyFilter(true);
    },
    compareOperations(a, b) {
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      return 0;
    },

    getTimestamps() {
      let timestamps = this.dates.map((d) => dayjs(d).unix() * 1000).sort();
      if (timestamps.length === 2) {
        return [timestamps[0], timestamps[1] + 86400000];
      } else if (timestamps.length === 1) {
        return [timestamps[0], timestamps[0] + 86400000];
      } else {
        return [0, 0];
      }
    },
    getEntrypoints() {
      if (!this.isContract) return;
      this.api
        .getContractEntrypoints(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.availableEntrypoints = res.map((x) => x.name);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    clearData() {
        this.operations = [];
        this.downloaded = false;
        this.last_id = 0;
    },
    getOperations(clearData = false) {
      if (this.operationsLoading || (this.downloaded && !clearData)) return;

      this.operationsLoading = true;
      if (clearData) this.clearData();

      this.api
        .getAccountOperationGroups(
          this.network,
          this.address,
          this.last_id,
          10,
        )
        .then((res) => {
          if (!res) {
            this.downloaded = true; // prevent endless polling
          } else {
            this.downloaded = res.length === 0;
            if (res.length > 0){
              this.last_id = res[res.length - 1].last_id;
              this.operations.push(...res);
            }
          }
        })
        .catch((err) => {
          this.showError(err);
          this.downloaded = true;
        })
        .finally(() => {
          this.operationsLoading = false;
        });
    },
    getMempool() {
      if (this.mempoolLoading) return;
      this.mempoolLoading = true;

      this.api
        .getContractMempool(this.network, this.address)
        .then((res) => {
          this.mempool = res;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => (this.mempoolLoading = false));
    },
    getDisplayedMempool() {
      if (this.search) return [];
      if (!this.mempool || this.mempool.length === 0) return [];
      if (!this.isEmptyFilters) {
        return [];
      }
      return this.mempool;
    },
    pushOperationsFromSearch(data) {
      data.forEach((element) => {
        this.operations.push({
          timestamp: element.body['@timestamp'],
          hash: element.body.Hash,
          counter: element.body.Counter,
          level: element.body.Level,
          kind: element.body.Type,
          status: element.body.Status,
          entrypoint: element.body.Entrypoint,
          network: element.body.Network,
        });
      });
    },
    onDownloadPage(_e, _i, isIntersecting) {
      if (isIntersecting) {
        this.applyFilter(false);
      }
    },
    async fetchOperations() {
      await this.getOperations(true);
      if (this.config.mempool_enabled) {
        this.getMempool();
      }
    },
    searchOperations(clearData = false) {
      if (this.operationsLoading || (this.downloaded && !clearData)) return;
      this.operationsLoading = true;

      if (clearData) this.clearData();

      let status = this.filters.status.filter((s) => ["applied", "failed", "skipped", "backtracked"].includes(s));
      if (status.length === 0 && this.filters.status.length > 0) {
        this.operationsLoading = false;
        return;
      }

      let filters = {
          entrypoint: this.filters.entrypoints,
          status: status,
          network: this.network,
          contract: this.address,
      }

      let date = this.timestampFilter;
      if (date) {
        filters.date = date;
      }

      const size = 20;

      this.searchService.operations(
        this.search,
        filters,
        size,
        this.operations.length,
      )
      .then(res => {
        if (!res) {
            this.downloaded = true; // prevent endless polling
          } else {
            this.downloaded = res.items.length !== size;
            this.pushOperationsFromSearch(res.items);
          }
      })
      .catch(err => {
        console.log(err);
        this.showError(err);
      })
      .finally(() => {
        this.operationsLoading = false;
      })
    },
    applyFilter(clearData = false) {
      if (this.isEmptyFilters) {
        this.getOperations(clearData);
      } else {
        this.searchOperations(clearData);
      }
     }
  },
  watch: {
    address: "fetchOperations",
    search() {
      this.applyFilter(true);
    }
  },
};
</script>
