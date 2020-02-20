<template>
  <div>
    <v-app-bar extended fixed app elevation="1">
      <v-combobox
        dense
        class="ml-6"
        :search-input.sync="searchText"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search anything"
        autocomplete="off"
        no-filter
        append-icon
        clearable
        hide-selected
        hide-details
        outlined
        @change="onSearch"
      ></v-combobox>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-btn icon color="primary">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon color="primary">
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="tab" class="ml-7">
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab>
            <v-icon left small>mdi-select-search</v-icon>All
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-file-search-outline</v-icon>Addresses
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-format-annotation-plus</v-icon>Annotations
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-message-alert-outline</v-icon>Fail strings
          </v-tab>
          <v-tab>
            <v-icon left small>mdi-doorbell</v-icon>Enrtypoints
          </v-tab>
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn text class="align-self-center mr-7 tab-btn" v-on="on" small>
                <v-icon small left>mdi-dots-vertical</v-icon>more
              </v-btn>
            </template>

            <v-list class="grey lighten-5">
              <v-list-item @click="tab=5">
                <v-icon left small>mdi-account-star-outline</v-icon>Creator
              </v-list-item>
              <v-list-item @click="tab=6">
                <v-icon left small>mdi-account-multiple-outline</v-icon>Delegate
              </v-list-item>
              <v-list-item @click="tab=7">
                <v-icon left small>mdi-tag-multiple-outline</v-icon>Tags
              </v-list-item>
              <v-list-item @click="tab=8">
                <v-icon left small>mdi-language-cpp</v-icon>Language
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            text
            small
            class="align-self-center ml-10 tab-btn"
            @click="showTools = !showTools"
          >Tools</v-btn>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-container style="max-width: 960px; margin-left: 100px;">
      <v-expand-transition>
        <v-card v-show="showTools" class="mx-auto transparent" elevation="0">
          <v-row>
            <v-col>
              <v-select
                v-model="selectedTime"
                :items="timeItems"
                outlined
                hide-details
                dense
                item-text="name"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                :items="networkItems"
                v-model="networks"
                item-text="name"
                item-value="value"
                outlined
                multiple
                hide-details
                chips
                dense
                no-data-text="No networks"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="selectAllNetworks">
                    <v-list-item-action>
                      <v-icon
                        :color="networks.length > 0 ? 'primary' : ''"
                      >{{ networksSelectAllIcon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Select All</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>

                <template v-slot:selection="{ item, index }">
                  <v-chip
                    small
                    v-if="index < 2"
                    color="secondary"
                    class="grey--text text--darken-1"
                    close
                    @click:close="deselectNetworkItem(item.value)"
                  >
                    <span>{{ item.name }}</span>
                  </v-chip>
                  <span
                    v-if="index === 2"
                    class="grey--text caption"
                  >(+{{ networks.length - 2 }} others)</span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-expand-transition>
      <div v-if="total > 0">
        <span class="time-info">Found {{ total }} contracts ({{ elasticTime }} ms)</span>
        <template v-for="(item, idx) in suggests">
          <div class="item" :key="idx">
            <v-hover v-slot:default="{ hover }">
              <v-card class="my-3 transparent" :elevation="hover ? 2 : 0" @click="onSearch(item)">
                <v-list-item three-line>
                  <v-list-item-content>
                    <span class="overline" v-if="item.found_by">Found by {{ item.found_by }}</span>
                    <v-list-item-title class="subtitle-1">{{ item.address }}</v-list-item-title>
                    <v-list-item-subtitle
                      class="subtitle-2"
                      v-if="item.manager"
                    >Created by {{ item.manager }}</v-list-item-subtitle>
                    <v-list-item-subtitle
                      class="caption"
                    >Deployed {{ formatDate(item.timestamp)}} - {{ item.language }}</v-list-item-subtitle>

                    <div class="d-flex flex-horizontal mt-1">
                      <v-chip
                        v-for="tag in item.tags"
                        :key="tag"
                        color="secondary"
                        text-color="grey darken-1"
                        class="mr-1 caption"
                        small
                        label
                        pill
                      >{{ tag.replace('_', ' ') }}</v-chip>
                    </div>

                    <div v-if="item.group" class="mt-3 mx-2">
                      <span class="overline">Same contracts</span>
                      <template v-for="(top) in item.group.top">
                        <div :key="top.address" class="d-flex flex-horizontal my-2 align-center">
                          <router-link
                            class="hash same-link mr-3"
                            :to="{'name': 'project', params:{'address': top.address, 'network': top.network}}"
                          >{{ top.address }}</router-link>
                          <span class="same-network">{{ top.network }}</span>
                        </div>
                      </template>
                      <p
                        class="time-info"
                        v-if="item.group.count > 5"
                      >and {{ item.group.count - 5 }} others</p>
                    </div>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text class="overline primary--text" v-text="item.network"></v-list-item-action-text>
                    <v-list-item-action-text
                      v-if="item.tx_count"
                      class="caption"
                    >{{ item.tx_count }} operations</v-list-item-action-text>
                    <v-list-item-action-text
                      v-if="item.last_action"
                      class="caption"
                    >the last one was {{ formatDate(item.last_action) }}</v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </v-card>
            </v-hover>
          </div>
        </template>
        <span v-intersect="onDownloadPage"></span>
      </div>
      <v-card
        v-else-if="searchText == '' || searchText == null"
        class="d-flex flex-column align-center justify-center mt-12 transparent"
        :elevation="0"
      >
        <v-icon size="100">mdi-layers-search-outline</v-icon>
        <span class="headline">You can try search anything</span>
        <span
          class="subtitle-1 grey--text"
        >Type address, annotation, entrypoint name or anything related to the contract you search</span>
      </v-card>
      <v-card
        v-else
        class="d-flex flex-column align-center justify-center mt-12 transparent"
        :elevation="0"
      >
        <v-icon size="100">mdi-ghost</v-icon>
        <span class="headline">Unknown search request</span>
        <span
          class="subtitle-1 grey--text"
        >Type another address, annotation, entrypoint name or anything related to the contract you search</span>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import * as api from "@/api/index.js";
import { checkAddress } from "@/utils/tz.js";

import dayjs from "dayjs";

export default {
  name: "ExtendedSearchToolbar",
  data: () => ({
    suggests: [],
    searchText: "",
    total: 0,
    elasticTime: 0,
    loading: false,
    completed: false,
    tab: 0,
    selectedTime: 0,
    showTools: false,
    showTimeDialog: false,
    networks: ["mainnet", "babylonnet", "carthagenet", "zeronet"],
    timeItems: [
      {
        name: "Any time",
        value: 0
      },
      {
        name: "Past hour",
        value: 1
      },
      {
        name: "Past 24 hours",
        value: 2
      },
      {
        name: "Past week",
        value: 3
      },
      {
        name: "Past month",
        value: 4
      },
      {
        name: "Past year",
        value: 5
      }
    ],
    networkItems: [
      {
        name: "MainNet",
        value: "mainnet"
      },
      {
        name: "BabylonNet",
        value: "babylonnet"
      },
      {
        name: "CarthageNet",
        value: "carthagenet"
      },
      {
        name: "ZeroNet",
        value: "zeronet"
      }
    ]
  }),
  computed: {
    fields() {
      if (this.tab == 1) {
        return ["address"];
      } else if (this.tab == 2) {
        return ["annots"];
      } else if (this.tab == 3) {
        return ["fail"];
      } else if (this.tab == 4) {
        return ["entry"];
      } else if (this.tab == 5) {
        return ["manager"];
      } else if (this.tab == 6) {
        return ["delegate"];
      } else if (this.tab == 7) {
        return ["tags"];
      } else if (this.tab == 8) {
        return ["language"];
      }
      return [];
    },
    queryTime() {
      if (this.selectedTime == 1) {
        return {
          s: dayjs()
            .subtract(1, "hour")
            .unix()
        };
      } else if (this.selectedTime == 2) {
        return {
          s: dayjs()
            .subtract(1, "day")
            .unix()
        };
      } else if (this.selectedTime == 3) {
        return {
          s: dayjs()
            .subtract(1, "week")
            .unix()
        };
      } else if (this.selectedTime == 4) {
        return {
          s: dayjs()
            .subtract(1, "month")
            .unix()
        };
      } else if (this.selectedTime == 5) {
        return {
          s: dayjs()
            .subtract(1, "year")
            .unix()
        };
      } else if (this.selectedTime == 0) {
        return {};
      }
      return {};
    },
    networksSelectAllIcon() {
      if (this.networks.length === this.networkItems.length)
        return "mdi-close-box";
      if (this.networks.length > 0) return "mdi-plus-box";
      return "mdi-checkbox-blank-outline";
    }
  },
  methods: {
    formatDate(value) {
      if (value) {
        return dayjs(value).format("MMM D, YYYY");
      }
    },

    onSearch(value) {
      if (checkAddress(value.address)) {
        this.$router.push({ path: `/${value.network}/${value.address}` });
      }
    },
    onDownloadPage(entries) {
      if (entries[0].isIntersecting) {
        this.search(
          this.searchText,
          this.fields,
          true,
          this.networks,
          this.queryTime
        );
      }
    },
    search(text, fields = [], push = false, networks = [], time = {}) {
      let hasText = text != null && text.length >= 2;
      if (!this.loading && hasText && !this.completed) {
        this.loading = true;
        let offset = push ? this.suggests.length : 0;
        api
          .search(text, fields, offset, networks, time, 1)
          .then(res => {
            console.log(res.contracts.length);
            this.completed = res.contracts.length == 0;
            if (!this.completed) {
              if (push) {
                this.suggests.push(...res.contracts);
              } else {
                this.suggests = res.contracts;
              }
              this.total = res.count;
              this.elasticTime = res.time;
            }
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.loading = false;
          });
      }
    },
    selectAllNetworks() {
      this.$nextTick(() => {
        if (this.networks.length == this.networkItems.length) {
          this.networks = [];
        } else {
          this.networks = this.networkItems.map(x => x.value);
        }
      });
    },
    deselectNetworkItem(value) {
      this.networks.splice(this.networks.indexOf(value), 1);
    }
  },
  watch: {
    searchText(val) {
      this.completed = false;
      this.search(val, this.fields, false, this.networks, this.queryTime);
    },
    fields(val) {
      this.completed = false;
      this.search(this.searchText, val, false, this.networks, this.queryTime);
    },
    networks(val) {
      this.completed = false;
      this.search(this.searchText, this.fields, false, val, this.queryTime);
    },
    queryTime(val) {
      this.completed = false;
      this.search(this.searchText, this.fields, false, this.networks, val);
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}

.item {
  max-width: 600px;
}
.item:hover {
  cursor: pointer;
}

.time-info {
  color: grey;
  font-size: 12px;
}

.v-tab {
  font-size: 12px;
}

.tab-btn {
  color: rgba(0, 0, 0, 0.54);
}

.same-link {
  font-size: 12px;
  color: grey;
}

.same-network {
  font-size: 12px;
  color: #70757a;
}

.same-link:hover {
  color: #5b942a;
}
</style>