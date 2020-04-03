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
    @keyup.enter="onEnter"
  >
    <template v-slot:item="{ item }">
        <v-list-item-avatar>
          <v-icon v-if="item.type == 'contract'">mdi-code-tags</v-icon>
          <v-icon v-else-if="item.type == 'operation'">mdi-swap-horizontal</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-if="item.body.alias">
            <span>{{ item.body.alias }}</span>
          </v-list-item-title>
          <v-list-item-title v-if="!item.body.alias">
            <span>{{ shortcut(item.value) }}</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span class="overline" :class="item.body.network === 'mainnet' ? 'primary--text' : ''">
              {{ item.body.network }},
            </span>
            <span class="overline">
              {{ formatDate(item.body.timestamp) }}<span v-if="item.body.last_action"> — {{ formatDate(item.body.last_action) }}</span>
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            <span class="body-2"
              v-if="!['alias', 'hash', 'address'].includes(item.body.found_by)" 
              v-html="item.highlights[item.body.found_by][0]"></span>
          </v-list-item-action-text>
          <v-list-item-action-text>
            <span class="overline grey--text">{{ item.body.found_by }}</span>
          </v-list-item-action-text>
        </v-list-item-action>
    </template>
  </v-combobox>
</template>

<script>
import { mapActions } from "vuex";

import * as api from "@/api/index.js";
import { checkAddress, checkOperation } from "@/utils/tz.js";
import dayjs from "dayjs";

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
    suggests: [],
    model: null,
    searchText: null,
    _locked: false,
    _timerId: null,
    seqno: 0
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
    },
    onEnter() {
      if (this.searchText !== null && this.searchText.length > 2) {
        this.$router.push({ name: "search", query: { text: this.searchText } });
      }
    },
    formatDate(value) {
      if (value) {
        return dayjs(value).format("MMM D, YYYY");
      }
    },
    fetchSearchDebounced(text, seqno) {
      if (!text || text.length < 3) return;

      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        api
          .search(text)
          .then(res => {
            if (seqno === this.seqno) {
              this.suggests = res.items;
            }
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          });
      }, 100);
    },
    shortcut(value, size=18) {
      if (value !== undefined
        && value.length > 2 * size + 1
        && (value.startsWith('KT') || value.startsWith('tz') || value.startsWith('o'))) {
        return value.substr(0, size) + `\u2026` + value.substr(value.length - size, size);
      } else {
        return value;
      }
    },
  },
  watch: {
    searchText(val) {
      if (this._locked) return;
      this._locked = true;
      this.searchText = val ? val.trim() : '';
      if (this.searchText) {
        this.fetchSearchDebounced(this.searchText, ++this.seqno);
      } else {
        this.suggests = [];
        this.model = null;
      }
      this._locked = false;
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
    justify-content: center;

    .v-list-item__action-text {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
