<template>
    <v-list class="mt-5">
        <v-list-item style="height: 44px">
        <v-list-item-content two-line>
            <v-list-item-title class="headline">Call stack</v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        <div class="d-flex flex-column px-4 call-stack-content-wrapper" style="font-size: 15px">
            <template v-for="op in operations">
                <CallStackItem
                    :key="op.id"
                    :operation="op"
                    :network="network"
                />
                <CallStackItem v-for="intOp in op.internal_operations"
                    :key="intOp.id"
                    :operation="intOp"
                    :network="network"
                />
            </template>
        </div>
    </v-list>
</template>

<script>

import CallStackItem from '@/views/opg/CallStackItem.vue';

export default {
    name: "CallStack",
    props: {
        network: String,
        operations: Array,
    },
    components: {
        CallStackItem
    },
}
</script>
