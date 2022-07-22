<template>
  <highcharts
    ref="chart"
    :options="options"
  ></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import { MONTH_IN_MS } from "@/utils/date";

function kilobyteFormatter(value, digits = 4) {
  return (value / 1024).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function gasFormatter(value, digits = 6) {
  return (value / 10 ** 6).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function floorFormatter(value, digits = 6) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function defaultFormatter(value) {
  return value.toLocaleString(undefined);
}

export default {
  name: "ColumnChart",
  props: {
    data: Array,
    title: String,
    name: String,
    formatter: String,
    zoom: Boolean,
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
      if (this.formatter === "kilobyte") {
        return function () {
          return kilobyteFormatter(this.total, 0);
        };
      } else if (this.formatter === "gas") {
        return function () {
          return gasFormatter(this.total, 0);
        };
      }
      return function () {
        return defaultFormatter(this.total);
      };
    },
    tooltipFormatterFunction() {
      if (this.formatter === "kilobyte") {
        return function () {
          let value = kilobyteFormatter(this.y);
          return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${value} KB</b><br/>`;
        };
      } else if (this.formatter === "gas") {
        return function () {
          let value = floorFormatter(this.y, 0);
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
      let options = {
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        xAxis: {
          type: "datetime",
          tickmarkPlacement: "off",
          title: {
            enabled: false,
          },
          minPadding: 0.05,
          maxPadding: 0.05,
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
          enabled: false,
          title: {
            text: "",
          },
          gridLineWidth: 0,
          labels: {
            enabled: false,
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
            type: "column",
            data: this.data,
            color: "var(--v-primary-base)",
            name: this.name,
            borderColor: "transparent",
            label: {},
          },
        ],
        chart: {
          backgroundColor: "transparent",
          plotBackgroundColor: "transparent",
          marginTop: 50,
          style: {
            fontFamily: "Roboto Condensed, sans-serif",
          },
        },
        plotOptions: {
          column: {
            stacking: "normal",
          },
        },
      };

      if (this.zoom) {
        options = Object.assign(options, {
          rangeSelector: {
            allButtonsEnabled: true,
            buttonPosition: {
              y: -32,
              x: -10,
            },
            buttonTheme: {
              fill: "none",
              stroke: "none",
              "stroke-width": 0,
              style: {
                color: "var(--v-primary-base)",
              },
              states: {
                hover: {
                  fill: "var(--v-primary-base)",
                  style: {
                    color: "#fff",
                  },
                },
                select: {
                  fill: "var(--v-primary-base)",
                  style: {
                    color: "#fff",
                  },
                },
                disabled: {
                  style: {
                    color: "#666",
                  },
                },
              },
            },
            buttons: this.setDefaultButtons(),
            selected: 0,
            labelStyle: {
              color: "transparent",
            },
            inputEnabled: false,
          },
        });
      } else {
        options = Object.assign(options, {
          rangeSelector: {
            enabled: false,
            inputEnabled: false,
          },
        });
      }
      return options;
    },
  },
};
</script>
