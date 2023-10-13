<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row v-if="!loading">
      <v-col cols="12" v-if="tickets.length === 0">
        <EmptyState
          icon="mdi-code-brackets"
          title="Nothing found"
        />
      </v-col>
      <v-col cols="12" v-else>
        <v-expansion-panels multiple hover flat class="bb-1">
          <v-expansion-panel v-for="(ticket) in tickets"
                      :key="ticket.ticket_id"
                      class="bl-1 br-1 bt-1 ticket-panel" 
                      active-class="ticket-active-panel">
            <v-expansion-panel-header class="py-0 px-4" ripple :title=ticket.ticket_id>
              <template>
                <v-list-item class="fill-height pa-0">
                    <v-list-item-content>
                      <v-list-item-title>{{ ticket.ticket_id }}</v-list-item-title>
                      <!-- <v-list-item-subtitle class="font-weight-light hash text--secondary">
                        Token ID: {{ token.token_id }}
                      </v-list-item-subtitle> -->
                    </v-list-item-content>
                </v-list-item>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="ticket-content py-4">
              <v-card class="sticky-card" flat outlined width="95%">
                    <v-card-text class="data pa-0 pb-0">
                        <v-list class="py-0 bcd-table">
                            <!-- <v-list-item two-line :to="linkToTicketer" exact> -->
                            <v-list-item two-line>
                                <v-list-item-avatar>
                                    <v-icon class="text--secondary">mdi-ticket-confirmation</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>Ticketer</v-list-item-title>
                                    <v-list-item-subtitle class="hash">
                                        {{ ticket.ticketer }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-divider></v-divider>                    
                        <v-row no-gutters>
                            <v-col cols="6">
                                <TypeDef
                                    :typedef="ticket.content_type"
                                    first="ticket type"
                                    class="pt-6 px-6 pb-5"
                                    style="opacity: 0.8"
                                />
                            </v-col>
                            <v-divider cols="1" vertical></v-divider>
                            <v-col cols="5">
                                <MiguelTreeView 
                                    class="pt-6 pb-5"
                                    :address="address"
                                    :miguel="ticket.content" 
                                    :network="network" 
                                    openAll />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
              <!-- <v-list-item class="pl-0" v-if="token.link">
                <v-list-item-content>
                  <v-list-item-subtitle class="overline">Token metadata link</v-list-item-subtitle>
                  <v-list-item-title class="d-flex align-center">
                    <span>{{ token.link }}</span>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          v-on="on"
                          icon
                          class="mr-2"
                          @click="
                            () => {
                              $clipboard(token.link);
                              showClipboardOK();
                            }
                          "
                        >
                          <v-icon small class="text--secondary">mdi-content-copy</v-icon>
                        </v-btn>
                      </template>
                      Copy token link
                    </v-tooltip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-alert v-if="token.status === 2 && token.metadata === null" type="error" prominent text class="ma-0 align-center">
                <div class="overline">Resolving token metadata error {{ token.retry_count ? `(after ${token.retry_count} attempts)`: ''}}</div>
                <div class="text--primary">{{ token.error }}</div>
              </v-alert>
              <v-alert v-if="token.status === 1 && token.metadata === null" icon="mdi-progress-download" color="grey" prominent text class="ma-0 align-center">
                <span class="overline">We're trying to get your file. Please, wait...</span>
              </v-alert>
              <v-row v-if="token.metadata">
                <v-col :cols="token.metadata.thumbnailUri ? 10 : 12">
                  <vue-json-pretty                    
                    class="py-3"
                    :data="token.metadata"
                    :highlightMouseoverNode="true"
                    :customValueFormatter="formatValue"
                ></vue-json-pretty>
                </v-col>
                <v-col cols="2" v-if="token.metadata.thumbnailUri" class="d-flex flex-column align-center justify-start">
                  <div class="d-flex flex-column align-center justify-start">
                    <TokenImage v-if="token.metadata.thumbnailUri" :uri="token.metadata.thumbnailUri" :size="200"/>
                  </div>
                </v-col>
              </v-row> -->
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- <v-col :cols="showAsCard ? 4 : 3">
        <v-list-item-group v-model="selected" class="pt-0 pb-0 themed-border radius-1" mandatory>
          <template v-for="(update, idx) in updates">
            <v-list-item :key="idx">
              <v-list-item-content>
                <v-list-item-title>
                  <Shortcut :str="update.address"/>&nbsp;
                  <span class="text--secondary">with amount</span>&nbsp;
                  <span class="text--primary">{{ update.amount }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="text--secondary">{{ update.timestamp | fromNow }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="idx !== updates.length -1" :key="'d' + idx"></v-divider>
          </template>
        </v-list-item-group>
      </v-col>
      <v-col :cols="showAsCard ? 8 : 9">
        <v-card class="sticky-card" flat outlined width="95%" v-if="item">
          <v-card-text class="data pa-0 pb-0">
            <v-list class="py-0 bcd-table">
              <v-list-item two-line :to="linkToTicketer" exact>
                <v-list-item-avatar>
                  <v-icon class="text--secondary">mdi-ticket-confirmation</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Ticketer</v-list-item-title>
                  <v-list-item-subtitle class="hash">
                    {{ item.ticketer }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="justify-end">
                  <v-list-item-action-text class="caption">{{ item.timestamp | formatShortTime}}</v-list-item-action-text>
                  <v-list-item-action-text class="caption">Block {{ item.level }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-list-item two-line exact :to="`/${network}/${item.address}`">
                <v-list-item-avatar>
                  <v-icon class="text--secondary">mdi-wallet-outline</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Account</v-list-item-title>
                  <v-list-item-subtitle class="hash">
                    {{ item.address }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-avatar>
                  <v-icon class="text--secondary">mdi-circle-multiple-outline</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Amount</v-list-item-title>
                  <v-list-item-subtitle class="hash">
                    {{ item.amount }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line exact :to="`/${network}/opg/${item.operation_hash}`">
                <v-list-item-avatar>
                  <v-icon class="text--secondary">mdi-swap-horizontal</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Operation Hash</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.operation_hash }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>          
            <v-row no-gutters>
              <v-col cols="6">
                <TypeDef
                  :typedef="item.content_type"
                  first="ticket type"
                  class="pt-6 px-6 pb-5"
                  style="opacity: 0.8"
                />
              </v-col>
              <v-divider cols="1" vertical></v-divider>
              <v-col cols="5">
                <MiguelTreeView 
                  class="pt-6 pb-5"
                  :address="address"
                  :miguel="item.content" 
                  :network="network" 
                  openAll />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import EmptyState from "@/components/Cards/EmptyState.vue";
import MiguelTreeView from "@/components/MiguelTreeView.vue";
import TypeDef from "@/views/contract/TypeDef.vue";
// import Shortcut from "@/components/Shortcut.vue";

export default {
  name: "TicketTab",
  props: {
    network: String,
    address: String,
  },
  components: {
    EmptyState,
    MiguelTreeView,
    TypeDef,
    // Shortcut,
  },
  data: () => ({
    loading: false,
    tickets: [],
    updates: [],
    selected: 0,
  }),
  computed: {
    item() {
      if (!this.updates || this.updates.length === 0) return null;
      return this.updates[this.selected];
    },
    linkToTicketer() {
      if (this.address !== this.ticket.ticketer) {
        return `/${this.network}/${this.ticket.ticketer}`;
      } else {
        return null;
      }
    },
  }, 
  methods: {
    ...mapActions(["showError", "hideError", "showClipboardOK"]),
    async getTicketBalances(network, address) {
      if (this.loading) return;
      this.loading = true;

      this.api.getTickectBalances(network, address, this.tickets.length) //skip_empty=true
        .then(res => {
          this.tickets.push(...res);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {this.loading = false;})
    },

    async listTicketUpdates(network, address) {
      if (this.loading) return;
      this.loading = true;

      this.api.listTicketUpdates(network, address, this.updates.length, 10)
        .then(result => {
          this.updates.push(...result);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {this.loading = false;})
    },
    async getTickectUpdatesByOperation(network, operationId) {
      if (this.loading) return;
      this.loading = true;

      this.api.getTickectUpdatesByOperation(network, operationId)
        .then(result => {
          this.updates.push(...result);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {this.loading = false;})
    },
  },
  mounted () {
    this.getTicketBalances(this.network, this.address);
  },
  watch: {
    'address': function(newAddress){
      this.updates = [];
      this.loading = false;
      this.listTicketUpdates(this.network, newAddress);
    },
    'network': function(newNetwork){
      this.updates = [];
      this.loading = false;
      this.listTicketUpdates(newNetwork, this.address);
    }
  }
}
</script>

<style scoped>
  .sticky-card {
    position: sticky;
    top: 100px;
  }
  .ticket-content > .v-expansion-panel-content__wrap {
    padding: 0;
  }

  .ticket-panel {
    background-color: var(--v-data-base) !important;
  }

  .ticket-active-panel > .v-expansion-panel-header {
    opacity: 0.8;
    background-color: var(--v-border-base) !important;
  }

  .ticket-active-panel,
  .ticket-panel.v-expansion-panel--next-active {
    border-bottom: 1px solid var(--v-border-base);
  }
</style>