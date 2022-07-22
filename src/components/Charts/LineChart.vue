<template>
  <highcharts
    ref="chart"
    :options="options"
  ></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import { MONTH_IN_MS } from "@/utils/date";

exportingInit(Highcharts)


function burnedFormatter(value, digits = 6) {
  return (value / 10 ** 6).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function defaultFormatter(value) {
  return value.toLocaleString(undefined);
}

export default {
  name: "LineChart",
  props: {
    data: Array,
    title: String,
    name: String,
    formatter: String
  },
  components: {
    highcharts: Chart,
  },
  methods: {
    setDefaultButtons() {
      const firstElement = this.data[0];
      const firstData = firstElement[0];
      if (new Date() - firstData < MONTH_IN_MS * 6) {
        return [
          {
            type: "all",
            text: "All",
          },
        ];
      } else {
        return [
          {
            type: "month",
            count: 6,
            text: "6m",
          },
          {
            type: "year",
            count: 1,
            text: "1Y",
          },
          {
            type: "all",
            text: "All",
          },
        ];
      }
    }
  },
  computed: {
    labelFormatterFunction() {
      if (this.formatter === "burned") {
        return function () {
          return burnedFormatter(this.total, 6);
        };
      }
      return function () {
        return defaultFormatter(this.total);
      };
    },
    tooltipFormatterFunction() {
     if (this.formatter === "burned") {
        return function () {
          let value = burnedFormatter(this.y, 6);
          return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${value}</b><br/>`;
        };
      }
      return function () {
        let value = defaultFormatter(this.y);
        return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${value}</b><br/>`;
      };
    },
    options() {
      if (this.data == null) return {};
      return {
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        exporting: {
          enabled: false,
          buttons: {
            contextButton: {
              enabled:true,
              titleKey: 'contextButtonTitle',
              menuItems: ["viewFullscreen", "downloadSVG"],
              symbolFill: '#00000000',
              symbolStrokeWidth: 1,
              symbolStroke: "var(--v-primary-base)",
              theme: {
                fill: 'transparent'
              }
            }
          },
        },
        xAxis: {
          type: "datetime",
          tickmarkPlacement: "off",
          title: {
            enabled: false,
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
            year: "%Y",
          },
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        yAxis: {
          enabled: true,
          title: {
            text: "",
          },
          gridLineWidth: 0,
          labels: {
            enabled: true,
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "medium",
              color: "var(--v-secondary-base)",
              fontSize: "12px",
              textOutline: "none",
            },
            formatter: this.labelFormatterFunction,
          },
        },
        title: {
          text: this.title,
          useHTML: true,
          floating: true,
          y: 20,
          style: {
            color: "var(--v-text-base)",
          },
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
            fontSize: "14px",
          },
          shared: true,
          pointFormatter: this.tooltipFormatterFunction,
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            type: "areaspline",
            data: this.data,
            color: "var(--v-chartLine-base)",
            name: this.name,
            borderColor: "transparent",
            label: {},
            lineWidth: 1,
            marker: {
              radius: 1
            },
            animation: {
              duration: 1500
            },
            fillColor: {
              linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
              },
              stops: [
                  [0, "var(--v-chart-base)"],
                  [1, 'var(--v-data-base)']
              ]
            }
          },
        ],
        chart: {
          backgroundColor: "transparent",
          plotBackgroundColor: "transparent",
          marginTop: 50,
          style: {
            fontFamily: "Roboto, sans-serif",
          },
        },
        plotOptions: {
          line: {
            shadow: true,
          },
        },
        rangeSelector: {
          enabled: false,
          inputEnabled: false,
        },
      };
    },
  },
};
</script>

<style>
.highcharts-contextmenu {
  top: 10px  !important;
}

.highcharts-menu-item:hover {
  background: var(--v-canvas-base) !important;
  color: var(--v-text-base) !important;
}

.highcharts-menu-item {
  color: var(--v-text-base) !important;
  font-size: 12px !important;
   padding: 10px 15px !important;
}

.highcharts-menu {
  background: var(--v-data-base) !important;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important;
  border-width: 0 !important;
  border-radius: 4px !important;
  padding: 0 !important;
}


.highcharts-button-box {
  fill: transparent !important;
}
</style>
