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
    subtitle: String,
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
        subtitle: {
          text: this.subtitle,
          useHTML: true,
          verticalAlign: "middle",
          y: 40,
          style: {
            color: "var(--v-text-darken4)",
            fontSize: "14px"
          }
        },
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          plotBackgroundColor: "transparent",
          marginTop: 70,
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
              enabled: true,
              distance: 30,
              softConnector: false,
              style: {
                fontWeight: "400",
                color: "var(--v-text-darken2)",
                fontSize: "16px",
                textOutline: "none"
              }
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
          followTouchMove: false,
          headerFormat: '<span style="font-size: 12px">{point.key}</span><br/>',
          backgroundColor: "var(--v-sidebar-base)",
          shadow: false,
          borderWidth: 0,
          useHTML: true,
          style: {
            color: "var(--v-text-base)",
            pointerEvents: "none",
            fontSize: '14px'
          }
        },
        series: [{
          type: 'pie',
          innerSize: '90%',
          name: this.name,
          data: this.data
        }]
      };
    }
  }
};
</script>