<template>
  <v-card flat class="data mt-3">
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

      <Highlight class="mt-4" :highlights="item.highlights" />
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
  },
  components: {
    Highlight,
  },
  computed: {
    alias() {
        let alias = getAccountAlias(this.item.body);
        if (alias) return alias;
        return undefined;
    }
  },
};
</script>