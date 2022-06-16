<template>
    <v-card flat class="data mt-3">
        <v-card-text class="pa-0 pt-1">
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title>
                        <router-link class="serp-link" target="_blank"
                            :to="`/${item.body.network}/big_map/${item.body.BigMapID}`">
                            <span class="hash text--primary">Big_map {{ item.body.BigMapID }}</span>
                        </router-link>
                        <span class="text--secondary" style="font-size: 20px;"> → </span>
                        <router-link class="serp-link" target="_blank"
                            :to="`/${item.body.network}/big_map/${item.body.BigMapID}/${item.body.KeyHash}`">
                            <span class="hash" v-html="highlight(item.body.KeyHash)"></span>
                        </router-link>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="hash" :class="item.body.Network === 'mainnet' ? 'secondary--text' : ''">{{ item.body.Network }}</span>
                        <span class="hash" :class="item.body.IsActive ? 'secondary--text' : 'red'"> | {{ item.body.IsActive ? 'Active' : 'Removed' }}</span>
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
    name: "BigMapKey",
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

<style>
.serp-link {
  text-decoration: none;
}
.serp-link:hover {
  color: var(--v-secondary-base);
}
.serp-link:visited {
  color: var(--v-accent-base);
}
</style>
