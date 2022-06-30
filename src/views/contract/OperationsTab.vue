<template>
  <v-container fluid class="px-8 py-4 canvas fill-canvas">
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="status"
              :items="[
            'applied',
            'failed',
            'backtracked',
            'skipped',
            'pending',
            'lost',
            'refused',
            'branch_refused',
          ]"
              chips
              small-chips
              filled
              label="Status"
              placeholder="Any"
              multiple
              background-color="data"
              hide-details
            >
              <template v-slot:selection="{ item, index }">
                <v-chip x-small v-if="index < 1">
                  <span>{{ item }}</span> </v-chip
                >&nbsp;
                <span v-if="index === 1" class="grey--text caption"
                >+{{ status.length - 1 }} others</span
                >
              </template>
            </v-select>
          </v-col>
          <v-col cols="3" v-if="isContract">
            <v-select
              v-model="entrypoints"
              :items="availableEntrypoints"
              chips
              small-chips
              filled
              background-color="data"
              label="Entrypoint"
              placeholder="Any"
              multiple
              hide-details
            >
              <template v-slot:selection="{ index }">
                <v-chip x-small v-if="index < 1">
                  <span>{{ shortestEntrypoint }}</span> </v-chip
                >&nbsp;
                <span v-if="index === 1" class="grey--text caption"
                >+{{ entrypoints.length - 1 }} others</span
                >
              </template>
            </v-select>
          </v-col>

          <v-col cols="6" class="d-flex justify-space-between align-center">
            <v-menu
              ref="menu"
              v-model="datesModal"
              :close-on-content-click="false"
              :return-value.sync="dates"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="dateRangeText"
                  label="Date range"
                  placeholder="All time"
                  readonly
                  filled
                  background-color="data"
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="datesBuf" min="2018-06-30" scrollable range show-current>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="datesModal = false"
                >Cancel</v-btn
                >
                <v-btn text color="primary" @click="$refs.menu.save(datesBuf)"
                >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
            <v-btn small text @click="fetchOperations">
              <v-icon small class="mr-1 text--secondary">mdi-trash-can</v-icon>
              <span class="text--secondary">clear filters</span>
            </v-btn>
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
                icon="mdi-code-brackets"
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
        <v-list class="contract-list">
          <v-list-item style="height: 74px">
            <v-list-item-content two-line>
              <v-list-item-title class="headline">
                <v-tooltip bottom :disabled="alias && alias.length < 25">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on" style="cursor: inherit;">{{ alias ? alias : address }}</span>
                  </template>
                  <span>{{ alias ? alias : address }}</span>
                </v-tooltip>                
              </v-list-item-title>
              <v-list-item-subtitle>
              <span
                class="overline"
                :class="network === 'mainnet' ? 'secondary--text' : ''"
              >{{ network }}</span
              >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="overline"
              >Was active</v-list-item-subtitle
              >
              <v-list-item-title class="body-2" v-if="isContract">
                {{ helpers.formatDatetime(contract.timestamp) }}
                <span v-if="contract.last_action > contract.timestamp"
                >—
                      {{ helpers.formatDatetime(contract.last_action) }}</span
                >
              </v-list-item-title>
              <v-list-item-title class="body-2" v-else>
                {{ helpers.formatDatetime(contract.last_action) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="balance">
            <v-list-item-content>
              <v-list-item-subtitle class="overline"
              >Balance</v-list-item-subtitle
              >
              <v-list-item-title class="body-2">
                <span>{{ balance | uxtz }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <AccountBox
            v-if="contract.manager"
            title="Deployed by"
            :address="contract.manager"
            :network="contract.network"
            gutters
          />
          <AccountBox
            v-if="contract.delegate"
            title="Delegated to"
            :address="contract.delegate"
            :network="contract.network"
            :alias="contract.delegate_alias"
            gutters
          />
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import ContentItem from "@/views/contract/ContentItem.vue";
import EmptyState from "@/components/Cards/EmptyState.vue";
import dayjs from "dayjs";
import Vue from 'vue';
import AccountBox from "../../components/Dialogs/AccountBox";

export default {
  name: "OperationsTab",
  props: {
    address: String,
    network: String,
    balance: Number,
    contract: Object,
  },
  components: {
    AccountBox,
    ContentItem,
    EmptyState,
  },
  data: () => ({
    operations: [],
    mempool: [],
    downloaded: false,
    operationsLoading: false,
    mempoolLoading: false,
    last_id: null,
    status: [],
    dates: [],
    datesBuf: [],
    datesModal: false,
    entrypoints: [],
    availableEntrypoints: [],
    operationsChannelName: null
  }),
  created() {
    this.init();
  },
  computed: {
    loading() {
      return this.items.length === 0 && (this.operationsLoading || this.mempoolLoading);
    },
    alias() {
      if (this.contract) {
        if (this.contract.alias) {
          return this.contract.alias;
        } else if (this.metadata && this.metadata.name) {
          return this.metadata.name;
        }
      }
      return null;
    },
    items() {
      let operations = [];
      if (this.operations.length === 0) {
        return [];
      }
      if (this.last_id !== null) operations = this.operations;
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
    dateRangeText() {
      let texts = this.dates.map((d) => dayjs(d).format("MMM DD"));
      if (texts.length === 2) {
        return texts.join(" — ");
      } else if (texts.length === 1) {
        return texts[0];
      } else {
        return "";
      }
    },
    shortestEntrypoint() {
      if (this.entrypoints.length === 0) return "";
      let s = this.entrypoints[0];

      for (let i = 1; i < this.entrypoints.length; i++) {
        if (this.entrypoints[i].length < s.length) s = this.entrypoints[i];
      }
      return s;
    },
    isContract() {
      return this.address.startsWith("KT");
    },
  },
  destroyed() {
    this.hideError();
  },
  methods: {
    ...mapActions(["showError", "hideError"]),
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
    async getOperations(clearData = false, resetFilters = false) {
      if (this.operationsLoading || (this.downloaded && !clearData)) return;
      this.operationsLoading = true;
      if (clearData) {
        this.operations = [];
        this.downloaded = false;
        this.last_id = null;
      }
      if (resetFilters) {
        this.status = [];
        this.dates = [];
        this.datesBuf = [];
        this.datesModal = false;
        this.entrypoints = [];
      }

      const onChainStatuses = ["applied", "failed", "skipped", "backtracked"];
      let status = this.status.filter((s) => onChainStatuses.includes(s));
      if (status.length === 0 && this.status.length > 0) {
        this.operationsLoading = false;
        return;
      }
      let entries = this.entrypoints;
      let timestamps = this.getTimestamps();

      await this.api
        .getContractOperations(
          this.network,
          this.address,
          this.last_id,
          timestamps[0],
          timestamps[1],
          status,
          entries,
          false // no diffs at this point, load them if expanded only
        )
        .then((res) => {
          if (!res) {
            this.downloaded = true; // prevent endless polling
          } else {
            this.downloaded = res.operations.length === 0;
            this.last_id = res.last_id;
            this.pushOperations(res.operations);
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
      if (!this.mempool || this.mempool.length === 0) return [];
      let mempoolOperations = this.mempool;

      // Apply operation filters
      if (this.status.length > 0) {
        mempoolOperations = mempoolOperations.filter((o) =>
          this.status.includes(o.status)
        );
      }
      if (this.entrypoints.length > 0) {
        mempoolOperations = mempoolOperations.filter((o) =>
          this.entrypoints.includes(o.entrypoint)
        );
      }
      if (this.dates.length > 0) {
        let timestamps = this.getTimestamps();
        mempoolOperations = mempoolOperations.filter(function (op) {
          const ts = dayjs(op.timestamp).unix() * 1000;
          return ts >= timestamps[0] && ts < timestamps[1];
        });
      }

      // Ensure no duplicates (tune the number if needed) and proper cut
      if (this.operations.length > 0) {
        const lastTimestamp = this.operations[this.operations.length - 1]
          .timestamp;
        const lastHashes = this.operations.slice(0, 15).map((o) => o.hash);
        mempoolOperations = mempoolOperations.filter(
          (o) => o.timestamp >= lastTimestamp && !lastHashes.includes(o.hash)
        );
      }

      return mempoolOperations;
    },
    pushOperations(data) {
      data.forEach((element) => {
        if (element.internal) {
          const lastEl = this.operations[this.operations.length - 1];
          lastEl.internal_operations.push(
              element
          );
          Vue.set(this.operations, this.operations.length - 1, lastEl);
        } else {
          element.internal_operations = [];
          this.operations.push(element);
        }
      });
    },
    async onDownloadPage(entries, observer, isIntersecting) {
      if (isIntersecting) {
        await this.getOperations();
      }
    },
    async fetchOperations() {

      await this.getOperations(true, true);
      if (this.config.mempool_enabled) {
        this.getMempool();
      }
      this.getEntrypoints();
    },
    async updateOperations() {
      await this.getOperations(true, false);
    },
    init() {
      this.fetchOperations();
    },
  },
  watch: {
    address: "init",
    status: "updateOperations",
    entrypoints: "updateOperations",
    dates: "updateOperations",
  },
};
</script>
