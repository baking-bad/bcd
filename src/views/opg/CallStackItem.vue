<template>
    <div class="d-flex align-center" :class="operation.internal ? 'mt-2' : 'mt-4'">
        <span v-if="operation.internal" class="mr-2" style="font-size: 14px">↳</span>
        <div>
            <span class="text--secondary" v-if="alias">{{ alias }}</span>
            <Shortcut v-else class="text--secondary" :str="operation.destination"/>
            <span v-if="operation.destination" class="text--secondary" style="font-size: 20px"> → </span>
            <span v-if="operation.tag" class="hash accent--text">event {{ operation.tag }}</span>
            <span v-else-if="operation.kind === 'transfer_ticket'" class="hash accent--text">{{ operation.kind }}:{{ operation.entrypoint ? operation.entrypoint : '' }}()</span>
            <span v-else-if="operation.entrypoint" class="hash secondary--text">{{ operation.entrypoint }}()</span>
            <span v-else>{{ operation.amount ? operation.amount : 0 | uxtz }}</span>
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
            alias: null
        }
    },
    async created() {
        this.alias = await this.fetchAlias();
    },
    methods: {
        async fetchAlias() {
            return await this.getAlias(this.network, this.operation.destination)
        }
    }
}
</script>
