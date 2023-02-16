<template>
  <v-card flat tile :ripple="false" :class="`hoverable-card mt-3 ${active ? 'active-search-result' : ''}`" @click="onClick">
    <v-card-text class="pa-0">
      <v-list-item two-line>
        <v-list-item-content>
            <v-list-item-title>
            <span class="hash" v-if="item.body.IsContract">Contract</span>
            <span class="hash" v-else>Account</span>
            <span class="text--secondary" style="font-size: 20px"> → </span>
            <router-link
                class="serp-link"
                target="_blank"
                :to="`/${item.body.Network}/${item.body.Address}`"
            >
                <span v-if="alias" class="alias">{{ alias }}</span>
                <span v-else class="hash">{{ item.body.Address }}</span>
            </router-link>
            </v-list-item-title>
            <v-list-item-subtitle>
                <span class="hash" :class="item.body.Network === 'mainnet' ? 'secondary--text' : ''">{{ item.body.Network }}</span>
                <span class="hash" v-if="alias"> | {{item.body.Address}}</span>
            </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <Highlight class="mt-1" :highlights="item.highlights" />
    </v-card-text>
  </v-card>
</template>

<script>
import Highlight from "./Highlight.vue";
import { getAccountAlias } from '@/api/search.js';

export default {
  name: "Account",
  props: {
    item: Object,
    words: Array,
    active: Boolean
  },
  components: {
    Highlight,
  },
  computed: {
    alias() {
        let alias = getAccountAlias(this.item.body);
        if (alias) return this.$sanitize(alias);
        return undefined;
    }
  },
  methods: {
    onClick(event) {
        this.$emit('click', event);
    }
  }
};
</script>
