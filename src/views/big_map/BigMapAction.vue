<template>
    <v-list-item>
        <v-list-item-content>
            <v-list-item-title class="hash">
            <span class="mr-2">{{ item.action }}</span>
            <template v-if="item.action == 'copy'">
                <span
                    class="text--secondary font-weight-light"
                    v-if="item.destination_ptr"
                >to</span>
                <span
                class="text--secondary font-weight-light"
                v-else-if="item.source_ptr"
                >from</span>
            </template>
            </v-list-item-title>
            <v-list-item-subtitle>
            <span class="overline">{{ helpers.formatDatetime(item.timestamp) }}</span>
            </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
            <v-list-item-action-text v-if="item.action == 'copy'">
            <v-btn
                :to="`/${network}/big_map/${item.destination_ptr}`"
                class="text--primary"
                text
                small
                v-if="item.destination_ptr"
            >
                <v-icon small class="mr-1 text--secondary">mdi-link-variant</v-icon>
                Big Map {{ item.destination_ptr }}
            </v-btn>
            <v-btn
                :to="`/${network}/big_map/${item.source_ptr}`"
                class="text--primary"
                text
                small
                v-else-if="item.source_ptr"
            >
                <v-icon small class="mr-1 text--secondary">mdi-link-variant</v-icon>
                Big Map {{ item.source_ptr }}
            </v-btn>
            </v-list-item-action-text>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
export default {
    name: "BigMapAction",
    props: {
        item: Object
    }
}
</script>