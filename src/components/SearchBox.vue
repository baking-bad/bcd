<template>
  <v-combobox
    v-model="model"
    :search-input.sync="searchText"
    :items="suggests"
    item-text="value"
    return-object
    prepend-inner-icon="mdi-magnify"
    placeholder="Search anything"
    autocomplete="off"
    no-filter
    append-icon
    clearable
    hide-selected
    :background-color="background"
    :hide-details="toolbar"
    :solo="toolbar"
    :flat="toolbar"
    :outlined="!toolbar"
    @change="onSearch"
  >
    <template v-slot:item="{ item }">
      <v-list-item-avatar>
        <v-icon v-if="item.type == 'contract'">mdi-code-tags</v-icon>
        <v-icon v-else-if="item.type == 'operation'">mdi-swap-horizontal</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="hash" v-text="item.body.address || item.body.hash"></v-list-item-title>
        <v-list-item-subtitle>Found in {{item.body.found_by}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text class="overline primary--text" v-text="item.body.network"></v-list-item-action-text>
      </v-list-item-action>
    </template>
  </v-combobox>
</template>

<script>
import { mapActions } from "vuex";

import * as api from "@/api/index.js";
import { checkAddress, checkOperation } from "@/utils/tz.js";

export default {
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
    searchText: null
  }),
  methods: {
    ...mapActions(["showError"]),
    onSearch() {
      if (!this.model) return;
      let value = this.model.value || this.model;
      if (this.model.type == "operation" && checkOperation(value)) {
        this.$router.push({ path: `/opg/${value}` });
      }
      if (this.model.type == "contract" && checkAddress(value)) {
        let network = this.model.body.network;
        this.$router.push({ path: `/${network}/${value}` });
      }
    }
  },
  watch: {
    searchText(val) {
      if (val.length > 1) {
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
