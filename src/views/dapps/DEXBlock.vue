<template>
  <v-row>
    <v-col cols="4">
      <h3>DEX Volume</h3>
    </v-col>
    <v-col cols="8" class="d-flex justify-end">
      <v-skeleton-loader :loading="loading" type="actions">
        <v-btn-toggle v-model="selectedPeriod" color="primary" dense mandatory>
          <v-btn
            :disabled="loading || loadingTokenSeries"
            small
            :value="period"
            v-for="(text, period) in {
              hour: 'Hourly',
              day: 'Daily',
              month: 'Monthly',
              year: 'Yearly',
            }"
            :key="period"
            >{{ text }}</v-btn
          >
        </v-btn-toggle>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="4" v-if="dexTokens">
      <v-skeleton-loader
        :loading="loading || loadingTokenSeries"
        type="list-item@4"
      >
        <v-list class="py-0">
          <v-list-item-group v-model="selectedToken" color="primary" mandatory>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Tezos</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  {{
                    isTezosDayVolumeLoading
                      ? '...'
                      : isTezosDayVolumeFailed
                        ? 'Failed'
                        : `${helpers.round(checkVol(tezosDayVolume), 6)} \uA729`
                  }}
                  (24h)
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-for="(token, i) in dexTokens" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{ token.name }} </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  {{
                    `${helpers.round(
                      checkVol(token.volume_24_hours),
                      token.decimals
                    )} ${token.symbol}`
                  }}
                  (24h)
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="8" v-if="dexTokens">
      <v-skeleton-loader :loading="loading || loadingTokenSeries" type="image">
        <v-card flat outlined>
          <v-card-text class="data pa-0" v-if="this.data[this.selectedToken]">
            <ColumnChart
              :data="this.data[this.selectedToken].series"
              :title="`<div class='text-center py-0'>Volume, ${
                token !== null ? token.symbol : '\uA729'
              }<div>
                <div class='text--secondary caption text-center py-0'>Total ${
                  this.data[this.selectedToken].total
                } ${token !== null ? token.symbol : '\uA729'}</div>`"
              name="Volume"
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
import {DATA_LOADING_STATUSES} from "../../utils/network";

export default {
  name: "DEXBlock",
  props: {
    dapp: Object,
    loading: Boolean,
    dexTokens: Array,
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
    isTezosDayVolumeLoading() {
      return this.tezosDayVolumeLoadingStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    isTezosDayVolumeFailed() {
      return this.tezosDayVolumeLoadingStatus === DATA_LOADING_STATUSES.ERROR;
    },
    token() {
      if (
        this.selectedToken > 0 &&
        this.selectedToken <= this.dapp.dex_tokens.length
      )
        return this.dapp.dex_tokens[this.selectedToken - 1];
      return null;
    },
  },
  data: () => ({
    loadingTokenSeries: true,
    tezosDayVolume: 0,
    data: {},
    selectedToken: 0,
    selectedPeriod: "day",
  }),
  mounted() {
    this.getSeries(this.selectedPeriod, this.selectedToken);
    this.getTezosDayVolume();
  },
  methods: {
    ...mapActions(["showError"]),
    checkVol(val) {
      if (val === undefined || isNaN(val)) {
        return 0;
      }

      return val;
    },
    getTokenSeries(period) {
      if (this.selectedToken in this.data) return;
      if (this.dexTokens.length === 0) return;
      let token = this.dexTokens[this.selectedToken - 1];

      this.loadingTokenSeries = true;
      this.api
        .getTokenVolumeSeries(
          "mainnet",
          period,
          token.contract,
          token.token_id,
          this.dapp.slug
        )
        .then((res) => {
          this.data[this.selectedToken] = this.prepareSeries(
            res,
            this.token.decimals
          );
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingTokenSeries = false;
        });
    },
    getTezosDayVolume() {
      this.tezosDayVolumeLoadingStatus = DATA_LOADING_STATUSES.PROGRESS;
      this.api
        .getTezosDayVolume(this.$route.params.slug)
        .then((res) => {
          this.tezosDayVolume = res;
          this.tezosDayVolumeLoadingStatus = DATA_LOADING_STATUSES.ERROR;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
          this.tezosDayVolumeLoadingStatus = DATA_LOADING_STATUSES.ERROR;
        })
    },
    getTezosVolume(period) {
      if (this.selectedToken in this.data) return;
      this.loadingTokenSeries = true;

      this.api
        .getNetworkStatsSeries("mainnet", "volume", period, this.contracts)
        .then((res) => {
          this.data[this.selectedToken] = this.prepareSeries(res);
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingTokenSeries = false;
        });
    },
    prepareSeries(series, decimals = 6) {
      let result = [];
      let total = 0;
      series.forEach((x) => {
        total += x[1];
        result.push([x[0], this.helpers.round(x[1], decimals)]);
      });
      return {
        series: result,
        total: this.helpers.round(total, decimals),
      };
    },
    getSeries(period, selectedToken) {
      if (selectedToken > 0) {
        this.getTokenSeries(this.selectedPeriod);
      } else if (selectedToken === 0) {
        this.getTezosVolume(period);
      }
    },
  },
  watch: {
    selectedPeriod: function (newValue) {
      this.data = {};
      this.getSeries(newValue, this.selectedToken);
    },
    selectedToken: function (newValue) {
      this.getSeries(this.selectedPeriod, newValue);
    },
  },
};
</script>
