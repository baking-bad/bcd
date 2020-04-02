<template>
  <v-navigation-drawer v-model="show" width="400" absolute stateless hide-overlay right>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-select
            v-model="filters.startTime"
            :items="timeItems"
            label="Time"
            hide-details
            item-text="name"
            item-value="value"
          ></v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Networks</v-list-item-subtitle>
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
          <v-list-item-subtitle>Languages (only for contracts)</v-list-item-subtitle>
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
export default {
  name: "SearchNav",
  props: {
    value: Boolean,
    filters: Object
  },
  created() {
    this.show = this.value;
  },
  data: () => ({
    show: false,
    selectedTime: 0,
    newFilters: {
      startTime: 0,
      networks: [],
      languages: []
    },
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
    networkItems: ["mainnet", "babylonnet", "carthagenet", "zeronet"],
    languages: ["michelson", "smartpy", "liquidity", "ligo", "lorentz"]
  }),
  watch: {
    show: function(newValue) {
      if (newValue) {
        this.newFilters = this.filters;
      }
    },
    value: function(newValue) {
      this.show = newValue;
    },
    newFilters: {
      deep: true,
      handler: function(newValue) {
        this.filters = newValue;
      }
    },
    languagesSelection: function(newValue) {
      this.filters.languages = [];
      newValue.forEach(x => {
        this.filters.languages.push(this.languages[x]);
      });
    },
    networksSelection: function(newValue) {
      this.filters.networks = [];
      newValue.forEach(x => {
        this.filters.networks.push(this.networkItems[x]);
      });
    }
  }
};
</script>
