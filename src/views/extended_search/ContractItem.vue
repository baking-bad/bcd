<template>
  <div class="contract">
    <v-hover v-slot:default="{ hover }">
      <v-card
        class="my-3 transparent card"
        :elevation="hover ? 2 : 0"
        target="_blank"
        :to="{ path: `/${item.body.network}/${item.value}` }"
      >
        <v-list-item three-line selectable>
          <v-list-item-content>
            <v-list-item-title class="header" v-if="item.body.alias">
              <span v-html="highlight(item.body.alias)"></span>
            </v-list-item-title>
            <v-list-item-title
              class="hash header"
              :class="item.body.alias ? 'body-2 grey--text text--darken-2' : ''"
            >
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
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >
                <span>contract</span>
              </v-chip>
              <v-chip
                key="language"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >
                <span v-html="highlight(item.body.language)"></span>
              </v-chip>
              <v-chip
                v-for="tag in item.body.tags"
                :key="tag"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >
                <span v-html="highlight(tag)"></span>
              </v-chip>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text class="caption">
              <span>{{ plural(item.body.tx_count || 1, 'operation') }}</span>
            </v-list-item-action-text>
            <v-list-item-action-text v-if="item.group" class="caption">
              <span>{{ plural(item.group.count - 1, 'same contract') }}</span>
            </v-list-item-action-text>
            <v-list-item-action-text class="overline mt-1">
              {{ formatDate(item.body.timestamp) }}
              <span
                v-if="item.body.last_action"
              >— {{ formatDate(item.body.last_action) }}</span>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>

        <template v-for="(values, key) in item.highlights">
          <div
            :key="key"
            class="d-flex flex-column mr-12 ml-6 pt-2 pb-4"
            v-if="!['alias', 'address', 'tags', 'language'].includes(key)"
          >
            <span class="overline">{{ key }}</span>
            <span
              v-for="(value, i) in values"
              :key="key + i"
              v-html="highlight(value)"
              class="d-inline-block caption text-wrap"
              style="max-width: 100%;"
            ></span>
          </div>
        </template>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { plural } from "@/utils/plural.js";

export default {
  name: "ContractItem",
  props: {
    item: Object,
    words: Array
  },
  data: () => ({
    limit: 5
  }),
  methods: {
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
.contract {
  max-width: 700px;
}
.contract:hover {
  cursor: pointer;
}
.card:visited {
  .header {
    color: purple;
  }
}
</style>