<template>
  <div class="fill-height canvas">
    <v-list-item style="height: 74px;">
      <v-list-item-content two-line>
        <v-list-item-title class="headline">
          <span v-if="contract.alias">{{ contract.alias }}</span>
          <span v-else v-html="helpers.shortcut(address)"></span>
        </v-list-item-title>
        <v-list-item-subtitle>
          <span
          class="overline"
          :class="network === 'mainnet' ? 'secondary--text' : ''"
        >{{ network }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="standard">
        <v-list-item-action-text>
          <v-chip small class="caption">{{ standard }}</v-chip>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <div class="d-flex align-center px-4 sidebar" style="height: 48px;">
      <span class="caption font-weight-bold text-uppercase text--secondary">Actions</span>
      <v-spacer></v-spacer>
      <v-tooltip bottom v-if="isAuthorized">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2" @click="showWatchSettings = true">
            <v-icon class="text--secondary">mdi-eye-outline</v-icon>
          </v-btn>
        </template>
        Edit watch settings
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mr-2" 
            @click="() => {
              $clipboard(address); 
              showClipboardOK();
            }">
            <v-icon class="text--secondary">mdi-content-copy</v-icon>
          </v-btn>
        </template>
        Copy address
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon
            @click="() => {
              $clipboard(contractLink); 
              showClipboardOK();
            }">
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
            <span class="caption font-weight-bold text-uppercase text--secondary">Details</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="canvas">
            <v-list class="contract-list">
              <v-list-item v-if="contract.language !== 'michelson'">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">
                    Language
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon x-small v-on="on" class="text--secondary">mdi-help-circle</v-icon>
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
                  <v-list-item-subtitle class="overline">Was active</v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    {{ helpers.formatDatetime(contract.timestamp) }}
                    <span v-if="contract.last_action > contract.timestamp"> — {{ helpers.formatDatetime(contract.last_action) }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="contract.balance">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Locked amount</v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    <span>{{ contract.balance | uxtz }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="contract.total_withdrawn">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Total withdrawn</v-list-item-subtitle>
                  <v-list-item-title class="body-2">
                    <span>{{ contract.total_withdrawn | uxtz }}</span>
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

        <v-expansion-panel class="ma-0 bb-1" v-if="sameCount > 0">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">
              Same contracts ({{ sameCount }})
            </span>            
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data">
            <v-list class="contract-list">
              <template v-for="(contract, i) in same">
                <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
                <SimilarItem :key="i" :item="contract" :address="address" :network="network" />
              </template>
              <v-divider></v-divider>
              <v-list-item v-if="same.length < sameCount">
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center justify-center">
                    <v-btn :loading="sameLoading" depressed small @click="requestMoreSame">Load more</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="ma-0 bb-1" v-if="similarCount > 0">
          <v-expansion-panel-header color="sidebar" class="pl-4 py-0">
            <span class="caption font-weight-bold text-uppercase text--secondary">
              Similar contracts ({{ similarCount }})
            </span>            
          </v-expansion-panel-header>
          <v-expansion-panel-content color="data">
            <v-list class="contract-list">
              <template v-for="(contract, i) in similar">
                <v-divider v-if="i > 0" :key="'divider' + i"></v-divider>
                <SimilarItem :key="i" :diff="true" :item="contract" :address="address" :network="network" />
              </template>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>

    <v-footer
      color="transparent"
      absolute
      bottom
      class="d-flex justify-center ml-6"
      style="z-index: 0"
    >
      <v-btn x-small text href="https://baking-bad.org/docs" target="_blank" color="border">
        <span>Baking Bad</span>
      </v-btn>
    </v-footer>

    <!-- <WatchSettings
      v-if="contract"
      :show.sync="showWatchSettings"
      :network="contract.network"
      :address="contract.address"
      :alias="contract.alias"
    /> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SimilarItem from "@/views/contract/SimilarItem.vue"
import AccountBox from "@/components/AccountBox.vue"
// import WatchSettings from "@/components/WatchSettings.vue"

export default {
  name: "SideBar",
  props: {
    loading: Boolean,
    contract: Object,
    address: String,
    network: String,
  },
  components: {
    SimilarItem,
    AccountBox,
    // WatchSettings
  },
  data: () => ({
    same: [],
    sameCount: 0,
    similar: [],
    similarCount: 0,
    sameLoading: false,
    showWatchSettings: false
  }),
  created() {
    this.requestSameSimilar()
  },
  computed: {
    standard() {
      const standards = {'fa12': 'FA1.2', 'fa1': 'FA1'};
      if (this.contract.tags) {
        for (var tag in standards) {
          if (this.contract.tags.includes(tag)) {
            return standards[tag];
          }
        }
      }
      return null;
    },
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    profile() {
      return this.$store.state.profile;
    },
    contractLink() {
      let routeData = {};
      if (this.contract.slug) {
        routeData = this.$router.resolve({
          name: "slug",
          params: { slug: this.contract.slug }
        });
      } else {
        routeData = this.$router.resolve({
          name: "contract",
          params: {
            address: this.address,
            network: this.network
          }
        });
      }
      return `${window.location.protocol}//${window.location.host}${routeData.href}`;
    },
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    requestSameSimilar() {
      this.same = [];
      this.sameCount = 0;
      this.api.getSameContracts(this.network, this.address, 0)
        .then(res => {
          if (!res) return;
          this.same = res.contracts;
          this.sameCount = res.count;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })

      this.similar = [];
      this.similarCount = 0;
      this.api.getSimilarContracts(this.network, this.address)
        .then(res => {
          if (!res) return;
          this.similar = res;
          this.similarCount = res.length;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
    },
    requestMoreSame() {
      this.sameLoading = true;
      this.api.getSameContracts(
        this.network,
        this.address,
        this.same.length
      )
        .then(res => {
          if (!res) return;
          this.same.push(...res.contracts);
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.sameLoading = false));
    }
  },
  watch: {
    address: 'requestSameSimilar'
  }
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
  max-height: calc(100vh - 75px - 4 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
