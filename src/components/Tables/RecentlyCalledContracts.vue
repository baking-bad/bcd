<template>
  <v-fade-transition>
    <v-skeleton-loader :loading="isRecentlyCalledLoading" type="article" transition="fade-transition">
      <v-data-table :items="recentlyCalledContracts" :headers="recentlyCalledTableHeaders" class="ba-1 mt-4 avg-gas-consumption" hide-default-footer :items-per-page="itemsPerPage">
        <template v-slot:item="{item}">
          <tr class="table-row">
            <td>
              <v-btn
                class="text--secondary hash"
                :to="`${network}/${item.address}/`"
                style="text-transform: none;"
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
</template>

<script>
import {DATA_LOADING_STATUSES} from "../../utils/network";

export default {
  name: "RecentlyCalledContracts",
  props: {
    network: String,
    itemsPerPage: {
      type: Number,
      default: 3,
    }
  },
  computed: {
    isRecentlyCalledLoading() {
      return this.loadingRecentlyCalledContractsStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
  },
  created() {
    this.listenRecentlyCalledContracts();
  },
  destroyed() {
    this.stopListeningRecentlyCalledContracts();
  },
  methods: {
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
      this.api.getRecentlyCalledContracts(this.network, this.itemsPerPage)
        .then((data) => {
          this.recentlyCalledContracts = data;
          this.loadingRecentlyCalledContractsStatus = DATA_LOADING_STATUSES.SUCCESS;
        });
    },
  },
  watch: {
    network() {
      this.stopListeningRecentlyCalledContracts();
      this.listenRecentlyCalledContracts();
    },
  },
  data() {
    return {
      aliasMaxLength: 12,
      loadingRecentlyCalledContractsStatus: DATA_LOADING_STATUSES.NOTHING,
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
    }
  }
}
</script>

<style scoped>

</style>