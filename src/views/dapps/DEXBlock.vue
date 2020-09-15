<template>
  <v-row>
    <v-col cols="2">
      <h3>DEX Tokens</h3>
    </v-col>
    <v-col cols="10" class="d-flex justify-end">
      <v-skeleton-loader :loading="loading" type="actions">
        <v-btn-toggle v-model="selectedPeriod" color="primary" dense mandatory>
          <v-btn
            :disabled="loading || loadingTokenSeries"
            small
            :value="period"
            v-for="(text, period) in {
                'month': 'Monthly',
                'year': 'Annual'
            }"
            :key="period"
          >{{ text }}</v-btn>
        </v-btn-toggle>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="4" v-if="dapp.dex_tokens">
      <v-skeleton-loader :loading="loading || loadingTokenSeries" type="list-item@4">
        <v-list class="py-0">
          <v-list-item-group v-model="selectedToken" color="primary" mandatory>
            <v-list-item v-for="(token, i) in dapp.dex_tokens" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{ token.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="8" v-if="dapp.dex_tokens">
      <v-skeleton-loader :loading="loading || loadingTokenSeries" type="image">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="series.token_volume"
              :title="`Volume, ${dapp.dex_tokens[selectedToken].symbol}`"
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
import ColumnChart from "@/components/ColumnChart.vue";

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
  },
  data: () => ({
    loadingTokenSeries: true,
    series: {
      token_volume: [],
    },
    selectedToken: 0,
    selectedPeriod: "month",
  }),
  mounted() {
    this.getTokenSeries(
      this.selectedPeriod,
      this.dapp.dex_tokens[this.selectedToken].token_id
    );
  },
  methods: {
    ...mapActions(["showError"]),
    getTokenSeries(period, token_id) {
      if (this.tokens.length == 0 || token_id === undefined) return;

      this.loadingTokenSeries = true;
      this.api
        .getTokenVolumeSeries(
          "mainnet",
          period,
          this.tokens[this.selectedToken].contract,
          this.contracts,
          token_id
        )
        .then((res) => {
          this.series.token_volume = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingTokenSeries = false;
        });
    },
  },
  watch: {
    selectedPeriod: function (newValue) {
      this.getTokenSeries(newValue, this.tokens[this.selectedToken].token_id);
    },
    selectedToken: function (newValue) {
      this.getTokenSeries(this.selectedPeriod, this.tokens[newValue].token_id);
    },
  },
};
</script>