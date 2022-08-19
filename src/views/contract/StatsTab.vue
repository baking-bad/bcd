<template>
    <v-row class="mx-5">
        <v-col cols="12" class="d-flex justify-end align-center">
            <span class="overline mr-3">points per</span>
            <v-btn-toggle v-model="timeframe" dense mandatory>
                <v-btn small value="day">Day</v-btn>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
            </v-btn-toggle>
        </v-col>
        <v-col cols="4">
            <v-list-item-group
                class="themed-border radius-1"
                active-class="token-card-selected"
                :value="selected"
                mandatory
            >
                <v-list-item @click="selected = i" class="token-card" v-for="(item, i) in items" :key="'stats-' + i">
                    <v-list-item-content>
                        <v-list-item-title class="overline">
                            <span>{{ item.name }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle class="caption">
                            <span>{{ item.description }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-list-item-action-text class="body-2 secondary--text">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">{{ item.value | numberToCompactSIFormat }}</span>
                                </template>
                                <span>Total {{ item.name.toLowerCase() }}</span>
                            </v-tooltip>
                        </v-list-item-action-text>
                    </v-list-item-action>
                </v-list-item>
            </v-list-item-group>
        </v-col>
        <v-col cols="8">
            <v-card outlined style="background-color:transparent;" min-height="424">
                <v-card-text class="pa-3 ma-0">
                    <v-skeleton-loader :loading="!this.selectedItem.series" type="image@2" min-height="400">
                        <LineChart
                            :data="this.selectedItem.series"
                            :name="this.selectedItem.name"
                            :formatType="this.selectedItem.formatter"
                            exporting
                        />
                    </v-skeleton-loader>
            </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import LineChart from "@/components/Charts/LineChart.vue";


export default {
    name: "ContractStatsTab",
    components: { LineChart },
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
            burnedTotal: undefined,
            selected: 0
        }
    },
    computed: {
        items() {
            return [{
                name: 'Contract calls',
                description: 'number of transactions in which the target is the contract',
                value: this.contractCallsTotal,
                series: this.contractCalls,
                seriesGetter: this.getContractCalls,
                type: 'calls'
            },{
                name: 'Unique users',
                description: 'number of unique addresses calling the contract',
                value: this.uniqueUsersTotal,
                series: this.uniqueUsers,
                seriesGetter: this.getUniqueUsers,
                type: 'users'
            },{
                name: 'Consumed gas',
                description: 'total amount of gas consumed by the contract',
                value: this.consumedGasTotal,
                series: this.consumedGas,
                seriesGetter: this.getConsumedGas,
                type: 'gas',
                formatter: 'utz'
            },{
                name: 'Burned',
                description: 'total amount of burned tezos by the contract',
                value: this.burnedTotal,
                series: this.burned,
                seriesGetter: this.getBurned,
                type: 'burned',
                formatter: 'utz'
            }]
        },
        selectedItem() {
            if (this.selected < 0 || this.selected >= this.items.length) return undefined;
            return this.items[this.selected];
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.clear();
            this.getContractCallsTotal();
            this.getUniqueUsersTotal();
            this.getConsumedGasTotal();
            this.getBurnedTotal();
            this.updateSeries();
        },
        clear() {
            this.contractCalls = undefined;
            this.uniqueUsers = undefined;
            this.consumedGas = undefined;
            this.burned = undefined;
            this.contractCallsTotal = 0;
            this.uniqueUsersTotal = 0;
            this.consumedGasTotal = 0;
            this.burnedTotal = 0;
        },
        async updateSeries() {
            if (!this.selectedItem) return;
            if (this.selectedItem.series !== undefined || this.selectedItem.seriesGetter === undefined) return;

            this.selectedItem.series = await this.selectedItem.seriesGetter();
        },
        createDataset(response, isAbs = false) {
            let dataset = [];

            response.forEach(item => {
                let value = parseFloat(item.value);
                if (isAbs) value = Math.abs(value);
                dataset.push([item.ts * 1000, value]);
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
                'field': 'Sender',
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
                'field': 'Sender',
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
             await this.stats.histogram(this.network, 'consumed_gas', 'sum', this.timeframe, {
                'field': 'Used',
                'Target': this.address
            })
            .then(res => {
                this.consumedGas = this.createDataset(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getConsumedGasTotal() {
            await this.stats.summary(this.network, 'consumed_gas', 'sum', {
                'field': 'Used',
                'Target': this.address
            })
            .then(res => {
                this.consumedGasTotal = parseInt(res) / 10**6;
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getBurned() {
            await this.stats.histogram(this.network, 'balance_update', 'sum', this.timeframe, {
                'field': 'Update',
                'Kind': 2,
                'Counterparty': this.address,
            })
            .then(res => {
                this.burned = this.createDataset(res, true) ;
            })
            .catch(err => {
                console.log(err);
            })
        },
        async getBurnedTotal() {
            await this.stats.summary(this.network, 'balance_update', 'sum', {
                'field': 'Update',
                "Kind": 2,
                "Counterparty": this.address
            })
            .then(res => {
                this.burnedTotal = Math.abs(parseInt(res) / 10 ** 6) ;
            })
            .catch(err => {
                console.log(err);
            })
        },
    },
    watch: {
        'address': 'init',
        'timeframe': 'init',
        'selected': 'updateSeries'
    }
}
</script>