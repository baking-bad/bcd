<template>
  <div class="fill-height canvas">
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
      <v-list-item-action v-if="contractTags">
        <v-list-item-action-text>
          <v-chip
            small
            class="caption"
            :to="`/search?text=${contractTags.tag}`"
            target="_blank"
            >{{ contractTags.text }}</v-chip
          >
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <div class="d-flex align-center px-4 sidebar" style="height: 48px">
      <span class="caption font-weight-bold text-uppercase text--secondary"
        >Actions</span
      >
    </div>
    <div class="d-flex align-center justify-start pa-2 px-4">
      <v-tooltip bottom v-if="isAuthorized && contract && !contract.verified">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2" @click="onVerifyClick">
            <v-icon class="text--secondary">mdi-shield-check-outline</v-icon>
          </v-btn>
        </template>
        Verify contract
      </v-tooltip>
      <v-tooltip bottom v-if="isAuthorized && contract">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2" @click="showWatchSettings = true">
            <v-icon v-if="contract.subscription" class="text--primary"
              >mdi-eye-settings-outline</v-icon
            >
            <v-icon v-else class="text--secondary">mdi-eye-outline</v-icon>
          </v-btn>
        </template>
        <span v-if="contract.subscription">Edit watch settings</span>
        <span v-else>Watch contract</span>
      </v-tooltip>
      <v-tooltip bottom v-if="isContract">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2" @click="onForkClick">
            <v-icon class="text--secondary">mdi-source-fork</v-icon>
          </v-btn>
        </template>
        Fork contract
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            class="mr-2"
            @click="
              () => {
                $clipboard(address);
                showClipboardOK();
              }
            "
          >
            <v-icon class="text--secondary">mdi-content-copy</v-icon>
          </v-btn>
        </template>
        Copy address
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            @click="
              () => {
                $clipboard(contractLink);
                showClipboardOK();
              }
            "
          >
            <v-icon class="text--secondary">mdi-share-variant</v-icon>
          </v-btn>
        </template>
        Share link
      </v-tooltip>
    </div>
    <v-divider></v-divider>

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <v-expansion-panels flat tile mandatory active-class="opened-panel">
        <v-expansion-panel class="ma-0 bb-1">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span
              class="caption font-weight-bold text-uppercase text--secondary"
              >Details</span
            >
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="contract-list">
              <v-list-item
                v-if="contract.language && contract.language !== 'unknown'"
              >
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">
                    Language
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon x-small v-on="on" class="text--secondary"
                          >mdi-help-circle</v-icon
                        >
                      </template>
                      Guessed by heuristics
                    </v-tooltip>
                  </v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    <span class="text-capitalize">{{ contract.language }}</span>
                  </v-list-item-title>
                </v-list-item-content>
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
              <v-list-item v-if="contract.balance">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline"
                    >Balance</v-list-item-subtitle
                  >
                  <v-list-item-title class="body-2">
                    <span>{{ contract.balance | uxtz }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="domain">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline"
                    >Domain</v-list-item-subtitle
                  >
                  <v-list-item-title class="body-2">
                    <span>{{ domain }}</span>
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
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1" v-if="isContract && sameCount > 0">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span
              class="caption font-weight-bold text-uppercase text--secondary"
              >Same contracts ({{ sameCount }})</span
            >
          </v-expansion-panel-header>
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
              <v-list-item v-if="same.length < sameCount">
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center justify-center">
                    <v-btn
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

        <v-expansion-panel
          class="ma-0 bb-1"
          v-if="isContract && similarCount > 0"
        >
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span
              class="caption font-weight-bold text-uppercase text--secondary"
              >Similar contracts ({{ similarCount }})</span
            >
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data">
            <v-list class="contract-list">
              <template v-for="(contract, i) in similar">
                <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
                <SimilarItem
                  :key="i"
                  :diff="true"
                  :item="contract"
                  :address="address"
                  :network="network"
                />
              </template>
              <v-divider></v-divider>
              <v-list-item v-if="similar.length < similarCount">
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center justify-center">
                    <v-btn
                      class="text--secondary"
                      :loading="similarLoading"
                      text
                      small
                      @click="requestMoreSimilar"
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
      </v-expansion-panels>
    </v-skeleton-loader>

    <BakingBadFooter />

    <WatchSettings
      v-if="contract"
      :show.sync="showWatchSettings"
      :data="contract.subscription"
      :contract="contract"
      :onUpdate="
        (s) => {
          if (contract.subscription === null) contract.total_subscribed++;
          contract.subscription = s;
        }
      "
      :onRemove="
        (s) => {
          if (contract.subscription !== null) contract.total_subscribed--;
          contract.subscription = null;
        }
      "
    />

    <VerifyDialog
      v-model="showVerifyDialog"
      :address="address"
      :network="network"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SimilarItem from "@/views/contract/SimilarItem.vue";
import LogItem from "@/views/contract/LogItem.vue";
import AccountBox from "@/components/Dialogs/AccountBox.vue";
import BakingBadFooter from "@/components/BakingBadFooter.vue";
import WatchSettings from "@/components/Dialogs/WatchSettings.vue";
import VerifyDialog from "@/components/Dialogs/VerifyDialog.vue";

export default {
  name: "SideBar",
  props: {
    loading: Boolean,
    alias: String,
    contract: Object,
    contractTags: Object,
    contractLink: String,
    address: String,
    network: String,
    migrations: Array,
  },
  components: {
    SimilarItem,
    LogItem,
    AccountBox,
    BakingBadFooter,
    WatchSettings,
    VerifyDialog,
  },
  data: () => ({
    same: [],
    sameCount: 0,
    similar: [],
    similarCount: 0,
    similarLoading: false,
    sameLoading: false,
    showWatchSettings: false,
    showVerifyDialog: false,
    domain: undefined,
  }),
  created() {
    if (this.isContract) {
      this.requestSameSimilar();
    }
    this.resolveDomain();
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    },
    isContract() {
      return this.address.startsWith("KT");
    },
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    requestSameSimilar() {
      if (!this.isContract) return;
      this.same = [];
      this.sameCount = 0;
      this.api
        .getSameContracts(this.network, this.address, 0)
        .then((res) => {
          if (!res) return;
          this.same = res.contracts;
          this.sameCount = res.count;
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        });

      this.similar = [];
      this.similarCount = 0;
      this.api
        .getSimilarContracts(this.network, this.address, 0)
        .then((res) => {
          if (!res) return;
          this.similar = res.contracts;
          this.similarCount = res.count;
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
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
    requestMoreSimilar() {
      this.similarLoading = true;
      this.api
        .getSimilarContracts(this.network, this.address, this.similar.length)
        .then((res) => {
          if (!res) return;
          this.similar.push(...res.contracts);
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.similarLoading = false));
    },
    onForkClick() {
      this.$emit("fork", {
        address: this.address,
        network: this.network,
      });
    },
    onVerifyClick() {
      this.showVerifyDialog = !this.showVerifyDialog;
    },
    resolveDomain() {
      this.api.resolveDomain(this.network, this.address).then((res) => {
        if (!res && res.name && res.name !== "") return;
        this.domain = res.name;
      });
    },
  },
  watch: {
    address: "requestSameSimilar",
  },
};
</script>

<style scss>
.opened-panel {
  border-bottom: none !important;
}
.opened-panel > .v-expansion-panel-content > .v-expansion-panel-content__wrap {
  padding: 0;
}
.opened-panel > .v-expansion-panel-header {
  min-height: 48px;
}
.contract-list {
  max-height: calc(100vh - 75px - 5 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
