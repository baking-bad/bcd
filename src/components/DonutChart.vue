<template>
  <highcharts ref="chart" :options="options"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  name: "DonutChart",
  props: {
    data: Array,
    title: String,
    name: String
  },
  components: {
    highcharts: Chart
  },
  computed: {
    options() {
      if (this.data == null) return {};
      return {
        title: {
          text: this.title,
          useHTML: true,
          floating: true,
          y: 20,
          style: {
            color: "var(--v-text-base)"
          }
        },
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          plotBackgroundColor: "transparent",
          marginTop: 50,
          style: {
            fontFamily: "Roboto Condensed, sans-serif"
          }
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        navigator: {
          enabled: false
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            shadow: false,
            center: ["50%", "50%"],
            size: "100%",
            borderColor: "transparent",
            tooltip: {
              headerFormat: "<big>{point.key}</big><br/>",
              pointFormat:
                '<span style="color:{point.color}">\u25CF</span> <big>{point.percentage:.2f}</big> %<br/>'
            },
            followTouchMove: false,
            slicedOffset: 2
          }
        },
        rangeSelector: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        tooltip: {
          split: false,
          style: {
            color: "#000",
            fontSize: "12px",
            pointerEvents: "none"
          },
          followTouchMove: false
        },
        series: [{
          type: 'pie',
          name: this.name,
          data: this.data
        }]
      };
    }
  }
};
</script>