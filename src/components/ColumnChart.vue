<template>
  <highcharts ref="chart" :options="options"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  name: "ColumnChart",
  props: {
    data: Array,
    title: String,
    yAxisTitle: String,
    color: String,
    name: String
  },
  components: {
    highcharts: Chart
  },
  computed: {
    options() {
      if (this.data == null) return {};
      return {
        xAxis: {
          type: "datetime"
        },
        yAxis: {
          title: {
            text: this.yAxisTitle
          }
        },
        title: {
          text: this.title
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [
          {
            type: "column",
            data: this.data,
            color: this.color,
            name: this.name
          }
        ]
      };
    }
  }
};
</script>