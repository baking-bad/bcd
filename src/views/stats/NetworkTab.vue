<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row>
      <v-col cols="6">
        <v-skeleton-loader :loading="!series.contract" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="series.contract">
              <ColumnChart
                :data="series.contract"
                :title="`New deployments (total ${details.contracts_count})<br/>
                <div class='text--secondary caption text-center'>Excluding manager.tz</div>`"
                name="New deployments"
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="!series.operation" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="series.operation">
              <ColumnChart
                :data="series.operation"
                :title="`Contract calls (total ${details.contract_calls})`"
                name="Contract calls"
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="!series.paidStorageSizeDiff" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="series.paidStorageSizeDiff">
              <ColumnChart
                :data="series.paidStorageSizeDiff"
                formatter="kilobyte"
                title="Paid storage size diff, KB"
                name="Paid storage size diff"
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="!series.consumedGas" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="series.consumedGas">
              <ColumnChart
                :data="series.consumedGas"
                :title="`Consumed gas × 10\u2076`"
                formatter="gas"
                name="Consumed gas"
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapActions } from "vuex";
import ColumnChart from "@/components/Charts/ColumnChart.vue";

export default {
  name: "NetworkTab",
  props: {
    network: String
  },
  components: {
    ColumnChart,
  },
  created() {
    if (this.network) {
      this.getDetails(this.network);
    }
  },
  data: () => ({
    loading: true,
    details: {},
    series: {},
  }),
  computed: {
    languages() {
      if (!this.loading && this.details.languages) {
        let res = Object.keys(this.details.languages)
          .map(lang => [`${lang[0].toUpperCase()}${lang.slice(1)}`, this.details.languages[lang]]);

        res.push({
          name: 'Others',
          y: this.details.contracts_count - res.reduce((acc, x) => acc + x[1], 0),
          dataLabels: {
            enabled: false
          }
        });
        return res;
      }
      return [];
    }
  },
  methods: {
    ...mapActions(["showError"]),
    setDetailsDataToDefault() {
      this.details = {};
      ['contract', 'operation', 'consumedGas', 'paidStorageSizeDiff']
          .forEach((key) => this.setRes(key, null));
    },
    getDetails(network) {
      this.loading = true;

      this.api
        .getNetworkStats(network)
        .then(res => { this.details = res; })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));

      this.requestStatsData(network, "contract", 'contract');
      this.requestStatsData(network, "operation", 'operation');
      this.requestStatsData(network, "paid_storage_size_diff", 'paidStorageSizeDiff');
      this.requestStatsData(network, "consumed_gas", 'consumedGas');
    },
    requestStatsData(network, index, key) {
      this.api
          .getNetworkStatsSeries(network, index, "month")
          .then(res => this.setRes(key, res))
          .catch(err => this.setErr(key, err));
    },
    setErr(key, err) {
      Vue.set(this.series, key, []);
      console.log(err);
      this.showError(err);
    },
    setRes(key, res) {
      Vue.set(this.series, key, res);
    },
  },
  watch: {
    network(newValue) {
      this.setDetailsDataToDefault();
      this.getDetails(newValue);
    }
  }
};
</script>

<style>
.v-timeline-item__dot {
  background-color: var(--v-data-base) !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
