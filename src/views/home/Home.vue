<template>
  <v-container class="fill-height canvas main-rows-wrapper" fluid>
    <v-row no-gutters class="search-row">
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex flex-column align-center justify-center primary--text"
          >
              <span
                class="script-casual"
                style="font-size: 72px"
              >
                Better Call Dev
              </span>
            <p class="mt-0">
              Explore Tezos Smart Contracts and Interact with them
            </p>
          </v-col>
        </v-row>
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" lg="6" xl="4">
            <SearchBox />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="ml-auto mr-auto">
        <header class="d-flex justify-space-between">
          <h3 class="text--secondary font-weight-regular">Recently called contracts</h3>
          <v-btn-toggle v-model="selectedNetwork" color="primary" dense mandatory>
            <v-btn
              small
              :value="data"
              v-for="data in networks"
              :key="data"
            >
              {{ data }}
              <div
                v-if="networksStats.length > 0"
                :class="getSyncClass(data)"
              ></div>
            </v-btn>
          </v-btn-toggle>
        </header>
        <v-fade-transition>
          <v-skeleton-loader :loading="isRecentlyCalledLoading" type="article" transition="fade-transition">
            <v-data-table :items="recentlyCalledContracts" :headers="recentlyCalledTableHeaders" class="ba-1 mt-4" hide-default-footer items-per-page="3">
              <template v-slot:item="{item}">
                <tr>
                  <td>
                    <v-btn
                      class="text--secondary hash"
                      :to="`${item.network}/${item.address}/`"
                      style="text-transform: none;"
                      target="_blank"
                      text>
                        <span v-if="item.alias">
                          {{
                            item.alias.length > aliasMaxLength
                              ? item.alias.slice(0, aliasMaxLength).trim()
                              : item.alias
                          }}<em
                            v-if="item.alias.length > aliasMaxLength"
                            class="v-icon notranslate mdi mdi-dots-horizontal"
                            style="font-size: 16px;"
                          />
                        </span>
                        <span v-else v-html="helpers.shortcut(item.address)"></span>
                      </v-btn>
                  </td>
                  <td>
                    <span class="text--secondary">{{ item.tx_count }}</span>
                  </td>
                  <td>
                    <span class="text--secondary">{{ item.last_action | fromNow }}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-skeleton-loader>
        </v-fade-transition>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" class="ml-auto mr-auto">
        <v-footer
          color="transparent"
          bottom
          class="d-flex justify-center align-center text--disabled"
          style="z-index: 0"
        >
          <span class="overline">Created by</span>
          <a href="https://baking-bad.org/docs" target="_blank" rel="noopener" class="text--secondary text-small ml-1 pa-1 no-decoration overline">Baking Bad</a>
          <span class="ml-1 mr-2">·</span>
          <span class="overline">Hosted on</span>
          <a href="https://www.netlify.com" target="_blank" rel="noopener" class="text--secondary text-small ml-1 pa-1 no-decoration overline">Netlify</a>
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import SearchBox from "@/components/SearchBox.vue";
import {DATA_LOADING_STATUSES} from "../../utils/network";

