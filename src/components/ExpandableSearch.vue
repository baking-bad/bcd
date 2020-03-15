<template>
  <v-menu
    v-model="expanded"
    left
    offset-x
    :close-on-click="false"
    :close-on-content-click="false"
    style="max-width: 400px;"
    class="transparent"
    :min-width="400"
    :nudge-left="10"
    :nudge-top="2"
    :z-index="10"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon @click="expanded = !expanded" v-on="on" class="mb-2">
        <v-icon :color="expanded ? 'primary': ''">mdi-magnify</v-icon>
      </v-btn>
    </template>

    <v-combobox
      v-show="expanded"
      v-model="model"
      class="hash search-box"
      :search-input.sync="searchText"
      :items="suggests"
      item-text="value"
      background-color="grey lighten-4"
      return-object
      placeholder="Search anything"
      autocomplete="off"
      no-filter
      append-icon
      clearable
      hide-selected
      hide-details
      solo
      dense
      @change="onSearch"
    >
      <template v-slot:item="{ item }">
        <v-list-item-avatar>
          <v-icon v-if="item.type == 'contract'">mdi-code-tags</v-icon>
          <v-icon v-else-if="item.type == 'operation'">mdi-swap-horizontal</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="hash" v-text="item.value"></v-list-item-title>
          <v-list-item-subtitle>Found in {{item.body.found_by}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text class="overline primary--text" v-text="item.body.network"></v-list-item-action-text>
        </v-list-item-action>
      </template>
    </v-combobox>
  </v-menu>
</template>

<script>
import { mapActions } from "vuex";

import * as api from "@/api/index.js";
import { checkAddress, checkOperation } from "@/utils/tz.js";

export default {
  name: "ExpandableSearch",
  props: {
    toolbar: Boolean
  },
  computed: {
    background() {
      if (this.toolbar) {
        return "rgba(255, 255, 255, 0)";
      }
      return "transparent";
    }
  },
  data: () => ({
    history: [],
    suggests: [],
    model: null,
    searchText: null,
    expanded: false
  }),
  methods: {
    ...mapActions(["showError"]),
    onSearch() {
      if (!this.model) return;
      let value = this.model.value || this.model;

      if (this.model.type === "operation" && checkOperation(value)) {
        this.expanded = false;
        this.model = null;
        this.$router.push({ path: `/opg/${value}` });
      }
      if (this.model.type === "contract" && checkAddress(value)) {
        this.expanded = false;
        let network = this.model.body.network;
        this.model = null;
        this.$router.push({
          path: `/${network}/${value}`
        });
      }
    }
  },
  watch: {
    searchText(val) {
      if (val != null && val != undefined && val.length > 1) {
        api
          .search(val)
          .then(res => {
            this.suggests = res.items;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          });
      }
    }
  }
};
</script>


<style lang="scss">
.v-autocomplete.error--text {
  .v-messages {
    font-size: 13px;
  }
  input {
    color: #ff5252 !important;
  }
}
.v-autocomplete__content {
  .v-list {
    padding: 4px 0;
  }
  .v-list-item__avatar {
    margin: 0;
    margin-right: 16px !important;
  }
  .v-list-item__action {
    margin: 0;
  }
  .v-list-item__content {
    flex-direction: column;

    .v-list-item__title {
      margin-right: auto;
    }
    .v-list-item__subtitle {
      margin-right: auto;
      opacity: 0.65;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

<style scoped>
.search-box {
  font-size: 12px;
  margin-bottom: 1px;
}
</style>
