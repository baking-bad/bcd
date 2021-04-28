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
    <v-col cols="4" v-if="dapp.dex_tokens">
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
                    `${helpers.round(checkVol(dapp.volume_24_hours), 6)} \uA729`
                  }}
                  (24h)
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-for="(token, i) in dapp.dex_tokens" :key="i">
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
    <v-col cols="8" v-if="dapp.dex_tokens">
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

export default {
  name: "DEXBlock",
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
    tokens() {
      if (!this.dapp) return [];
      return this.dapp.dex_tokens;
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
    data: {},
    selectedToken: 0,
    selectedPeriod: "day",
  }),
  mounted() {
    this.getSeries(this.selectedPeriod, this.selectedToken);
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
      if (this.tokens.length == 0) return;
      let token = this.tokens[this.selectedToken - 1];

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
      } else if (selectedToken == 0) {
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
