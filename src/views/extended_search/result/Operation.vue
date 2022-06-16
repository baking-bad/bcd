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
                            <span v-html="helpers.shortcut(item.body.Destination)" class="text--secondary"></span>
                            </router-link>
                            <span class="text--secondary" style="font-size: 20px;"> → </span>
                        </template>
                        <router-link class="serp-link" target="_blank" :to="`/${item.body.Network}/opg/${item.body.Hash}`">
                            <span
                            v-if="item.body.Entrypoint"
                            class="hash"
                            v-html="highlight(item.body.Entrypoint + '()')"
                            ></span>
                            <span v-else-if="item.body.Type === 'origination'">origination</span>
                            <span v-else-if="item.body.Destination.startsWith('KT')" v-html="helpers.shortcut(item.body.Hash)"></span>
                            <span v-else v-html="highlight(item.body.Hash)" class="hash"></span>
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
import sanitizeHtml from 'sanitize-html';

export default {
    name: "Operation",
    props: {
        item: Object,
        words: Array,
    },
    components: {
        Highlight
    },
    methods: {
        highlight(s) {
            if (this.words === undefined) return s;
            for (var i = 0; i < this.words.length; i++) {
                let re = new RegExp(`(${this.words[i]})`, "gmi");
                s = sanitizeHtml(s.replace(re, "<span class='highlight'>$1</span>"));
            }
            return s;
        },
    }
}
</script>