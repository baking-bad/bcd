<template>
  <v-navigation-drawer v-model="show" width="400" absolute stateless hide-overlay right>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="subtitle-1">Time period</v-list-item-subtitle>
          <v-select
            class="pt-0 mr-8"
            v-model="selectedTime"
            :items="timeItems"
            hide-details
            item-text="name"
            item-value="value"
          ></v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="subtitle-1">Networks</v-list-item-subtitle>
          <v-chip-group
            v-model="networksSelection"
            column
            multiple
            mandatory
            active-class="primary--text"
          >
            <v-chip filter v-for="net in networkItems" :key="net">{{ net }}</v-chip>
          </v-chip-group>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>
            <span class="subtitle-1">Languages</span>
            <span class="ml-4 overline">applied to contracts</span>
          </v-list-item-subtitle>
          <v-chip-group
            v-model="languagesSelection"
            column
            multiple
            mandatory
            active-class="primary--text"
          >
            <v-chip filter v-for="lang in languages" :key="lang">{{ lang }}</v-chip>
          </v-chip-group>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "SearchNav",
  props: {
    filters: Object
  },
  data: () => ({
    show: true,
    selectedTime: 0,
    languagesSelection: [0, 1, 2, 3, 4],
    networksSelection: [0, 1, 2, 3],
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
    networkItems: ["mainnet", "carthagenet", "zeronet", "babylonnet"],
    languages: ["michelson", "ligo", "lorentz", "smartpy", "liquidity"]
  }), 
  watch: {
    languagesSelection: function(newValue) {
      this.filters.languages = [];
      if (newValue.length < this.languages.length) {
        newValue.forEach(x => {
          this.filters.languages.push(this.languages[x]);
        });
      }
    },
    networksSelection: function(newValue) {
      this.filters.networks = [];
      if (newValue.length < this.languages.length) {
        newValue.forEach(x => {
          this.filters.networks.push(this.networkItems[x]);
        });
      }
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
    }
  }
};
</script>
