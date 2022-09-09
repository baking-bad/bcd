<template>
    <v-dialog v-model="show" max-width="600" @keydown.esc="show = false" @keydown.enter="saveOnEnter" persistent>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center py-2">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Filters</span>
          <v-spacer></v-spacer>
          <v-btn small text @click="reset">
            <v-icon class="mr-1 text--secondary">mdi-autorenew</v-icon>
        </v-btn>
          <v-btn icon small @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-6 pb-0">
           <v-row>
            <v-col cols="12">
                <v-select
                    v-model="internalFilters.status"
                    :items="status"
                    chips
                    outlined
                    clearable
                    dense
                    small-chips
                    label="Status"
                    placeholder="Any"
                    multiple
                    background-color="data"
                    hide-details
                >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="selectAllStatuses">
                    <v-list-item-action>
                      <v-icon>{{ selectAllIconStatuses }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        Select All
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
                <template v-slot:selection="{ item, index }">
                    <v-chip x-small v-if="index < 1">
                    <span>{{ item }}</span> </v-chip
                    >&nbsp;
                    <span v-if="index === 1" class="grey--text caption"
                    >+{{ internalFilters.status.length - 1 }} others</span
                    >
                </template>
                </v-select>
            </v-col>
            <v-col cols="12" v-if="isContract">
                <v-select
                    v-model="internalFilters.entrypoints"
                    :items="contract.entrypoints"
                    chips
                    dense
                    small-chips
                    outlined
                    clearable
                    background-color="data"
                    label="Entrypoint"
                    placeholder="Any"
                    multiple
                    hide-details
                >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="selectAllEntrypoints">
                    <v-list-item-action>
                      <v-icon>{{ selectAllIconEntrypoints }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        Select All
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
                <template v-slot:selection="{ index }">
                    <v-chip x-small v-if="index < 1">
                        <span>{{ shortestEntrypoint }}</span> 
                    </v-chip>&nbsp;
                    <span v-if="index === 1" class="grey--text caption">+{{ internalFilters.entrypoints.length - 1 }} others</span>
                </template>
                </v-select>
            </v-col>

            <v-col cols="12" class="d-flex justify-space-between align-center">
                <v-menu
                    ref="menu"
                    v-model="datesModal"
                    :close-on-content-click="false"
                    :return-value.sync="internalFilters.dates"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="dateRangeText"
                            label="Date range"
                            placeholder="All time"
                            readonly
                            dense
                            outlined
                            clearable
                            background-color="data"
                            hide-details
                            v-on="on"
                            @click:clear="resetDates"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="datesBuf" min="2018-06-30" :max="maxDate" scrollable range show-current>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="datesModal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(datesBuf)">OK</v-btn>
                    </v-date-picker>
                </v-menu>                
            </v-col>
           </v-row>
        </v-card-text>
        <v-card-actions class="justify-end px-5">
          <v-btn color="primary" text @click="saveOnEnter">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>

import dayjs from "dayjs";
import {isKT1Address} from '@/utils/tz.js';

export default {
    name: "OperationFilters",
    props: {
        value: Boolean,
        contract: Object,
        filters: Object
    },
    created() {
        this.internalFilters = Object.assign({}, this.filters);
    },
    data: () => ({
        datesBuf: [],
        datesModal: false,
        internalFilters: null
    }),
    computed: {
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      status() {
        return [
            'applied',
            'failed',
            'backtracked',
            'skipped',
            'pending',
            'lost',
            'refused',
            'branch_refused',
        ]
      },
      isContract() {
        if (this.contract.address) return isKT1Address(this.contract.address);
        return false;
      },
      dateRangeText() {
        let texts = this.internalFilters.dates.map((d) => dayjs(d).format("MMM DD"));
        if (texts.length === 2) {
            return texts.join(" — ");
        } else if (texts.length === 1) {
            return texts[0];
        } else {
            return "";
        }
        },
      shortestEntrypoint() {
        if (this.internalFilters.entrypoints.length === 0) return "";
        let s = this.internalFilters.entrypoints[0];

        for (let i = 1; i < this.internalFilters.entrypoints.length; i++) {
            if (this.internalFilters.entrypoints[i].length < s.length) s = this.internalFilters.entrypoints[i];
        }
        return s;
      },
      maxDate() {
        return dayjs().format("YYYY-MM-DD");
      },
      selectedAllStatuses() {
        return this.internalFilters.status.length == this.status.length;
      },
      selectAllIconStatuses() {
        if (this.selectedAllStatuses) {
          return 'mdi-close-box';
        }
        return  'mdi-checkbox-blank-outline';
      },
      selectedAllEntrypoints() {
        return this.internalFilters.entrypoints.length == this.contract.entrypoints.length;
      },
      selectAllIconEntrypoints() {
        if (this.selectedAllEntrypoints) {
          return 'mdi-close-box';
        }
        return  'mdi-checkbox-blank-outline';
      }
    },
    methods: {
        filter() {
            this.$emit('filterChanged', Object.assign({}, this.internalFilters));
        },
        resetDates() {
          this.internalFilters.dates = [];
          this.datesBuf = [];
        },
        reset() {
            this.internalFilters = {
                entrypoints: [],
                status: [],
                dates: [],
            };
            this.datesBuf = [];
            this.datesModal = false;
        },
        saveOnEnter() {
          this.filter();
          this.show = false;
        },
        selectAllStatuses() {
          if (this.selectedAllStatuses) {
            this.internalFilters.status = [];
          } else  {
            this.internalFilters.status = this.status;
          }
        },
        selectAllEntrypoints() {
          if (this.selectedAllEntrypoints) {
            this.internalFilters.entrypoints = [];
          } else  {
            this.internalFilters.entrypoints = this.contract.entrypoints;
          }
        }
    },
}
</script>