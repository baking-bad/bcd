<template>
  <div class="contract">
    <v-hover v-slot:default="{ hover }">
      <v-card class="my-3 transparent" :elevation="hover ? 2 : 0" @click="onSearch(item)">
        <v-list-item three-line selectable>
          <v-list-item-content>
            <span class="overline" v-if="item.body.found_by">Found by {{ item.body.found_by }}</span>
            <v-list-item-title class="hash">{{ item.body.alias || item.value }}</v-list-item-title>
            <v-list-item-subtitle
              class="subtitle-2"
              v-if="item.body.manager"
            >Created by {{ item.body.manager }}</v-list-item-subtitle>
            <v-list-item-subtitle
              class="caption"
            >Deployed {{ formatDate(item.body.timestamp)}} - {{ item.body.language }}</v-list-item-subtitle>

            <div class="d-flex flex-horizontal mt-1">
              <v-chip
                v-for="tag in item.body.tags"
                :key="tag"
                color="secondary"
                text-color="grey darken-1"
                class="mr-1 caption"
                small
                label
                pill
              >{{ tag.replace('_', ' ') }}</v-chip>
            </div>

            <div v-if="item.group" class="mt-3 mx-2">
              <span class="overline">Same contracts</span>
              <template v-for="(top) in item.group.top">
                <div :key="top.key" class="d-flex flex-horizontal my-2 align-center">
                  <router-link
                    class="hash same-link mr-3"
                    :to="{'name': 'project', params:{'address': top.key, 'network': top.network}}"
                  >{{ top.key }}</router-link>
                  <span class="same-network">{{ top.network }}</span>
                </div>
              </template>
              <p
                class="others"
                v-if="item.group.count > 5"
              >and {{ plural(item.group.count - 5, "other") }}</p>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text class="overline primary--text" v-text="item.body.network"></v-list-item-action-text>
            <v-list-item-action-text
              v-if="item.body.tx_count"
              class="caption"
            >{{ item.body.tx_count }} operations</v-list-item-action-text>
            <v-list-item-action-text
              v-if="item.body.last_action"
              class="caption"
            >the last one was {{ formatDate(item.body.last_action) }}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
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
    item: Object
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
    plural (count, word) {
        return plural(count, word);
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