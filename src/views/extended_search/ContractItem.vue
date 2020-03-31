<template>
  <div class="contract">
    <v-hover v-slot:default="{ hover }">
      <v-card class="my-3 transparent" :elevation="hover ? 2 : 0" @click="onSearch(item)">
        <v-list-item three-line selectable>
          <v-list-item-content>
            <span class="overline" v-if="item.body.found_by">Found in {{ item.body.found_by }}</span>
            <v-list-item-title class="subtitle-1"  v-if="item.body.alias" >
              <span v-html="highlight(item.body.alias)"></span>
            </v-list-item-title>
            <v-list-item-subtitle class="hash" :class="item.body.alias ? '' : 'subtitle-1'">
              {{ item.value }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <span class="overline" :class="item.body.network === 'mainnet' ? 'primary--text' : ''">
                {{ item.body.network }}
              </span>
            </v-list-item-subtitle>

            <div class="d-flex flex-horizontal mt-1">
              <v-chip
                key="language"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >{{ item.body.language }}</v-chip>
              <v-chip
                v-for="tag in item.body.tags"
                :key="tag"
                color="grey"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                outlined
                pill
              >{{ tag.replace('_', ' ') }}</v-chip>
            </div>

          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text class="caption">
              <span>{{ item.body.tx_count || 1 }} operations</span>
            </v-list-item-action-text>
            <v-list-item-action-text v-if="item.group" class="caption">
              <span>{{ item.group.count - 1 }} same contracts</span>
            </v-list-item-action-text>
            <v-list-item-action-text class="overline mt-1">
              {{ formatDate(item.body.timestamp) }}<span v-if="item.body.last_action"> — {{ formatDate(item.body.last_action) }}</span>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>  

        <v-row no-gutters class="mx-6 pb-2">
          <v-col cols="3" v-if="item.body.entrypoints">
            <span class="overline">Entrypoints</span>
            <template v-for="(item) in item.body.entrypoints.slice(0, limit)">
              <div :key="item" class="d-flex flex-horizontal my-2 align-center">
                <span class="same-network" v-html="highlight(item)"></span>
              </div>
            </template>
          </v-col>
          <v-col cols="9" v-if="item.body.fail_strings">
            <span class="overline">Fail strings</span>
            <template v-for="(item) in item.body.fail_strings.slice(0, limit)">
              <div :key="item" class="d-flex flex-horizontal my-2 align-center">
                <span class="same-network" v-html="highlight(item)"></span>
              </div>
            </template>
          </v-col>
        </v-row>
        <v-btn
          @click.prevent.stop="limit = 50"
          v-if="hasMore"
          x-small 
          depressed 
          class="grey--text text--darken-3 ml-4 mb-4">Show more</v-btn>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { checkAddress } from "@/utils/tz.js";
import { plural } from '@/utils/plural.js';

export default {
  name: "ContractItem",
  props: {
    item: Object,
    words: Array
  },
  data: () => ({
    limit: 5
  }),
  computed: {
    hasMore() {
      return this.limit == 5 && (
        (this.item.body.entrypoints && this.item.body.entrypoints.length > 5) ||
        (this.item.body.fail_strings && this.item.body.fail_strings.length > 5));
    }
  },
  methods: {
    onSearch(item) {
      if (checkAddress(item.value)) {
        let routeData = this.$router.resolve({ path: `/${item.body.network}/${item.value}` });
        window.open(routeData.href, "_blank");
      }
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
        let re = new RegExp(`(${this.words[i]})`, 'gmi');
        s = s.replace(re, "<mark>$1</mark>")
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
.others {
  color: grey;
  font-size: 12px;
}

.same-link {
  font-size: 12px;
  color: grey;
}

.same-network {
  font-size: 12px;
  color: #70757a;
}

.same-link:hover {
  color: #5b942a;
}
</style>