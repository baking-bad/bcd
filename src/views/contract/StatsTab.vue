<template>
    <v-row class="mx-5">
        <v-col cols="12" class="d-flex justify-end align-center">
            <span class="overline mr-3">points per</span>
            <v-btn-toggle v-model="timeframe" dense>
                <v-btn small value="day">Day</v-btn>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
            </v-btn-toggle>
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="data" min-height="420">
                <v-card-text class="pl-0 pt-0 mt-0">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="9" class="px-0">
                            <v-skeleton-loader :loading="!contractCalls" type="image">
                                <LineChart
                                    :data="contractCalls"
                                    name="Contract calls"
                                />
                            </v-skeleton-loader>
                        </v-col>
                        <v-col cols="3" class="pt-6">
                            <v-skeleton-loader :loading="!contractCalls" type="list-item,list-item-two-line,list-item-two-line,list-item-two-line">
                                <StatsInfo 
                                    title="Contract calls"
                                    :total="contractCallsTotal"
                                    :series="contractCalls"
                                />
                            </v-skeleton-loader>
                        </v-col>
                    </v-row>
               </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="data" min-height="420">
                <v-card-text class="pl-0 pt-0 mt-0">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="9" class="px-0">
                            <v-skeleton-loader :loading="!uniqueUsers" type="image">
                                <LineChart
                                    :data="uniqueUsers"
                                    name="Unique users"
                                />
                            </v-skeleton-loader>
                        </v-col>
                        <v-col cols="3" class="pt-6">
                            <v-skeleton-loader :loading="!uniqueUsers" type="list-item,list-item-two-line,list-item-two-line,list-item-two-line">
                                <StatsInfo 
                                    title="Unique users"
                                    :total="uniqueUsersTotal"
                                    :series="uniqueUsers"
                                />
                            </v-skeleton-loader>
                        </v-col>
                    </v-row>
               </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="data" min-height="420">
                <v-card-text class="pl-0 pt-0 mt-0">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="9" class="px-0">
                            <v-skeleton-loader :loading="!consumedGas" type="image">
                                <LineChart
                                    :data="consumedGas"
                                    name="Consumed gas"
                                />
                            </v-skeleton-loader>
                        </v-col>
                        <v-col cols="3" class="pt-6">
                            <v-skeleton-loader :loading="!consumedGas" type="list-item,list-item-two-line,list-item-two-line,list-item-two-line">
                                <StatsInfo 
                                    title="Consumed gas"
                                    :total="consumedGasTotal"
                                    :series="consumedGas"
                                />
                            </v-skeleton-loader>
                        </v-col>
                    </v-row>
               </v-card-text>
            </v-card>          
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="data" min-height="420">
                <v-card-text class="pl-0 pt-0 mt-0">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="9" class="px-0">
                            <v-skeleton-loader :loading="!burned" type="image">
                                <LineChart
                                    :data="burned"
                                    name="Burned"
                                    formatter="burned"
                                />
                            </v-skeleton-loader>
                        </v-col>
                        <v-col cols="3" class="pt-6">
                            <v-skeleton-loader :loading="!burned" type="list-item,list-item-two-line,list-item-two-line,list-item-two-line">
                                <StatsInfo 
                                    title="Burned"
                                    :total="burnedTotal"
                                    :series="burned"
                                    :isMutez="true"
                                />
                            </v-skeleton-loader>
                        </v-col>
                    </v-row>
               </v-card-text>
            </v-card>            
        </v-col>
    </v-row>
</template>

<script>
import LineChart from "@/components/Charts/LineChart.vue";
import StatsInfo from "@/views/contract/StatsInfo.vue";


export default {
    name: "ContractStatsTab",
    components: { LineChart, StatsInfo },
    props: {
        network: String,
        address: String
    },
    data:() => {
        return {
            timeframe: 'month',
            contractCalls: undefined,
            contractCallsTotal: undefined,
            uniqueUsers: undefined,
            uniqueUsersTotal: undefined,
            consumedGas: undefined,
            consumedGasTotal: undefined,
            burned: undefined,
            burnedTotal: undefined
        }
    },
    computed: {
        
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.getContractCallsTotal();
            this.getUniqueUsersTotal();
            this.getConsumedGasTotal();
            this.getBurnedTotal();
            this.getSeries();
        },
        getSeries() {
            this.getContractCalls();
            this.getUniqueUsers();
            this.getConsumedGas();
            this.getBurned();
        },
        createDataset(response) {
            let dataset = [];

            response.forEach(item => {
                dataset.push([item.ts * 1000, parseFloat(item.value)]);
            })

            return dataset;
        },
        async getContractCalls() {
            await this.stats.histogram(this.network, 'transactions', 'count', this.timeframe, {
                'Entrypoint.isnotnull': '',
                'Target': this.address
            })
            .then(res => {
                this.contractCalls = this.createDataset(res);                
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getContractCallsTotal() {
            await this.stats.summary(this.network, 'transactions', 'count', {
                'Entrypoint.isnotnull': '',
                'Target': this.address
            })
            .then(res => {
                this.contractCallsTotal = parseInt(res);                
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getUniqueUsers() {
            await this.stats.histogram(this.network, 'transactions', 'distinct', this.timeframe, {
                'field': 'Initiator',
                'Target': this.address
            })
            .then(res => {
                this.uniqueUsers = this.createDataset(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getUniqueUsersTotal() {
            await this.stats.summary(this.network, 'transactions', 'distinct', {
                'field': 'Initiator',
                'Target': this.address
            })
            .then(res => {
                this.uniqueUsersTotal = parseInt(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getConsumedGas() {
            await this.stats.consumedGas(this.network, this.timeframe, this.address)
            .then(res => {
                this.consumedGas = this.createDataset(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getConsumedGasTotal() {
            await this.stats.summary(this.network, 'transactions', 'sum', {
                'field': 'GasUsed',
                'Target': this.address
            })
            .then(res => {
                this.consumedGasTotal = parseInt(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getBurned() {
            await this.stats.burned(this.network,this.timeframe, this.address)
            .then(res => {
                this.burned = this.createDataset(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getBurnedTotal() {
            await this.stats.summary(this.network, 'transactions', 'sum', {
                'field': 'StorageFee',
                'Target': this.address
            })
            .then(res => {
                this.burnedTotal = parseInt(res);
            })
            .catch(err => {
                console.log(err);
            })
        }
    },
    watch: {
        'address': 'getSeries',
        'timeframe': 'getSeries'
    }
}
</script>