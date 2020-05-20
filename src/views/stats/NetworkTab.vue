

<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="6" class="pr-4">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="contractSeries"
              yAxisTitle="Contracts count"
              color="#5b942a"
              title="New deployments"
              name="New deployments"
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="pl-4">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="operationSeries"
              yAxisTitle="Operations count"
              color="#dcedc8"
              title="Contract calls"
              name="Contract calls"
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row no-gutters>
      <v-col>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-center overline">Smart contracts count</v-list-item-title>
            <v-list-item-subtitle class="text-center display-1">{{ details.contracts_count }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-center overline">Operations count</v-list-item-title>
            <v-list-item-subtitle class="text-center display-1">{{ details.operations_count }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col>
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
                  <v-list-item-action-text
                    class="primary--text"
                  >{{ item.hash == '' ? 'current' : ''}}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>-->
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import ColumnChart from "@/components/ColumnChart.vue";

export default {
  name: "NetworkTab",
  props: {
    network: String
  },
  components: {
    ColumnChart
  },
  created() {
    if (this.network) {
      this.getDetails(this.network);
    }
  },
  data: () => ({
    loading: true,
    details: null,
    contractSeries: null,
    operationSeries: null
  }),
  methods: {
    ...mapActions(["showError"]),
    getDetails(network) {
      this.loading = true;

      this.api
        .getNetworkStats(network)
        .then(res => {
          this.details = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));

      this.api
        .getNetworkStatsSeries(network, "contract", "month")
        .then(res => {
          this.contractSeries = res;
        })
        .catch(err => {
          this.contractSeries = [];
          console.log(err);
          this.showError(err);
        });

      this.api
        .getNetworkStatsSeries(network, "operation", "month")
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
    network(newValue) {
      this.getDetails(newValue);
    }
  }
};
</script>
