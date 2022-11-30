<template>
    <v-card flat class="data mt-3">
        <v-card-text class="pa-0 pt-1">
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title>
                        <span class="hash">Token</span>
                        <span class="text--secondary" style="font-size: 20px;"> → </span>
                        <router-link class="serp-link" target="_blank" :to="`/${item.body.Network}/${item.body.Address}/tokens?token_id=${item.body.TokenID}`">
                            <span v-if="item.body.Name" class="alias">{{ sanitize(item.body.Name) }}</span>
                        </router-link>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="hash" :class="item.body.Network === 'mainnet' ? 'secondary--text' : ''">{{ item.body.Network }}</span>
                        <span class="hash"> | {{ item.body.Address }}</span>
                        <span class="hash"> | ID {{ item.body.TokenID }}</span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <Highlight class="mt-4" :highlights="item.highlights"/>
        </v-card-text>
    </v-card>
</template>

<script>
import Highlight from './Highlight.vue'

export default {
    name: "Token",
    props: {
        item: Object,
        words: Array,
    },
    components: {
        Highlight
    },
    methods: {
        sanitize(text) {
            return this.$sanitize(text);
        }
    }
}
</script>

<style scoped>
.alias {
  font-size: 20px;
  line-height: .9rem;
}
</style>
