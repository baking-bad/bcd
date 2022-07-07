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
            <v-card :elevation="0" class="transparent">
                <v-skeleton-loader :loading="!contractCalls" type="image" >
                    <LineChart
                        :data="contractCalls"
                        title="Contract calls"
                        name="Contract calls"
                    />
               </v-skeleton-loader>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="transparent">
                <v-skeleton-loader :loading="!uniqueUsers" type="image" height="600">
                    <LineChart
                        :data="uniqueUsers"
                        title="Unique users"
                        name="Unique users"
                    />
                </v-skeleton-loader>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="transparent">
                <v-skeleton-loader :loading="!consumedGas" type="image" height="600">
                    <LineChart
                        :data="consumedGas"
                        title="Consumed gas"
                        name="Consumed gas"
                    />
                </v-skeleton-loader>
            </v-card>            
        </v-col>
        <v-col cols="6">
            <v-card :elevation="0" class="transparent">
                <v-skeleton-loader :loading="!burned" type="image" height="600">
                    <LineChart
                        :data="burned"
                        formatter="burned"
                        title="Burned"
                        name="Burned"
                    />
                </v-skeleton-loader>
            </v-card>
            
        </v-col>
    </v-row>
</template>

<script>
import LineChart from "@/components/Charts/LineChart.vue";


export default {
    name: "ContractStatsTab",
    components: { LineChart  },
    props: {
        network: String,
        address: String
    },
    data:() => {
        return {
            timeframe: 'month',
            contractCalls: undefined,
            uniqueUsers: undefined,
            consumedGas: undefined,
            burned: undefined
        }
    },
    computed: {
        
    },
    created() {
        this.init();
    },
    methods: {
        init() {
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
        async getConsumedGas() {
            await this.stats.consumedGas(this.network, this.timeframe, this.address)
            .then(res => {
                this.consumedGas = this.createDataset(res);
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
        }
    },
    watch: {
        'address': 'init',
        'timeframe': 'init'
    }
}
</script>