<template>
  <v-row>
    <v-col cols="12" class="mb-5">
      <v-skeleton-loader :loading="details.loading || deployments.loading" type="image">
        <v-card outlined min-height="420" class="chart-card">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <h3 class="font-weight-regular">
                  <span class="primary--text">{{ details.deployments ? details.deployments.toLocaleString(undefined) : 0 }}</span>&nbsp;
                  <span class="text--secondary">deployments</span>
                </h3>
              </v-list-item-title>
              <v-list-item-subtitle class="text--secondary caption">the number of originated contracts excluding manager.tz</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn-toggle v-model="deployments.period" dense mandatory>
                <v-btn small value="day">Day</v-btn>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
            </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
          <v-card-text class="pa-0 mt-0">
              <LineChart
                :data="deployments.series"
                name="New deployments"
              ></LineChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" class="my-3">
      <v-skeleton-loader :loading="details.loading || contractCalls.loading" type="image">
        <v-card outlined min-height="420" class="chart-card">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <h3 class="font-weight-regular">
                  <span class="primary--text">{{ details.contractCalls ? details.contractCalls.toLocaleString(undefined): 0 }}</span>&nbsp;
                  <span class="text--secondary">contract calls</span>
                </h3>
              </v-list-item-title>
              <v-list-item-subtitle class="text--secondary caption">the number of transactions that have an entrypoint in parameters</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn-toggle v-model="contractCalls.period" dense mandatory>
                <v-btn small value="day">Day</v-btn>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
              </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
          <v-card-text class="pa-0 mt-0">
              <LineChart
                :data="contractCalls.series"
                name="Contract calls"
              ></LineChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" class="my-3">
      <v-skeleton-loader :loading="details.loading || paidStorageSizeDiff.loading" type="image">
        <v-card outlined min-height="420" class="chart-card">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <h3 class="font-weight-regular">
                  <span class="primary--text">{{ details.paidStorageSizeDiff ? (details.paidStorageSizeDiff / 1024).toLocaleString(undefined,{maximumFractionDigits: 4}): 0  }}</span>&nbsp;
                  <span class="text--secondary"> paid storage size diff, KB</span>
                </h3>
              </v-list-item-title>
              <v-list-item-subtitle class="text--secondary caption">the amount of storage bytes which was paid</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn-toggle v-model="paidStorageSizeDiff.period" dense mandatory>
                <v-btn small value="day">Day</v-btn>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
              </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
          <v-card-text class="pa-0 mt-0">
              <LineChart
                :data="paidStorageSizeDiff.series"
                name="Paid storage size diff"
                formatType="kb"
              ></LineChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" class="my-3">
      <v-skeleton-loader :loading="details.loading || consumedGas.loading" type="image">
        <v-card outlined min-height="420" class="chart-card">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <h3 class="font-weight-regular">
                  <span class="primary--text">{{ details.consumedGas ? (details.consumedGas / 10**6).toLocaleString(undefined, {maximumFractionDigits: 6}): 0  }}</span>&nbsp;
                  <span class="text--secondary">consumed gas × 10&#8310;</span>
                </h3>
              </v-list-item-title>
              <v-list-item-subtitle class="text--secondary caption">the amount of consumed gas</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn-toggle v-model="consumedGas.period" dense mandatory>
                <v-btn small value="day">Day</v-btn>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
              </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
          <v-card-text class="pa-0 mt-0">
              <LineChart
                :data="consumedGas.series"
                name="Consumed gas"
                formatType="utz"
              ></LineChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import LineChart from "@/components/Charts/LineChart.vue";
export default {
  name: "StatsTab",
  props: {
    network: String
  },
  components: {
    LineChart,
  },
  mounted() {
    if (this.network) {
      this.getDetails(this.network);
    }
  },
  data: () => ({
    details: {
      contractCalls: undefined,
      deployments: undefined,
      paidStorageSizeDiff: undefined,
      consumedGas: undefined,
      loading: false,
    },
    contractCalls: {
      series: [],
      loading: false,
      period: 'month'
    },
    deployments: {
      series: [],
      loading: false,
      period: 'month'
    },
    paidStorageSizeDiff: {
      series: [],
      loading: false,
      period: 'month'
    },
    consumedGas: {
      series: [],
      loading: false,
      period: 'month'
    },
  }),
  methods: {
    ...mapActions(["showError"]),
    getDetails(network) {
      this.getGeneralStats(network);
      this.getContractCalls(network);
      this.getDeployments(network);
      this.getPaidStorageSizeDiff(network);
      this.getConsumedGas(network);
    },
    getGeneralStats(network) {
      if (this.details.loading) return;
      this.details.loading = true;

      this.stats.summary(network, 'transactions', 'count', {
          'Entrypoint.isnotnull': ''
        })
        .then(response => { 
          this.details.contractCalls = parseInt(response, 10);
          return this.stats.summary(network, 'originations', 'count', {});
        })
        .then(response => { 
          this.details.deployments = parseInt(response, 10);
          return this.stats.summary(network, 'paid_storage_size_diff', 'sum', {"field": "Value"});
        })
        .then(response => { 
          this.details.paidStorageSizeDiff = parseInt(response, 10);
          return this.stats.summary(network, 'consumed_gas', 'sum', {'field': 'Used'});
        })
        .then(response => { 
          this.details.consumedGas = parseInt(response, 10);
        })
        .catch(err => this.setErr(err))
        .finally(() => this.details.loading = false);
    },
    getContractCalls(network) {
      if (this.contractCalls.loading) return;
      this.contractCalls.loading = true;

      this.stats.histogram(network, 'transactions', 'count', this.contractCalls.period, {
        'Entrypoint.isnotnull': ''
      })
      .then(response => {
        this.contractCalls.series = [];
        response.forEach(x => this.contractCalls.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(() => this.contractCalls.loading = false);
    },
    getDeployments(network) {
      if (this.deployments.loading) return;
      this.deployments.loading = true;
    
      this.stats.histogram(network, 'originations', 'count', this.deployments.period, {})
      .then(response => {
        this.deployments.series = [];
        response.forEach(x => this.deployments.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(() => this.deployments.loading = false);
    },
    getPaidStorageSizeDiff(network) {
      if (this.paidStorageSizeDiff.loading) return;
      this.paidStorageSizeDiff.loading = true;
      
      this.stats.histogram(network, 'paid_storage_size_diff', 'sum', this.paidStorageSizeDiff.period, {'field': 'Value'})
      .then(response => {
        this.paidStorageSizeDiff.series = [];
        response.forEach(x => this.paidStorageSizeDiff.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(() => this.paidStorageSizeDiff.loading = false);
    },
    getConsumedGas(network) {
      if (this.consumedGas.loading) return;
      this.consumedGas.loading = true;

      this.stats.histogram(network, 'consumed_gas', 'sum', this.consumedGas.period, {'field': 'Used'})
      .then(response => {
        this.consumedGas.series = [];
        response.forEach(x => this.consumedGas.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(() => this.consumedGas.loading = false);
    },
    setErr(err) {
      console.log(err);
      this.showError(err);
    },
  },
  watch: {
    network(newValue) {
      this.getDetails(newValue);
    },
    'deployments.period': function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getDeployments(this.network);
      }
    },
    'contractCalls.period': function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getContractCalls(this.network);
      }
    },
    'paidStorageSizeDiff.period': function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getPaidStorageSizeDiff(this.network);
      }
    },
    'consumedGas.period': function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getConsumedGas(this.network);
      }
    }
  }
};
</script>

<style>
.chart-card {
  background-color: var(--v-data-base) !important;
}
</style>