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
          type: "datetime",
          tickmarkPlacement: "off",
          title: {
            enabled: false
          },
          tickWidth: 0,
          lineWidth: 0,
          endOfTick: false,
          gridLineWidth: 0,
          tickPixelInterval: 65,
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%e %b",
            week: "%e %b",
            month: "%b '%y",
            year: "%Y"
          },
          labels: {
            style: {
              fontSize: "12px"
            }
          }
        },
        yAxis: {
          enabled: false,
          title: {
            text: ""
          },
          gridLineWidth: 0,
          labels: {
            enabled: false
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "medium",
              color: "var(--v-secondary-base)",
              fontSize: "12px",
              textOutline: "none"
            }
          }
        },
        title: {
          text: this.title,
          useHTML: true,
          floating: true,
          y: 20,
          style: {
            color: "var(--v-text-base)"
          }
        },
        tooltip: {
          followTouchMove: false,
          headerFormat: '<span style="font-size: 12px">{point.key}</span><br/>',
          backgroundColor: "var(--v-sidebar-base)",
          shadow: false,
          borderWidth: 0,
          xDateFormat: "%B %Y",
          useHTML: true,
          style: {
            color: "var(--v-text-base)",
            pointerEvents: "none",
            fontSize: '14px'
          }
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
            color: "var(--v-primary-base)",
            name: this.name,
            borderColor: "transparent",
            label: {}
          }
        ],
        chart: {
          backgroundColor: "transparent",
          plotBackgroundColor: "transparent",
          marginTop: 50,
          style: {
            fontFamily: "Roboto Condensed, sans-serif"
          }
        },
        plotOptions: {
          column: {
            stacking: "normal"
          }
        }
      };
    }
  }
};
</script>