<template>
  <highcharts
    :constructor-type="'stockChart'"
    ref="chart"
    :options="options"
  ></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock";
import { MONTH_IN_MS } from "@/constants/date";

stockInit(Highcharts);

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
  return value;
}

export default {
  name: "ColumnChart",
  props: {
    data: Array,
    timestamps: Array,
    title: String,
    name: String,
    formatter: String,
    zoom: Boolean,
    minAmountOfGraphs: Number,
  },
  components: {
    highcharts: Chart,
  },
  methods: {
    setTimestampsButtons() {
      return this.timestamps.map(period => {
        if (period in this.AVAILABLE_TIMESTAMPS) {
          return this.AVAILABLE_TIMESTAMPS[period];
        }
      });
    },
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
      const buttons = this.timestamps ? this.setTimestampsButtons() : this.setDefaultButtons();
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
            buttons,
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
  data() {
    return {
      AVAILABLE_TIMESTAMPS: {
        daily: {
          type: "day",
          count: this.minAmountOfGraphs - 1,
          text: "1D",
        },
        hourly: {
          type: "hour",
          count: this.minAmountOfGraphs - 1,
          text: "1h",
        }
      }
    }
  },
};
</script>
