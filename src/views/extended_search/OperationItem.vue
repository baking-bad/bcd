<template>
  <div class="operation">
    <v-hover v-slot:default="{ hover }">
      <v-card
        class="my-3 transparent card"
        :elevation="hover ? 2 : 0"
        target="_blank"
        :to="{ path: `/opg/${item.value}` }"
      >
        <v-list-item three-line selectable>
          <v-list-item-content>
            <v-list-item-title class="header">
              <span
                v-if="item.body.destination_alias"
                v-html="highlight(item.body.destination_alias + ' :: ')"
              ></span>
              <span v-if="item.body.entrypoint" v-html="highlight(item.body.entrypoint + '()')"></span>
            </v-list-item-title>
            <v-list-item-title class="header opg_hash grey--text text--darken-2">
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
                <span>operation</span>
              </v-chip>
              <v-chip
                key="status"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >
                <span v-html="highlight(item.body.status)"></span>
              </v-chip>
              <v-chip
                v-if="item.body.internal"
                key="internal"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >internal</v-chip>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              class="caption"
              v-if="item.group"
            >{{ plural(item.group.count - 1, "internal") }}</v-list-item-action-text>
            <v-list-item-action-text class="overline mt-1">{{ formatDate(item.body.timestamp)}}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>

        <template v-for="(values, key) in item.highlights">
          <div
            :key="key"
            class="d-flex flex-column mr-12 ml-6 pt-2 pb-4"
            v-if="!['hash', 'entrypoint'].includes(key)"
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
  name: "OperationItem",
  props: {
    item: Object,
    words: Array
  },
  computed: {
    nonDefault() {
      return (
        this.item.body.entrypoint && this.item.body.entrypoint !== "default"
      );
    }
  },
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
.operation {
  max-width: 700px;
}
.operation:hover {
  cursor: pointer;
}
.opg_hash {
  font-family: "Roboto Mono", monospace;
  font-size: 0.9rem;
}
.card:visited {
  .header {
    color: purple;
  }
}
</style>