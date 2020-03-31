<template>
  <div class="operation">
    <v-hover v-slot:default="{ hover }">
      <v-card class="my-3 transparent" :elevation="hover ? 2 : 0" @click="onSearch(item)">
        <v-list-item three-line selectable>
          <v-list-item-content>
            <span class="overline" v-if="item.body.found_by">Found by {{ item.body.found_by }}</span>
            <v-list-item-title class="hash subtitle-1">{{ item.value }}</v-list-item-title>
            <v-list-item-subtitle>
              <span class="overline" :class="item.body.network === 'mainnet' ? 'primary--text' : ''">
                {{ item.body.network }}
              </span>
            </v-list-item-subtitle>

            <div class="d-flex flex-horizontal mt-1">
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
            <v-list-item-action-text class="caption">
              {{ item.body.status }}
            </v-list-item-action-text>
            <v-list-item-action-text class="caption" v-if="item.group">
              {{ plural(item.group.count - 1, "internal") }}
            </v-list-item-action-text>
            <v-list-item-action-text class="overline">
              {{ formatDate(item.body.timestamp)}}
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { checkOperation } from "@/utils/tz.js";
import { plural } from '@/utils/plural.js';

export default {
  name: "OperationItem",
  props: {
    item: Object
  },
  methods: {
    onSearch(item) {
      if (checkOperation(item.value)) {
        let routeData = this.$router.resolve({ path: `/opg/${item.value}` });
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
.operation {
  max-width: 700px;
}
.contract:hover {
  cursor: pointer;
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