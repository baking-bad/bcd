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
                <span v-if="alias" v-html="highlight(alias)" class="alias"></span>
                <span v-else class="hash">{{ item.body.Address }}</span>
            </router-link>
            </v-list-item-title>
            <v-list-item-subtitle v-if="alias">
                <span class="hash">{{item.body.Address}}</span>
            </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <Highlight class="mt-4" :highlights="item.highlights" />
    </v-card-text>
  </v-card>
</template>

<script>
import Highlight from "./Highlight.vue";
import sanitizeHtml from "sanitize-html";

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
        if (this.item.body.TzKT) return this.item.body.TzKT.Name;
        if (this.item.body.Profiles) return this.item.body.Profiles.Name;
        if (this.item.body.Domains) return this.item.Domains.body.Name;
        if (this.item.body.TZIP) return this.item.body.TZIP.Name;
        return undefined;
    }
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
  },
};
</script>