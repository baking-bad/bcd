<template>
    <v-card flat class="data mt-3">
        <v-card-text class="pa-0 pt-1">
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title>
                        <span class="hash">Operation</span>
                        <span class="text--secondary" style="font-size: 20px;"> → </span>
                        <template v-if="item.body.Destination.startsWith('KT')">
                            <router-link class="serp-link" target="_blank" :to="`/${item.body.Network}/${item.body.Destination}`">
                                <Shortcut :str="item.body.Destination"/>
                            </router-link>
                            <span class="text--secondary" style="font-size: 20px;"> → </span>
                        </template>
                        <router-link class="serp-link" target="_blank" :to="`/${item.body.Network}/opg/${item.body.Hash}`">
                            <span
                            v-if="item.body.Entrypoint"
                            class="hash"
                            >{{ item.body.Entrypoint + '()' }}</span>
                            <span v-else-if="item.body.Type === 'origination'">origination</span>
                            <Shortcut v-else-if="item.body.Destination.startsWith('KT')" :str="item.body.Hash"/>
                            <span v-else class="hash">{{ item.body.Hash }}</span>
                        </router-link>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="hash" :class="item.body.Network === 'mainnet' ? 'secondary--text' : ''">{{ item.body.Network }}</span>
                        <span class="hash"> | {{ item.body.Hash }}</span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <Highlight class="mt-4" :highlights="item.highlights"/>
        </v-card-text>
    </v-card>
</template>

<script>
import Highlight from './Highlight.vue';
import Shortcut from '@/components/Shortcut.vue';

export default {
    name: "Operation",
    props: {
        item: Object,
        words: Array,
    },
    components: {
        Highlight,
        Shortcut
    },
}
</script>