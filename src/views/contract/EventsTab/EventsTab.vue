<template>
    <v-row class="px-8 pt-4">
        <v-col cols="3" class="pl-4">
            <v-list-item-group v-model="selected" class="pt-0 pb-0 themed-border radius-1">
                <template v-for="(event, idx) in events">
                    <v-list-item :key="idx">
                        <v-list-item-content>
                            <v-list-item-title>
                                <span class="accent--text">{{ event.tag }}</span>&nbsp;
                                <span class="text--secondary">occured at level</span>&nbsp;
                                <span class="text--primary">{{ event.level }}</span>
                            </v-list-item-title>
                            <v-list-item-subtitle class="text--secondary">{{ event.timestamp | fromNow }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider v-if="idx !== events.length -1" :key="'d' + idx"></v-divider>
                </template>
            </v-list-item-group>
        </v-col>
        <v-col cols="9" class="pr-4">
            <v-card class="sticky-card" flat outlined width="95%" v-if="item">
                <v-card-text class="data pa-0 pb-4">
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title class="headline accent--text">{{ item.tag }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.hash }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="justify-end">
                            <v-list-item-action-text class="caption">{{ item.timestamp | formatShortTime}}</v-list-item-action-text>
                            <v-list-item-action-text class="caption">Block {{ item.level }}</v-list-item-action-text>
                        </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>
                    
                    <MiguelTreeView :miguel="item.payload" :network="network" openAll class="mt-6"/>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import {mapActions} from "vuex";
import { getContentItemHeaderClass } from '@/utils/styles';
import MiguelTreeView from "@/components/MiguelTreeView.vue";

export default {
    name: "EventsTab",
    props: {
        network: String,
        address: String,
        contract: Object
    },
    components: {
        MiguelTreeView
    },
    computed: {
        item() {
            if (!this.events || this.events.length === 0) return null;
            return this.events[this.selected];
        }
    }, 
    data: () => ({
        events: [],
        loading: false,
        selected: 0
    }),
    methods: {
        ...mapActions(["showError"]),
        listEvents(network, address) {
            if (this.loading || this.events.length === this.contract.events_count) return;
            this.loading = true;

            this.api.listEvents(network, address, this.events.length, 10)
            .then(result => {
                this.events.push(...result);
            })
            .catch(err => {
                console.log(err);
                this.showError(err);
            })
            .finally(() => {this.loading = false;})
        },
        borderClass(status) {
            return getContentItemHeaderClass(status);
        }
    },
    mounted () {
        this.listEvents(this.network, this.address)
    },
    watch: {
        'address': function(newAddress){
            this.events = [];
            this.loading = false;
            this.listEvents(this.network, newAddress);
        },
        'network': function(newNetwork){
            this.events = [];
            this.loading = false;
            this.listEvents(newNetwork, this.address);
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