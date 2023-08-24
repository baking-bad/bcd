<template>
    <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
        <v-row>
            <v-col :cols="cols[0]">
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
            <v-col :cols="cols[1]">
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
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from "vuex";
import MiguelTreeView from "@/components/MiguelTreeView.vue";
import TypeDef from "@/views/contract/TypeDef.vue";
import Shortcut from "@/components/Shortcut.vue";

export default {
    name: "TicketTab",
    props: {
        network: String,
        address: String,
        operationId: Number,
    },
    components: {
        MiguelTreeView,
        TypeDef,
        Shortcut
    },
    data: () => ({
        loading: false,
        updates: [],
        selected: 0,
        // Не знаю, делает ли кто-то так ебано, наверное есть способы получше..
        cols: [3, 9],
    }),
    computed: {
        item() {
            if (!this.updates || this.updates.length === 0) return null;
            return this.updates[this.selected];
        },
        linkToTicketer() {
            if (this.address !== this.item.ticketer) {
                return `/${this.network}/${this.item.ticketer}`;
            } else {
                return null;
            }
        },
    }, 
    methods: {
        ...mapActions(["showError", "hideError"]),
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
        if (this.address) {
            this.listTicketUpdates(this.network, this.address);
        } else if (this.operationId) {
            this.cols = [4, 8];
            this.getTickectUpdatesByOperation(this.network, this.operationId);
        }
    },
    // Не понял секцию ниже..
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
</style>