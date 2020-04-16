<template>
  <div class="bigmapdiff">
    <v-hover v-slot:default="{ hover }">
      <v-card class="my-3 transparent" :elevation="hover ? 2 : 0" @click="onSearch(item)">
        <v-list-item three-line selectable>
          <v-list-item-content>
            <v-list-item-title>
              <span v-html="highlight(item.body.key)"></span>
            </v-list-item-title>
            <v-list-item-title class="key_hash grey--text text--darken-2">
              <span v-html="highlight(item.value)"></span>
            </v-list-item-title>
            <v-list-item-subtitle>
              <span
                class="overline"
                :class="item.body.network === 'mainnet' ? 'primary--text' : ''"
              >{{ item.body.network }}</span>
            </v-list-item-subtitle>

            <div class="d-flex flex-horizontal mt-1">              
              <v-chip
                v-if="item.body.ptr > 0"
                key="ptr"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >
                <span>big map {{ item.body.ptr }}</span>
              </v-chip>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text class="overline mt-1">{{ formatDate(item.body.timestamp) }}</v-list-item-action-text>
            <v-list-item-action-text v-if="item.group" class="caption">
              <span>{{ plural(item.group.count, 'update') }}</span>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>

        <div class="d-flex flex-wrap flex-row mx-6">
          <div v-for="(values, key) in item.highlights" :key="key">
            <div
              class="d-flex flex-column mr-6 pt-2 pb-4"
              v-if="!['key_strings'].includes(key)"
            >
              <span class="overline">{{ key }}</span>
              <span v-for="(value, i) in values" :key="key + i">
                <span v-html="highlight(value)" class="caption"></span>
              </span>
            </div>
          </div>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { plural } from "@/utils/plural.js";

export default {
  name: "BigMapDiffItem",
  props: {
    item: Object,
    words: Array
  },
  data: () => ({
    limit: 5
  }),
  methods: {
    onSearch(item) {
      let routeData = this.$router.resolve({
        path: `/bigmap/${item.body.network}/${item.body.address}/${item.body.ptr}/${item.body.key_hash}`
      });
      console.log(routeData.href);
      window.open(routeData.href, "_blank");
    },
    formatDate(value) {
      if (value) {
        return dayjs(value).format("MMM D, YYYY");
      }
    },
    plural(count, word) {
      return plural(count, word);
    },
    highlight(s) {
      if (this.words === undefined) return s;
      for (var i = 0; i < this.words.length; i++) {
        let re = new RegExp(`(${this.words[i]})`, "gmi");
        s = s.replace(re, "<mark>$1</mark>");
      }
      return s;
    }
  }
};
</script>


<style lang="scss" scoped>
.bigmapdiff {
  max-width: 700px;
}
.bigmapdiff:hover {
  cursor: pointer;
}
.key_hash {
  font-family: "Roboto Mono", monospace;
  font-size: 0.9rem;
}
</style>