<template>
    <div class="d-flex align-center" :class="operation.internal ? 'mt-2' : 'mt-4'">
        <span v-if="operation.internal" class="mr-2" style="font-size: 14px">↳</span>
        <div>
            <span class="text--secondary" v-if="alias">{{ alias }}</span>
            <Shortcut v-else class="text--secondary" :str="operation.destination"/>
            <span class="hash accent--text" v-if="additionalAliasInfo">{{ additionalAliasInfo }}</span>
            <span v-if="operation.destination" class="text--secondary" style="font-size: 20px"> → </span>
            <span :class="itemClass">{{ itemValue }}</span>
        </div>
    </div>
</template>

<script>
import Shortcut from "@/components/Shortcut.vue";

export default {
    name: "CallStackItem",
    props: {
        network: String,
        operation: Object
    },
    components: {
        Shortcut
    },
    data: () => {
        return {
            alias: null,
            itemClass: '',
            itemValue: '',
        }
    },
    async created() {
        this.setClassAndValue();
        this.alias = await this.fetchAlias();
    },
    computed: {
        additionalAliasInfo() {
            if (this.operation.kind === 'origination') {
                return ' was originated';
            } else {
                return null;
            }
        },
    },
    methods: {
        async fetchAlias() {
            return await this.getAlias(this.network, this.operation.destination)
        },
        setClassAndValue() {
            if (this.operation.tag) {
                this.itemClass = 'hash accent--text';
                this.itemValue = 'event ' + this.operation.tag;
            } else if (this.operation.kind === 'transfer_ticket') {
                this.itemClass = 'hash accent--text';
                this.itemValue = this.operation.kind;
            } else if (this.operation.entrypoint) {
                this.itemClass = 'hash secondary--text';
                this.itemValue = this.operation.entrypoint + '()';
            } else {
                this.itemValue = this.$options.filters.uxtz(this.operation.amount ? this.operation.amount : 0);
            }
        },
    }
}
</script>
