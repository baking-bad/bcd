<template>
  <div class="operation">
    <v-hover v-slot:default="{ hover }">
      <v-card class="my-3 transparent" :elevation="hover ? 2 : 0" @click="onSearch(item)">
        <v-list-item three-line>
          <v-list-item-content>
            <span class="overline" v-if="item.body.found_by">Found by {{ item.body.found_by }}</span>
            <v-list-item-title class="hash">{{ item.value }}</v-list-item-title>
            <v-list-item-subtitle
              class="subtitle-2"
              v-if="item.body.source && item.body.destination"
            >Sent to {{ item.body.destination }}</v-list-item-subtitle>
            <v-list-item-subtitle class="caption">Sent {{ formatDate(item.body.timestamp)}}</v-list-item-subtitle>

            <div v-if="item.group" class="mt-3 mx-2">
              <span class="overline">With {{ plural(item.group.count - 1, "internal operation") }}</span>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text class="overline primary--text" v-text="item.body.network"></v-list-item-action-text>
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