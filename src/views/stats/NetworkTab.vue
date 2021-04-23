<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row>
      <v-col cols="6">
        <v-skeleton-loader :loading="!contractSeries" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="contractSeries">
              <ColumnChart
                :data="contractSeries"
                :title="`New deployments (total ${details.contracts_count})<br/>
                <div class='text--secondary caption text-center'>Excluding manager.tz</div>`"
                name="New deployments"
                zoom
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="!operationSeries" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="operationSeries">
              <ColumnChart
                :data="operationSeries"
                :title="`Contract calls (total ${details.operations_count})`"
                name="Contract calls"
                zoom
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="!paidStorageSizeDiffSeries" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="paidStorageSizeDiffSeries">
              <ColumnChart
                :data="paidStorageSizeDiffSeries"
                formatter="kilobyte"
                title="Paid storage size diff, KB"
                name="Paid storage size diff"
                zoom
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="!consumedGasSeries" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0" v-if="consumedGasSeries">
              <ColumnChart
                :data="consumedGasSeries"
                :title="`Consumed gas × 10\u2076`"
                formatter="gas"
                name="Consumed gas"
                zoom
              ></ColumnChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="loading" type="image">
          <v-card flat outlined>
            <v-card-title class="data d-flex align-center justify-center" style="font-size: 18px;">
              <span style="font-family: 'Roboto Condensed', monospace">Activated protocols</span>
            </v-card-title>
            <v-card-text class="pa-0 data">
              <v-timeline>
                <v-timeline-item
                  v-for="(protocol, idx) in details.protocols"
                  :key="idx"
                  color="primary"
                  icon="mdi-chevron-up"
                  small
                >
                  <div style="text-align: right;" :slot="idx % 2 === 0 ? 'opposite' : 'default'">
                    <span class="hash">
                      level
                      <span class="text--primary">{{ protocol.start_level }}</span>
                    </span>
                  </div>
                  <div :slot="idx % 2 === 0 ? 'default' : 'opposite'">
                    <span class="body-1 text--primary">{{ protocol.alias }}</span>
                    <span
                      class="hash ml-2"
                      v-if="!protocol.hash.startsWith(protocol.alias)"
                    >{{ protocol.hash.slice(0, 8) }}</span>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6">
        <v-skeleton-loader :loading="loading" type="image">
          <v-card flat outlined>
            <v-card-text class="data pa-0 pb-8">
              <DonutChart
                :data="languages"
                title="Contract languages"
                subtitle="Determined using heuristics, can be inaccurate"
                name="Contract languages"
              ></DonutChart>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import ColumnChart from "@/components/Charts/ColumnChart.vue";
import DonutChart from "@/components/Charts/DonutChart.vue";

export default {
  name: "NetworkTab",
  props: {
    network: String
  },
  components: {
    ColumnChart,
    DonutChart
  },
  created() {
    if (this.network) {
      this.getDetails(this.network);
    }
  },
  data: () => ({
    loading: true,
    details: {},
    contractSeries: null,
    operationSeries: null,
    consumedGasSeries: null,
    paidStorageSizeDiffSeries: null
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
      this.$set(this, 'details', {});
      this.$set(this, 'contractSeries', null);
      this.$set(this, 'operationSeries', null);
      this.$set(this, 'consumedGasSeries', null);
      this.$set(this, 'paidStorageSizeDiffSeries', null);
    },
    getDetails(network) {
      this.loading = true;

      this.api
        .getNetworkStats(network)
        .then(res => {
          this.$set(this, 'details', res);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));

      this.api
        .getNetworkStatsSeries(network, "contract", "month")
        .then(res => {
          this.$set(this, 'contractSeries', res);
        })
        .catch(err => {
          this.$set(this, 'contractSeries', []);
          console.log(err);
          this.showError(err);
        });

      this.api
        .getNetworkStatsSeries(network, "operation", "month")
        .then(res => {
          this.$set(this, 'operationSeries', res);
        })
        .catch(err => {
          this.$set(this, 'operationSeries', []);
          console.log(err);
          this.showError(err);
        });

      this.api
        .getNetworkStatsSeries(network, "paid_storage_size_diff", "month")
        .then(res => {
          this.$set(this, 'paidStorageSizeDiffSeries', res);
        })
        .catch(err => {
          this.$set(this, 'paidStorageSizeDiffSeries', []);
          console.log(err);
          this.showError(err);
        });

      this.api
        .getNetworkStatsSeries(network, "consumed_gas", "month")
        .then(res => {
          this.$set(this, 'consumedGasSeries', res);
        })
        .catch(err => {
          this.$set(this, 'consumedGasSeries', []);
          console.log(err);
          this.showError(err);
        });
    },
    getProtocolLevelString(item) {
      if (item.start_level == item.end_level) {
        return `At ${item.start_level} level`;
      } else if (item.end_level == 0) {
        return `From ${item.start_level} by now`;
      } else {
        return `From ${item.start_level} by ${item.end_level} level`;
      }
    }
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
