<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col cols="8" class="pt-0 px-8">
        <h3 class="text--secondary font-weight-regular header-table">Recently called contracts</h3>
        <RecentlyCalledContracts
          class="mt-4"
          hide-pagination-count
          :network="network"
          :items-per-page="7"
          :updateable="false"
          pageable
        />
      </v-col>
      <v-col cols="4" class="pt-0 pl-0">
        <NetworkInfo :network="network" :state="state" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapActions } from "vuex";
import RecentlyCalledContracts from "../../components/Tables/RecentlyCalledContracts";
import NetworkInfo from "./NetworkInfo";

export default {
  name: "NetworkTab",
  props: {
    network: String,
    state: Object,
  },
  components: {
    NetworkInfo,
    RecentlyCalledContracts,
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