export default {
  name: "Home",
  components: {
    SearchBox,
  },
  data: () => ({
    stats: [],
    pickingRandom: false,
    loadingHead: true,
    recentlyCalledTableHeaders: [
      {
        text: "Contract",
        class: "pl-8",
        sortable: false,
      },
      {
        text: "Calls",
        sortable: false,
      },
      {
        text: "Last active",
        class: "pl-8",
        sortable: false,
      },
    ],
    recentlyCalledContracts: [],
    listenerRecentlyCalledContracts: null,
    selectedNetwork: 'mainnet',
    networks: window.config.networks,
    loadingRecentlyCalledContractsStatus: DATA_LOADING_STATUSES.NOTHING,
    networksStats: [],
    listenerNetworksSync: null,
  }),
  computed: {
    isRecentlyCalledLoading() {
      return this.loadingRecentlyCalledContractsStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    isNetworkSyncStatsLoading() {
      return this.loadingNetworkSync === DATA_LOADING_STATUSES.PROGRESS;
    }
  },
  created() {
    this.listenNetworksSync();
    this.listenRecentlyCalledContracts();
  },
  destroyed() {
    this.stopListeningNetworksSync();
    this.stopListeningRecentlyCalledContracts();
  },
  watch: {
    selectedNetwork() {
      this.stopListeningRecentlyCalledContracts();
      this.listenRecentlyCalledContracts();
    }
  },
  mounted() {
    if (this.$route.name !== this.config.HOME_PAGE) {
      this.$router.push({ path: this.config.HOME_PAGE });
    }
    this.getHead();
  },
  methods: {
    ...mapActions(["showError"]),
    getSyncClass(value) {
      return this.networksStats.find((item) => item.network === value).synced ? 'synced' : 'unsynced';
    },
    requestNetworkSync() {
      this.loadingNetworkSync = DATA_LOADING_STATUSES.PROGRESS;
      this.api.getHead()
        .then((data) => {
          this.networksStats = data;
          this.loadingNetworkSync = DATA_LOADING_STATUSES.SUCCESS;
        });
    },
    listenNetworksSync() {
      this.requestNetworkSync();
      this.listenerNetworksSync = setTimeout(() => {
        this.listenNetworksSync();
      }, 30 * 1000);
    },
    stopListeningNetworksSync() {
      this.networksStats = [];
      clearTimeout(this.listenerNetworksSync);
    },
    listenRecentlyCalledContracts() {
      this.requestRecentlyCalledContracts();
      this.listenerRecentlyCalledContracts = setTimeout(() => {
        this.listenRecentlyCalledContracts();
      }, 30 * 1000);
    },
    stopListeningRecentlyCalledContracts() {
      this.recentlyCalledContracts = [];
      clearTimeout(this.listenerRecentlyCalledContracts);
    },
    requestRecentlyCalledContracts() {
      this.loadingRecentlyCalledContractsStatus = DATA_LOADING_STATUSES.PROGRESS;
      this.api.getRecentlyCalledContracts(this.selectedNetwork, 3)
        .then((data) => {
          this.recentlyCalledContracts = data;
          this.loadingRecentlyCalledContractsStatus = DATA_LOADING_STATUSES.SUCCESS;
        });
    },
    getHead() {
      this.api
        .getHead()
        .then((res) => {
          this.stats = res;
        })
        .catch((err) => {
            console.log(err);
            this.showError(err);
        })
        .finally(() => {
          this.pickingRandom = false;
        });
    },
    pickRandom(val) {
      const isSelectPressed = val.target && val.target.closest('.network-select');
      if (isSelectPressed || this.pickingRandom) return;
      this.pickingRandom = true;
      this.api
        .getRandomContract(val.target ? '' : val)
        .then((res) => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.showError("The network does not have enough contracts");
          } else if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        })
        .finally(() => {
          this.pickingRandom = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-rows-wrapper {
  .search-row {
    align-items: flex-end;
    margin-top: 4rem;
  }
  .stats-row {
    height: 50%;
  }
  .synced,
  .unsynced {
    width: 0.25rem;
    height: 0.25rem;
    margin-left: 0.25rem;
    border-radius: 100%;
  }
  .synced {
    background: green;
  }
  .unsynced {
    background: red;
  }
}
</style>
<style lang="scss">
button.pick-random-button {
  padding-right: 0 !important;
  & > .v-btn__content {
    height: inherit;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    .network-select {
      margin-left: 1em;
      width: 3em;
      height: 100%;
      margin-top: 0;
      padding-top: 0;
      border-top-right-radius: inherit;
      border-bottom-right-radius: inherit;
      border-left: 1px solid var(--v-data-lighten2);
      color: inherit !important;
      &.theme--light {
        border-color: rgba(0,0,0,0.06) !important;
      }
      &:not(.theme--light):active {
        background: darken(#414141, 1);
      }
      &.theme--light:active {
        background: darken(#dddddd, 15);
      }
      & > .v-input__control {
        height: inherit;
        & > .v-input__slot {
          height: inherit;
          margin-bottom: 0;
          &::before,
          &::after {
            border: none;
          }
          .v-select__slot {
            height: inherit;
            .v-input__append-inner {
              margin: 0;
              padding: 0;
              height: inherit;
              width: 100%;
              .v-input__icon {
                height: inherit;
                .v-icon {
                  height: inherit;
                  color: inherit !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
