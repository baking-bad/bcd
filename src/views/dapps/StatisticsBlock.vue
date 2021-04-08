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
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6">
      <v-skeleton-loader :loading="loading || loadingSeries || loadingSummary" type="image">
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
  },
  data: () => ({
    minAmountOfGraphs: 12,
    loadingSeries: true,
    loadingSummary: true,
    series: {
      volume: [],
      users: [],
    },
    selectedToken: 0,
    selectedPeriod: "day",
    summary: null,
  }),
  mounted() {
    this.getSeries(this.selectedPeriod);
    this.getGeneralStats();
  },
  methods: {
    ...mapActions(["showError"]),
    addEmptyDataInfo(res) {
      const amountToAdd = this.minAmountOfGraphs - res.length;
      if (amountToAdd <= 0 || isNaN(amountToAdd)) {
        return res;
      }
      const lastRes = res[res.length - 1];
      let latestTimestamp = typeof lastRes === "undefined"
          ? +new Date()
          : lastRes[0];
      for (let i = 0; i < amountToAdd; i++) {
        let timestampToAdd = latestTimestamp - ONE_DAY_IN_MS;
        res.unshift([timestampToAdd, 0]);
        latestTimestamp = timestampToAdd;
      }
      return res;
    },
    getSeries(period) {
      this.loadingSeries = true;

      this.api
        .getNetworkStatsSeries("mainnet", "users", period, this.contracts)
        .then((res) => {
          this.series.users = this.addEmptyDataInfo(res);
          return this.api.getNetworkStatsSeries(
            "mainnet",
            "operation",
            period,
            this.contracts
          );
        })
        .then((res) => {
          this.series.volume = this.addEmptyDataInfo(res);
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingSeries = false;
        });
    },
    getGeneralStats() {
      this.loadingSummary = true;
      this.api
        .getContractsStats("mainnet", this.contracts, "all")
        .then((res) => {
          this.summary = this.addEmptyDataInfo(res);
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
    selectedPeriod: function (newValue) {
      this.getSeries(newValue);
    },
  },
};
</script>
