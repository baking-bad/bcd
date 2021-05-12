<template>
  <v-navigation-drawer class="pt-12 pr-8 canvas" floating v-model="show" width="450" absolute stateless hide-overlay right>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="caption font-weight-medium text-uppercase">Time period</v-list-item-subtitle>
          <v-select
            class="mt-2"
            v-model="selectedTime"
            :items="timeItems"
            hide-details
            outlined
            dense
            rounded
            item-text="name"
            item-value="value"
            style="max-width: 200px;"
          ></v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="caption font-weight-medium text-uppercase">Networks</v-list-item-subtitle>
          <v-chip-group
            v-model="networksSelection"
            column
            multiple
            mandatory
            active-class="secondary--text"
          >
            <v-chip filter outlined v-for="net in config.networks" :key="net">{{ net }}</v-chip>
          </v-chip-group>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "SearchFilters",
  props: {
    filters: Object,
    show: Boolean,
  },
  data: () => ({
    selectedTime: 0,
    networksSelection: [],
    timeItems: [
      {
        name: "Any time",
        value: 0
      },
      {
        name: "Last hour",
        value: 1
      },
      {
        name: "Last 24 hours",
        value: 2
      },
      {
        name: "Last week",
        value: 3
      },
      {
        name: "Last month",
        value: 4
      },
      {
        name: "Last year",
        value: 5
      }
    ],
  }),
  created() {
    this.networksSelection = [...this.config.networks.keys()];
  },
  watch: {
    networksSelection: function(newValue) {
      this.filters.networks = [];
      newValue.forEach(x => {
        this.filters.networks.push(this.config.networks[x]);
      });
    },
    selectedTime: function(newValue) {
      let ts = 0;
      if (newValue === 1) {
        ts = dayjs().subtract(1, "hour").unix();
      } else if (newValue === 2) {
        ts = dayjs().subtract(1, "day").unix();
      } else if (newValue === 3) {
        ts = dayjs().subtract(1, "week").unix();
      } else if (newValue === 4) {
        ts = dayjs().subtract(1, "month").unix();
      } else if (newValue === 5) {
        ts = dayjs().subtract(1, "year").unix();
      }
      this.filters.startTime = ts;
    },
    show: function(newValue) {
      if (newValue === false) {
        this.selectedTime = 0;
        this.networksSelection = [...this.config.networks.keys()];
      }
    }
  }
};
</script>
