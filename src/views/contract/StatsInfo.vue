<template>
    <div>
        <h3>{{ title }}</h3>
        <v-list class="transparent pl-0">
            <v-list-item class="pl-0" v-if="total">
                <v-list-item-content>
                    <v-list-item-title class="overline">
                        Total
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ totalValue }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="pl-0" v-if="candle">
                <v-list-item-content>
                    <v-list-item-title class="overline">
                        First / Last
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ candle.open.toLocaleString('en-US')}} / {{ candle.close.toLocaleString('en-US')}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item class="pl-0" v-if="candle">
                <v-list-item-content>
                    <v-list-item-title class="overline">
                        Min / Max
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ candle.low.toLocaleString('en-US')}} / {{ candle.high.toLocaleString('en-US')}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
export default {
    name: "StatsInfo",
    props: {
        title: String,
        series: Array,
        total: Number,
        isMutez: Boolean
    },
    computed: {
        candle() {
            if (!this.series && this.series.length === 0) return null;

            let candle = {
                open: this.series[this.series.length - 1][1],
                high: this.series[0][1],
                low: this.series[0][1],
                close: this.series[0][1]
            };
            this.series.forEach((item) => {
                if (item[1] > candle.high) {
                    candle.high = item[1];
                }
                if (item[1] < candle.low) {
                    candle.low = item[1];
                }
            })
            if (this.isMutez) {
                candle.high = this.$options.filters.mutez(candle.high);
                candle.low = this.$options.filters.mutez(candle.low);
                candle.open = this.$options.filters.mutez(candle.open);
                candle.close = this.$options.filters.mutez(candle.close);
            }
            return candle;
        },
        totalValue() {
            if (this.isMutez) {
                return this.$options.filters.mutez(this.total);
            }
            return this.total.toLocaleString('en-US');
        }
    }
}
</script>