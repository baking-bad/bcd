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
import HighchartsNoData from 'highcharts-no-data-to-display';

exportingInit(Highcharts);
HighchartsNoData(Highcharts);

function kilobyteFormatter(value, digits = 4) {
  return (value / 1024).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function utzFormatter(value, digits = 6) {
  return (value / 10 ** 6).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function defaultFormatter(value) {
  return value.toLocaleString(undefined);
}


function valueFormatterFunction(formatType, value) {
  if (formatType === "utz") {
    return utzFormatter(value, 6);
  }
  if (formatType === "kb") {
    return kilobyteFormatter(value);
  }
  return defaultFormatter(value);
}

export default {
  name: "LineChart",
  props: {
    data: Array,
    title: String,
    name: String,
    formatType: String,
    exporting: Boolean
  },
  components: {
    highcharts: Chart,
  },
  computed: {
    tooltipFormatterFunction() {
      let formatType = this.formatType;
      return function () {
        let value = valueFormatterFunction(formatType, this.y);
        return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${value}</b><br/>`;
      };
    },
    customFormatter() {
      let formatType = this.formatType;
      return function(value) {
        return valueFormatterFunction(formatType, value.value);
      }
    }, 
    options() {
      if (this.data == null) return {};
      let options = {
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        xAxis: {
          type: "datetime",
          tickmarkPlacement: "off",
          title: {
            enabled: false,
          },
          tickWidth: 0,
          lineWidth: 1,
          lineColor: "var(--v-border-base)",
          endOfTick: false,
          gridLineWidth: 0,
          tickPixelInterval: 65,
          showEmpty: false,
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
          gridLineWidth: 1,
          gridLineColor: "var(--v-border-base)",
          gridLineDashStyle: 'ShortDot',
          labels: {
            enabled: true,
            formatter: this.customFormatter
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "medium",
              color: "var(--v-secondary-base)",
              fontSize: "12px",
              textOutline: "none",
            },
            formatter: this.customFormatter
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
          xDateFormat: "%e %B %Y",
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
            opacity: 0.7,
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
                  [1, 'var(--v-canvas-base)']
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
          areaspline: {
            shadow: true,
          },
        },
        rangeSelector: {
          enabled: false,
          inputEnabled: false,
        },
        noData: {
            style: {
                fontSize: '15px',
                color: 'var(--v-text-base)',
                opacity: 0.7,
                fontWeight: 'normal',
            },
            position: {
              y: -5
            }
        },
        lang: {
          noData: "No data for this period are available",
          loading: "Loading..."
        },
      };

      if (this.exporting) {
        options.exporting = {
          enabled: true,
          buttons: {
            contextButton: {
              enabled:true,
              titleKey: 'contextButtonTitle',
              symbolFill: '#00000000',
              symbolStrokeWidth: 1,
              symbolStroke: "var(--v-primary-base)",
              theme: {
                fill: 'transparent'
              }
            }
          },
        }
      }

      return options;
    },
  }
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
