<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-list class="contract-list">
      <v-list-item style="height: 74px">
        <v-list-item-content two-line>
          <v-list-item-title class="headline">
            <v-tooltip bottom v-if="alias" :disabled="alias.length < 15">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ alias }}</span>
              </template>
              <span>{{ alias }}</span>
            </v-tooltip>
            <span v-else v-html="helpers.shortcut(address)"></span>&nbsp;
            <v-btn
              icon
              target="_blank"
              :href="contract.verification_source"
              v-if="contract && contract.verified"
            >
              <v-icon small color="primary">mdi-shield-check</v-icon>
            </v-btn>
          </v-list-item-title>
          <v-list-item-subtitle>
          <span
            class="overline"
            :class="network === 'mainnet' ? 'secondary--text' : ''"
          >{{ network }}</span
          >
          </v-list-item-subtitle>
        </v-list-item-content>
        <Tags
          :contract="contract"
        />
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="overline"
          >Was active</v-list-item-subtitle
          >
          <v-list-item-title class="body-2" v-if="isContract">
            {{ helpers.formatDatetime(contract.timestamp) }}
            <span v-if="contract.last_action > contract.timestamp"
            >—
                      {{ helpers.formatDatetime(contract.last_action) }}</span
            >
          </v-list-item-title>
          <v-list-item-title class="body-2" v-else>
            {{ helpers.formatDatetime(contract.last_action) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="overline"
          >Balance</v-list-item-subtitle
          >
          <v-list-item-title class="body-2">
            <span>{{ balance | uxtz }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <AccountBox
        v-if="contract.manager"
        title="Deployed by"
        :address="contract.manager"
        :network="contract.network"
        gutters
      />
      <AccountBox
        v-if="contract.delegate"
        title="Delegated to"
        :address="contract.delegate"
        :network="contract.network"
        :alias="contract.delegate_alias"
        gutters
      />
    </v-list>

    <v-expansion-panel
        v-if="isContract && contract.same_count > 0"
        class="ma-0 mt-2"
        @click="requestSame"
      >
        <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
              <span
                class="caption font-weight-bold text-uppercase text--secondary"
              >Same contracts ({{ contract.same_count }})</span
              >
        </v-expansion-panel-header>
        <v-skeleton-loader
          v-if="isSameInitialLoading"
          type="image"
          :loading="isSameInitialLoading"
        >
        </v-skeleton-loader>
        <v-expansion-panel-content color="data">
          <v-list class="contract-list">
            <template v-for="(contract, i) in same">
              <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
              <SimilarItem
                :key="i"
                :item="contract"
                :address="address"
                :network="network"
              />
            </template>
            <v-divider></v-divider>
            <v-list-item v-if="same.length < same_count">
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center justify-center">
                  <v-btn
                    v-if="!isSameInitialLoading"
                    class="text--secondary"
                    :loading="sameLoading"
                    text
                    small
                    @click="requestMoreSame"
                  >Load more</v-btn
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>

    <v-expansion-panel class="ma-0 bb-1" v-if="migrations.length > 0">
        <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span
              class="caption font-weight-bold text-uppercase text--secondary"
            >Logs ({{ migrations.length }})</span
            >
        </v-expansion-panel-header>
        <v-expansion-panel-content color="data">
          <v-list class="contract-list">
            <template v-for="(log, i) in migrations">
              <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
              <LogItem
                :key="i"
                :log="log"
                :network="network"
                :address="address"
              />
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import LogItem from "@/views/contract/LogItem.vue";
import {DATA_LOADING_STATUSES} from "../../../utils/network";
import SimilarItem from "../SimilarItem";
import Tags from "../../../components/Tags";
import AccountBox from "../../../components/Dialogs/AccountBox";

export default {
  name: "InformationTab",
  props: {
    network: String,
    address: String,
    contract: Object,
    balance: Number,
  },
  components: {
    AccountBox,
    Tags,
    SimilarItem,
    LogItem,
  },
  computed: {
    isContract() {
      return this.address.startsWith("KT");
    },
    isSameInitialLoading() {
      return this.sameInitialLoadingStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
    alias() {
      if (this.contract) {
        if (this.contract.alias) {
          return this.contract.alias;
        } else if (this.metadata && this.metadata.name) {
          return this.metadata.name;
        }
      }
      return null;
    },
  },
  created() {
    if (this.isContract) {
      this.getMigrations();
    }
  },
  methods: {
    ...mapActions(["showError"]),
    getMigrations() {
      this.migrationsLoading = true;
      this.api
        .getContractMigrations(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.migrations = res;
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => (this.migrationsLoading = false));
    },
    requestSame() {
      if (!this.isContract
        || this.sameInitialLoadingStatus !== DATA_LOADING_STATUSES.NOTHING
      ) return;

      this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.PROGRESS;
      this.same = [];
      this.sameCount = 0;
      this.api
        .getSameContracts(this.network, this.address, 0)
        .then((res) => {
          if (!res) return;
          this.same = res.contracts;
          this.sameCount = res.count;
          this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.SUCCESS;
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
          this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.ERROR;
        });
    },
    requestMoreSame() {
      this.sameLoading = true;
      this.api
        .getSameContracts(this.network, this.address, this.same.length)
        .then((res) => {
          if (!res) return;
          this.same.push(...res.contracts);
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.sameLoading = false));
    },
  },
  data() {
    return {
      // contract: null,
      migrationsLoading: false,
      migrations: [],
      same: [],
      same_count: 0,
      sameLoading: false,
      sameInitialLoadingStatus: DATA_LOADING_STATUSES.NOTHING,
    }
  }
}
</script>