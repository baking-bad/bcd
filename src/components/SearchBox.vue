<template>
  <v-combobox
    v-model="model"
    :search-input.sync="searchText"
    :items="suggests"
    item-text="value"
    @keyup.enter="onEnter(searchText)"
    @change="onSearch"
    return-object
    placeholder="Search anything"
    autocomplete="off"
    no-filter
    append-icon
    clearable
    hide-selected
    prepend-inner-icon="mdi-magnify"
    :filled="inplace"
    :rounded="inplace"
    :outlined="!inplace"
    :background-color="inplace ? 'data' : 'transparent'"
    :dense="inplace"
  >
    <template v-slot:item="{ item }">
        <v-list-item-avatar>
          <v-icon v-if="item.type == 'contract'">mdi-code-json</v-icon>
          <v-icon v-else-if="item.type == 'operation'">mdi-swap-horizontal</v-icon>
          <v-icon v-else>mdi-database-edit</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-if="item.body.alias">
            <span>{{ shortcut(item.body.alias) }}</span>
          </v-list-item-title>
          <v-list-item-title v-else-if="item.body.key">
            <span>{{ shortcut(item.body.key) }}</span>
          </v-list-item-title>
          <v-list-item-title v-else-if="item.body.entrypoint">
            <span>{{ shortcut(item.body.entrypoint) }}()</span>
          </v-list-item-title>
          <v-list-item-title v-else>
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
              v-if="!['alias', 'address', 'key_strings', 'entrypoint'].includes(item.body.found_by) && item.highlights[item.body.found_by]" 
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
import { checkAddress, checkOperation, checkKeyHash } from "@/utils/tz.js";
import dayjs from "dayjs";

export default {
  props: {
    inplace: Boolean
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
        this.$nextTick(() => {
          this.model = null;
        })
        this.$router.push({ path: `/opg/${value}` });
      }
      if (this.model.type == "contract" && checkAddress(value)) {
        let network = this.model.body.network;
        this.$nextTick(() => {
          this.model = null;
        })
        this.$router.push({ path: `/${network}/${value}` });
      }
      if (this.model.type == "bigmapdiff" && checkKeyHash(value)) {
        let network = this.model.body.network;
        let address = this.model.body.address;
        let bigmap = this.model.body.ptr; 
        this.$nextTick(() => {
          this.model = null;
        })
        this.$router.push({ path: `/bigmap/${network}/${address}/${bigmap}/${value}` });
      }
    },
    onEnter(searchText) {
      if (searchText !== null && searchText.length > 2) {
        this.$router.push({ name: "search", query: { text: searchText } });
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
        this.api
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
      if (value !== undefined && value.length > 2 * size + 2) {
        if (value.startsWith('KT') || value.startsWith('tz') || value.startsWith('o') || value.startsWith('expr')) {
          return value.substr(0, size) + `\u2026\u202F` + value.substr(value.length - size, size);
        } else {
          return value.slice(0, 2 * size + 2) + `\u2026\u202F`;
        }
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
  .v-list-item__content {
    flex-direction: column;

    .v-list-item__title {
      margin-right: auto;
      font-family: "Roboto Mono";
    }
    .v-list-item__subtitle {
      margin-right: auto;
    }
  }
}
</style>
