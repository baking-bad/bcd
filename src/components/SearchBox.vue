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
    filled
    rounded
    background-color="data"
    :autofocus="!inplace"
    :outlined="!inplace"
    :dense="inplace"
  >
    <template v-slot:item="{ item }">
      <v-list-item-avatar>
        <v-icon v-if="item.type == 'contract'">mdi-code-json</v-icon>
        <v-icon v-else-if="item.type == 'operation'">mdi-swap-horizontal</v-icon>
        <v-icon v-else-if="item.type == 'bigmapdiff'">mdi-database-edit</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <template v-if="item.type == 'contract'">
            <span v-if="item.body.alias">{{ item.body.alias }}</span>
            <span v-else v-html="helpers.shortcut(item.value)"></span>
          </template>
          <template v-else-if="item.type == 'operation'">
            <template v-if="item.body.destination.startsWith('KT')">
              <span
                v-if="item.body.destination_alias"
                class="text--secondary"
              >{{ item.body.destination_alias}}</span>
              <span v-else v-html="helpers.shortcut(item.body.destination)" class="text--secondary"></span>
              <span class="text--secondary" style="font-size: 20px;">→</span>
            </template>
            <span v-if="item.body.entrypoint" class="hash">{{ item.body.entrypoint}}()</span>
            <span v-else-if="item.body.kind === 'origination'">origination</span>
            <span v-else v-html="helpers.shortcut(item.value)"></span>
          </template>
          <template v-else-if="item.type == 'bigmapdiff'">
            <span class="text--secondary">{{ item.body.ptr }}</span>
            <span class="text--secondary" style="font-size: 20px;">→</span>
            <span>{{ item.body.key }}</span>
          </template>
        </v-list-item-title>

        <v-list-item-subtitle class="overline">
          <span :class="item.body.network === 'mainnet' ? 'secondary--text' : ''">
            {{ item.body.network }}&nbsp;|&nbsp;
          </span>
          <span v-if="item.type === 'contract'">
            {{ helpers.plural(item.body.tx_count - 1, 'tx') }}&nbsp;|&nbsp;
          </span>
          <span v-else-if="item.type === 'operation'">
            {{ item.body.status }}&nbsp;|&nbsp;
          </span>
          <span v-else-if="item.type === 'bigmapdiff' && item.group">
            {{ helpers.plural(item.group.count, "update") }}&nbsp;|&nbsp;
          </span>
          <span class="overline text--primary">
            {{ helpers.formatDate(item.body.timestamp) }}
            <span v-if="item.body.last_action">— {{ helpers.formatDate(item.body.last_action) }}</span>
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>
          <span
            class="body-2"
            v-if="!['alias', 'key_strings', 'entrypoint'].includes(item.body.found_by) 
                && item.highlights[item.body.found_by]"
            v-html="item.highlights[item.body.found_by][0]"
          ></span>
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
      const value = this.model.value || this.model;
      const network = this.model.body.network;

      if (this.model.type == "operation" && checkOperation(value)) {
        this.$nextTick(() => {
          this.model = null;
        });
        this.$router.push({ path: `/${network}/opg/${value}` });
      }
      if (this.model.type == "contract" && checkAddress(value)) {
        this.$nextTick(() => {
          this.model = null;
        });
        this.$router.push({ path: `/${network}/${value}` });
      }
      if (this.model.type == "bigmapdiff" && checkKeyHash(value)) {
        const ptr = this.model.body.ptr;
        this.$nextTick(() => {
          this.model = null;
        });
        this.$router.push({ path: `/${network}/big_map/${ptr}/${value}` });
      }
    },
    onEnter(searchText) {
      if (searchText !== null && searchText.length > 2) {
        this.$router.push({ name: "search", query: { text: searchText } });
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
    }
  },
  watch: {
    searchText(val) {
      if (this._locked) return;
      this._locked = true;
      this.searchText = val ? val.trim() : "";
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
    color: var(--v-error-base);
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
