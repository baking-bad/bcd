<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row>
      <v-col cols="6">
        <v-card :elevation="0" class="data" min-height="420">
          <v-card-text class="pl-0 pt-0 mt-0">
            <v-skeleton-loader :loading="deployments.loading" type="image">
              <ColumnChart
                :data="deployments.series"
                :title="`New deployments (total ${details.deployments.toLocaleString(undefined)})<br/>
                <div class='text--secondary caption text-center'>Excluding manager.tz</div>`"
                name="New deployments"
              ></ColumnChart>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card :elevation="0" class="data" min-height="420">
          <v-card-text class="pl-0 pt-0 mt-0">
            <v-skeleton-loader :loading="contractCalls.loading" type="image">
              <ColumnChart
                :data="contractCalls.series"
                :title="`Contract calls (total ${details.contractCalls.toLocaleString(undefined)})`"
                name="Contract calls"
              ></ColumnChart>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card :elevation="0" class="data" min-height="420">
          <v-card-text class="pl-0 pt-0 mt-0">
            <v-skeleton-loader :loading="paidStorageSizeDiff.loading" type="image">
              <ColumnChart
                :data="paidStorageSizeDiff.series"
                formatter="kilobyte"
                title="Paid storage size diff, KB"
                name="Paid storage size diff"
              ></ColumnChart>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card :elevation="0" class="data" min-height="420">
          <v-card-text class="pl-0 pt-0 mt-0">
            <v-skeleton-loader :loading="consumedGas.loading" type="image">
              <ColumnChart
                :data="consumedGas.series"
                :title="`Consumed gas × 10\u2076`"
                formatter="gas"
                name="Consumed gas"
              ></ColumnChart>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import ColumnChart from "@/components/Charts/ColumnChart.vue";
export default {
  name: "StatsTab",
  props: {
    network: String
  },
  components: {
    ColumnChart,
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
      loading: false,
    },
    contractCalls: {
      series: [],
      loading: false,
    },
    deployments: {
      series: [],
      loading: false,
    },
    paidStorageSizeDiff: {
      series: [],
      loading: false,
    },
    consumedGas: {
      series: [],
      loading: false,
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
        })
        .catch(err => this.setErr(err))
        .finally(() => (this.details.loading = false));
    },
    getContractCalls(network) {
      if (this.contractCalls.loading) return;
      this.contractCalls.loading = true;

      this.stats.histogram(network, 'transactions', 'count', 'month', {
        'Entrypoint.isnotnull': ''
      })
      .then(response => {
        this.contractCalls.series = [];
        response.forEach(x => this.contractCalls.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(this.contractCalls.loading = false);
    },
    getDeployments(network) {
      if (this.deployments.loading) return;
      this.deployments.loading = true;
    
      this.stats.histogram(network, 'originations', 'count', 'month', {})
      .then(response => {
        this.deployments.series = [];
        response.forEach(x => this.deployments.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(this.deployments.loading = false);
    },
    getPaidStorageSizeDiff(network) {
      if (this.paidStorageSizeDiff.loading) return;
      this.paidStorageSizeDiff.loading = true;
      
      this.stats.paidStorageDiffSize(network, 'month')
      .then(response => {
        this.paidStorageSizeDiff.series = [];
        response.forEach(x => this.paidStorageSizeDiff.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(this.paidStorageSizeDiff.loading = false);
    },
    getConsumedGas(network) {
      if (this.consumedGas.loading) return;
      this.consumedGas.loading = true;

      this.stats.consumedGas(network, 'month')
      .then(response => {
        this.consumedGas.series = [];
        response.forEach(x => this.consumedGas.series.push([x['ts']*1000, parseInt(x['value'], 10)]))
      })
      .catch(err => this.setErr(err))
      .finally(this.consumedGas.loading = false);
    },
    setErr(err) {
      console.log(err);
      this.showError(err);
    },
  },
  watch: {
    network(newValue) {
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