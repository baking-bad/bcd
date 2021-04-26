<template>
  <v-row>
    <v-col cols="12">
      <h3>Statistics</h3>
    </v-col>
    <v-col cols="6">
      <v-skeleton-loader :loading="loading || loadingSeries || loadingSummary" type="image">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="series.users"
              :title="summary ? `<div class='text-center py-0'>Unique accounts<div>
                <div class='text--secondary caption text-center py-0'>Total ${summary.users}</div>` : 'Unique users'"
              name="Unique users"
              zoom
              :min-amount-of-graphs="minAmountOfGraphs"
              :timestamps="['daily', 'hourly']"
              :selected-timestamp="selectedUsersTimestamp"
              @changePeriod="(val) => changePeriod('selectedPeriodUsers', val)"
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6">
      <v-skeleton-loader :loading="loading || loadingCalls || loadingSummary" type="image">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="series.volume"
              :title="summary ? `<div class='text-center py-0'>Activity (contracts calls count)<div>
                <div class='text--secondary caption text-center py-0'>Total ${summary.txs} calls</div>` : 'Calls count'"
              name="Calls count"
              zoom
              :min-amount-of-graphs="minAmountOfGraphs"
              :timestamps="['daily', 'hourly']"
              :selected-timestamp="selectedCallTimestamp"
              @changePeriod="(val) => changePeriod('selectedPeriodCalls', val)"
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import ColumnChart from "@/components/Charts/ColumnChart.vue";
import { ONE_DAY_IN_MS } from "@/utils/date";

export default {
  name: "StatisticsBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
  components: {
    ColumnChart,
  },
  computed: {
    contracts() {
      if (!this.dapp) return [];
      let contracts = [];
      this.dapp.contracts.forEach((x) => contracts.push(x.address));
      return contracts;
    },
    selectedCallTimestamp() {
      if (this.selectedPeriodCalls === "day") {
        return 0;
      }

      return 1;
    },
    selectedUsersTimestamp() {
      if (this.selectedPeriodUsers === "day") {
        return 0;
      }

      return 1;
    }
  },
  data: () => ({
    minAmountOfGraphs: 12,
    loadingSeries: true,
    loadingCalls: true,
    loadingSummary: true,
    series: {
      volume: [],
      users: [],
    },
    selectedToken: 0,
    selectedPeriodUsers: "day",
    selectedPeriodCalls: "day",
    summary: null,
  }),
  async mounted() {
    this.loadingSeries = true;
    this.getUsersSeries(this.selectedPeriodUsers);
    this.loadingCalls = true;
    this.getCallsSeries(this.selectedPeriodCalls);
    this.loadingSummary = true;
    this.getGeneralStats();
  },
  methods: {
    ...mapActions(["showError"]),
    changePeriod(type, period) {
      this.$set(this, type, period);
    },
    addEmptyDataInfo(res) {
      const amountToAdd = this.minAmountOfGraphs - res.length;
      if (amountToAdd <= 0 || isNaN(amountToAdd)) {
        return res;
      }
      const lastRes = res[res.length - 1];
      let latestTimestamp = typeof lastRes === "undefined"
          ? +new Date()
          : lastRes[0];

      const EMPTY_DATA_JUSTIFIER = 4;
      for (let i = 0; i < amountToAdd + EMPTY_DATA_JUSTIFIER; i++) {
        let timestampToAdd = latestTimestamp - ONE_DAY_IN_MS;
        res.unshift([timestampToAdd, 0]);
        latestTimestamp = timestampToAdd;
      }
      return res;
    },
    getUsersSeries(period) {
      this.api
          .getNetworkStatsSeries("mainnet", "users", period, this.contracts)
          .then((res) => {
            this.$set(this.series, 'users', this.addEmptyDataInfo(res));
          })
          .catch((err) => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.loadingSeries = false;
          });
    },
    getCallsSeries(period) {
      this.api.getNetworkStatsSeries(
          "mainnet",
          "operation",
          period,
          this.contracts
      )
      .then((res) => {
          this.$set(this.series, 'volume', this.addEmptyDataInfo(res))
      })
      .catch((err) => {
        console.log(err);
        this.showError(err);
      })
      .finally(() => {
        this.loadingCalls = false;
      })
    },
    getGeneralStats() {
      this.api
        .getContractsStats("mainnet", this.contracts, "all")
        .then((res) => {
          this.$set(this, 'summary', this.addEmptyDataInfo(res));
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingSummary = false;
        });
    },
  },
  watch: {
    selectedPeriodUsers: {
      handler(newValue) {
        this.getUsersSeries(newValue);
      },
      deep: true,
      immediate: true,
    },
    selectedPeriodCalls: {
      handler(newValue) {
        this.getCallsSeries(newValue);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
