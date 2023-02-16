<template>
    <v-card flat tile :ripple="false" :class="`hoverable-card mt-3 ${active ? 'active-search-result' : ''}`" @click="onClick">
        <v-card-text class="pa-0 pt-1">
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title>
                        <router-link class="serp-link" target="_blank"
                            :to="`/${item.body.Network}/big_map/${item.body.BigMapID}`">
                            <span class="hash text--primary">Big_map {{ item.body.BigMapID }}</span>
                        </router-link>
                        <span class="text--secondary" style="font-size: 20px;"> → </span>
                        <router-link class="serp-link" target="_blank"
                            :to="`/${item.body.Network}/big_map/${item.body.BigMapID}/${item.body.KeyHash}`">
                            <span class="hash">{{ item.body.KeyHash }}</span>
                        </router-link>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="hash" :class="item.body.Network === 'mainnet' ? 'secondary--text' : ''">{{ item.body.Network }}</span>
                        <span class="hash" :class="item.body.IsActive ? 'secondary--text' : 'red'"> | {{ item.body.IsActive ? 'Active' : 'Removed' }}</span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <Highlight class="mt-1" :highlights="item.highlights"/>
        </v-card-text>
    </v-card>
</template>

<script>
import Highlight from './Highlight.vue';

export default {
    name: "BigMapKey",
    props: {
        item: Object,
        words: Array,
        active: Boolean
    },
    components: {
        Highlight
    },
    methods: {
        onClick(event) {
            this.$emit('click', event);
        }
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
.hoverable-card {
    background-color: var(--v-data-base) !important;
}
.hoverable-card:hover {
    cursor: pointer;
    background-color: var(--v-sidenav-base) !important;
}
.active-search-result {
    border-right: 5px solid var(--v-primary-base) !important;
    background-color: var(--v-sidenav-base) !important;
}
</style>
