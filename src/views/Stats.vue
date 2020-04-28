<template>
  <v-container fluid>
    <span class="title">Statistics</span>
    <v-skeleton-loader
      :loading="loading"
      type="list-item-three-line,list-item-three-line,list-item-three-line,list-item-three-line"
    >
      <v-row class="mt-4">
        <v-col cols="4">
          <v-list class="elevation-2 py-0">
            <v-list-item-group mandatory v-model="selected">
              <template v-for="(item, i) in states">
                <v-divider :key="`${i}-divider`" v-if="i != 0" />
                <v-list-item :key="i" active-class="primary--text">
                  <v-list-item-content>
                    <v-list-item-title class="overline">{{ item.network }}</v-list-item-title>
                    <v-list-item-subtitle class="item-protocol hash">{{ item.protocol }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>level {{ item.level }} ({{ item.timestamp | fromNow }})</v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="8">
          <v-card v-if="details">
            <v-card-title class="text-uppercase">{{ selectedItem.network }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="px-0 pb-0">
              <v-row no-gutters>
                <v-col cols="4">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-center overline">Level</v-list-item-title>
                      <v-list-item-subtitle class="text-center display-1">{{ selectedItem.level }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col cols="4">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-center overline">Smart contracts count</v-list-item-title>
                      <v-list-item-subtitle
                        class="text-center display-1"
                      >{{ details.contracts_count }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col cols="4">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-center overline">Operations count</v-list-item-title>
                      <v-list-item-subtitle
                        class="text-center display-1"
                      >{{ details.operations_count }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-tabs v-model="tab">
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab>
                      <v-icon small left>mdi-cube-outline</v-icon>Protocols
                    </v-tab>
                    <v-tab>
                      <v-icon small left>mdi-chart-bar</v-icon>Charts
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item :key="0">
                      <v-list>
                        <template v-for="(item, idx) in details.protocols">
                          <v-divider :key="`${idx}-protocol-divider`" v-if="idx != 0" />
                          <v-list-item :key="idx">
                            <v-list-item :key="idx" active-class="primary--text">
                              <v-list-item-content>
                                <v-list-item-title
                                  class="hash"
                                >{{ item.alias ? `${item.alias} (${item.hash})` : item.hash }}</v-list-item-title>
                                <v-list-item-subtitle>{{ getProtocolLevelString(item) }}</v-list-item-subtitle>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-list-item-action-text class="primary--text">{{ item.hash == selectedItem.protocol ? 'current' : ''}}</v-list-item-action-text>
                              </v-list-item-action>
                            </v-list-item>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-tab-item>
                    <v-tab-item :key="1" class="px-4">
                      <ColumnChart
                        class="mb-4"
                        :data="contractSeries"
                        title="New smart contracts"
                        yAxisTitle="Count"
                        color="#5b942a"
                        name="New smart contracts"
                      ></ColumnChart>
                      <ColumnChart
                        class="my-4"
                        :data="operationSeries"
                        title="Smart contracts usage"
                        yAxisTitle="Operations count"
                        color="#dcedc8"
                        name="Operations"
                      ></ColumnChart>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import ColumnChart from "@/components/ColumnChart.vue";

export default {
  name: "Stats",
  components: {
    ColumnChart
  },
  computed: {
    selectedItem() {
      if (this.states.length <= this.selected) return null;
      return this.states[this.selected];
    }
  },
  created() {
    this.getStats();
  },
  data: () => ({
    selected: null,
    states: [],
    loading: true,
    detailsLoading: true,
    details: null,
    contractSeries: null,
    operationSeries: null,
    tab: 0
  }),
  methods: {
    ...mapActions(["showError"]),
    getStats() {
      this.loading = true;
      this.api.getStats()
        .then(res => {
          this.states = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    getDetails(network) {
      this.detailsLoading = true;
      this.contractSeriesLoading = true;
      this.operationSeriesLoading = true;

      this.api.getNetworkStats(network)
        .then(res => {
          this.details = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.detailsLoading = false));

      this.api.getNetworkStatsSeries(network, "contract", "month")
        .then(res => {
          this.contractSeries = res;
        })
        .catch(err => {
          this.contractSeries = [];
          console.log(err);
          this.showError(err);
        });

      this.api.getNetworkStatsSeries(network, "operation", "month")
        .then(res => {
          this.operationSeries = res;
        })
        .catch(err => {
          this.operationSeries = [];
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
    $route: "getStats",
    selected: function(newValue) {
      if (this.states.length <= newValue) return;
      this.getDetails(this.states[newValue].network);
    }
  }
};
</script>

<style lang="scss" scoped>
.item-protocol {
  font-size: 12px;
}
</style>