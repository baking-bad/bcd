<template>
  <v-combobox
    v-model="model"
    :search-input.sync="searchText"
    :items="suggests"
    :loading="isSuggestionsLoading"
    item-text="value"
    @focus="handleSearchBoxFocus"
    @keyup.enter="onEnter(searchText)"
    @mousedown="handleSearchBoxFocus"
    return-object
    placeholder="Search Tezos Smart Contracts and Interact with them"
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
    :menu-props="menuProps"
    @blur="handleSearchBoxBlur"
    :class="searchBoxClassName"
  >
    <template v-slot:progress>
      <v-progress-circular
          class="searchbox-custom-progress-circular"
          indeterminate
          color="var(--v-primary-base)"
          size="24"
          width="2"
      ></v-progress-circular>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-avatar>
        <v-icon v-if="item.type === 'account'">{{ item.body.IsContract ? 'mdi-code-json' : 'mdi-wallet-outline' }}</v-icon>
        <v-icon v-else-if="item.type === 'operation'">mdi-swap-horizontal</v-icon>
        <v-icon v-else-if="item.type === 'bigmapkey'">mdi-database-edit</v-icon>
        <v-icon v-else-if="item.type === 'token'" >mdi-circle-multiple-outline</v-icon>
        <v-icon v-else-if="item.type === 'recent'">mdi-history</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <template v-if="item.type === 'account'">
            <span class="text--secondary hash">{{ item.body.IsContract ? 'contract' : 'account' }}</span>
            <span class="text--secondary" style="font-size: 20px">&nbsp;→&nbsp;</span>
            <span v-if="getAccountName(item.body) != ''">{{ getAccountName(item.body) }}</span>
            <Shortcut v-else :str="item.body.Address"/>
          </template>
          <template v-else-if="item.type === 'operation'">
            <span class="text--secondary hash">operation</span>
            <span class="text--secondary" style="font-size: 20px">&nbsp;→&nbsp;</span>
            <template v-if="item.body.Destination && item.body.Destination.startsWith('KT')">
              <Shortcut class="text--secondary" :str="item.body.Hash"/>
              <span class="text--secondary" style="font-size: 20px">&nbsp;→&nbsp;</span>
            </template>
            <span v-if="item.body.Entrypoint" class="hash"
              >{{ item.body.Entrypoint }}()</span
            >
            <span v-else-if="item.body.Type === 'origination'"
              >origination</span
            >
            <Shortcut v-else :str="item.body.Hash"/>
          </template>
          <template v-else-if="item.type === 'bigmapkey'">
            <span class="text--secondary hash">big map {{ item.body.BigMapID }}</span>
            <span class="text--secondary" style="font-size: 20px">&nbsp;→&nbsp;</span>
            <span>{{ item.body.KeyHash }}</span>
          </template>
          <template v-else-if="item.type === 'token'">
            <span class="text--secondary hash">token</span>
            <span class="text--secondary" style="font-size: 20px">&nbsp;→&nbsp;</span>
            <span v-if="item.body.Name">{{ item.body.Name }}</span>
            <Shortcut v-else :str="item.body.Address"/>
          </template>         
          <template v-if="item.type === 'recent'">
            <span class="text--secondary hash">recent</span>
            <span class="text--secondary" style="font-size: 20px">&nbsp;→&nbsp;</span>
            <span v-if="item.body.alias">{{ item.body.alias }}</span>
            <Shortcut v-else-if="item.body.shortcut" :str="item.body.shortcut"/>
            <span v-else>{{ item.value }}</span>
          </template>
        </v-list-item-title>

        <v-list-item-subtitle class="caption" v-if="item.body">
          <span
            v-if="item.body.Network"
            :class="item.body.Network === 'mainnet' ? 'secondary--text overline' : 'overline'">
            {{ item.body.Network }}
          </span>
          <span v-if="item.type === 'account'">&nbsp;|&nbsp;{{ item.body.Address }}
          </span>
          <span v-else-if="item.type === 'operation'" class="overline">&nbsp;|&nbsp;{{
            item.body.Status
          }}</span>
          <span v-else-if="item.type === 'bigmapkey'" class="overline">&nbsp;|&nbsp;{{
            item.body.IsActive ? 'active' : 'removed'
          }}</span>
          <span v-else-if="item.type === 'token'" class="overline">&nbsp;|&nbsp;ID {{ item.body.TokenID }}</span>
          <span v-else-if="item.type === 'recent' && item.body.second">&nbsp;|&nbsp;{{ item.body.second }}</span>
          <span class="overline text--primary" v-if="item.body['@timestamp']">
            &nbsp;|&nbsp;{{ helpers.formatDate(item.body['@timestamp']) }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text v-if="item.body.found_by">
          <span
            class="body-2"
            v-if="
              ![
                'alias',
                'key_strings',
                'entrypoint',
                'recent',
                'name',
                '',
              ].includes(item.body.found_by) &&
              item.highlights[item.body.found_by]
            "
            v-html="sanitize(item.highlights[item.body.found_by][0])"
          ></span>
        </v-list-item-action-text>
        <v-list-item-action-text>
          <span class="overline grey--text">{{
            item.body.found_by || ""
          }}</span>
        </v-list-item-action-text>
        <v-btn
          x-small
          text
          color="grey darken-2"
          v-if="item.type === 'recent'"
          @click.stop.prevent="onRemoveClick(item.value)"
        >
          recent
          <v-icon right>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-combobox>
</template>

<script>
import { mapActions } from "vuex";
import { isKT1Address, isOperationHash } from "@/utils/tz.js";
import { getAccountAlias } from '@/api/search.js';
import {
  getHistory,
  addHistoryItem,
  removeHistoryItem,
} from "@/utils/history.js";
import {SEARCH_TABS} from "../constants/searchTabs";
import waitUntil from "async-wait-until";
import Shortcut from '@/components/Shortcut.vue';

const MIN_SEARCH_STRING_LENGTH = 1;

export default {
  components: {
    Shortcut
  },
  props: {
    inplace: Boolean,
  },
  data: () => ({
    suggests: [],
    isSuggestionsLoading: false,
    model: null,
    searchText: null,
    _locked: false,
    _timerId: null,
    isFocused: false,
    isSearchCalled: false,
    seqno: 0,
    menuProps: {},
  }),
  created() {
    this.suggests = this.getHistoryItems(null);
  },
  destroyed() {
    clearTimeout(this._timerId);
  },
  computed: {
    searchBoxClassName() {
      if (this.isFocused) {
        return 'focused-searchbar searchbar';
      }
      return 'unfocused-searchbar searchbar';
    },
  },
  methods: {
    ...mapActions(["showError"]),
    handleSearchBoxFocus() {
      this.isFocused = true;
    },
    handleSearchBoxBlur() {
      this.isFocused = false;
      this.menuProps = {};
      this.model = null;
    },
    pushTo(path) {
      if (this.$route.path !== `${path}/operations`) {
        this.$router.push({
          path,
        });
      }
      this.$nextTick(() => {
        this.model = null;
      });
    },
    isModelsArrayInclude(value) {
      return [this.model.type, this.model.body.type].includes(value);
    },
    onSearch() {
      if (!this.model || !this.model.body) return;
      const network = this.model.body.Network;

      const isToken = this.isModelsArrayInclude("token");
      const isBigMap = this.isModelsArrayInclude("bigmapkey");
      const isAccount = this.isModelsArrayInclude("account");
      const isOperation = this.isModelsArrayInclude("operation");

      if (isToken) {
        addHistoryItem(this.buildHistoryItem(this.model, this.model.body.Address));
        this.pushTo(`/${network}/${this.model.body.Address}/tokens?search=${this.model.body.TokenID}`);
      } else if (isBigMap) {   
        addHistoryItem(this.buildHistoryItem(this.model, this.model.body.KeyHash));     
        this.pushTo(`/${network}/big_map/${this.model.body.BigMapID}/${this.model.body.KeyHash}`);
      } else if (isAccount){
        addHistoryItem(this.buildHistoryItem(this.model, this.model.body.Address));    
        this.pushTo(`/${network}/${this.model.body.Address}`);
      } else if (isOperation) {
        addHistoryItem(this.buildHistoryItem(this.model, this.model.body.Hash));
        this.pushTo(`/${network}/opg/${this.model.body.Hash}`);
      } else if (this.model.type === "recent") {
        addHistoryItem(this.buildHistoryItem(this.model, this.model.value));
        this.$router.push({ name: "search", query: { text: this.model.value } });
      }

      this.$emit('search');
    },
    buildHistoryItem(model, value) {
      let historyItem = model.body;
      historyItem.value = value;
      historyItem.type =  model.body.type || model.type;

      if (model && model.body) {
        if (historyItem.type === 'account') {
          historyItem.alias = this.getAccountName(model.body);
          historyItem.second = model.body.Address;
        } else if (historyItem.type === 'bigmapkey') {
          historyItem.second = `In big map ${model.body.BigMapID}`;
        } else if (model.body.Name) {
          historyItem.alias = model.body.Name;
        }
        else {
          historyItem.shortcut = value;
        }

        if (model.type === "operation" && model.body.Entrypoint) {
          historyItem.second = `Called ${model.body.Entrypoint}`;
        }
      }
      return historyItem;
    },
    async onEnter(searchText) {
      this.isFocused = true;

      await waitUntil(() => this.isSearchCalled === false);
      if (isKT1Address(searchText)) {
        if (this.config.sandbox_mode) {
          await this.$router.push({path: `/sandboxnet/${searchText}`});
          return;
        } else {
          const firstContractSuggest = this.suggests.find((suggest) => suggest.type === 'account');
          if (firstContractSuggest) {
            const { body } = firstContractSuggest;
            await this.$router.push({path: `/${body.Network}/${body.Address}`});
            return;
          }
        }
      }
      if (isOperationHash(searchText)) {
        if (this.config.sandbox_mode) {
          await this.$router.push({path: `/sandboxnet/opg/${searchText}`});
          return;
        } else {
          const firstOperationSuggest = this.suggests.find((suggest) => suggest.type === 'operation');
          if (firstOperationSuggest) {
            const { body } = firstOperationSuggest;
            await this.$router.push({path: `/${body.Network}/opg/${body.Hash}`});
            return;
          }
        }
      }
      if (searchText !== null && searchText.length > 2) {
        addHistoryItem({
          value: searchText,
        });
        await this.$router.push({ name: "search", query: { text: searchText } });
      }
    },
    getHistoryItems(searchText) {
      let result = [];
      let history = getHistory();
      if (history.length == 0) return result;

      if (searchText !== null && searchText !== "") {
        history = history.filter((item) => {
          if (item.alias) {
            return item.alias
              .toLowerCase()
              .startsWith(searchText.toLowerCase());
          }
          return item.value.toLowerCase().startsWith(searchText.toLowerCase());
        });
      }
      history.forEach((item) => {
        result.push({
          type: "recent",
          body: item,
          value: item.value,
        });
      });
      return result;
    },
    fetchSearchDebounced(text, seqno) {
      if (!this.searchService.created() || !text || text.length < MIN_SEARCH_STRING_LENGTH) return;
      if (text.length > 255) text = text.substring(0, 255)

      this.isSearchCalled = true;
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        this.isSuggestionsLoading = true;
        this.searchService
          .suggest(text)
          .then((res) => {
            if (seqno === this.seqno) {
              this.suggests = this.getHistoryItems(text);
              if (res && res.items) {
                this.suggests.push(...res.items);
              }
              const isKT = isKT1Address(text);
              const isOperation = isOperationHash(text);
              const sc = isKT ? SEARCH_TABS[7] : isOperation ? SEARCH_TABS[8] : SEARCH_TABS[6];
              if (this.$gtag) {
                this.$gtag.pageview(`/search?text=${text}&sc=${sc}`);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.isSuggestionsLoading = false;
            this.isSearchCalled = false;
          });
      }, 200);
    },
    onRemoveClick(text) {
      removeHistoryItem(text);
      this.suggests = this.getHistoryItems(null);
    },
    getAccountName(body) {
      return getAccountAlias(body);
    }
  },
  watch: {
    searchText(val, oldVal) {
      if (val !== oldVal) {
        this.suggests = [];
      }

      if (val === undefined) return;

      let value = val;
      if (typeof val === 'object' && val.body !== undefined) {
        value = val.body.value;
      } else {
        value = value.trim();
      }

      try {
        if (this._locked) return;
        this.menuProps = {};
        this.onSearch();
        this._locked = true;
        this.searchText = this.model ? this.model.name : value;
        if (this.searchText) {
          this.fetchSearchDebounced(this.searchText, ++this.seqno);
        } else {
          this.suggests = [];
          this.model = null;
        }
      }
      catch (e) {
        console.log(e)
      }
      finally {
        this._locked = false;
      }
    },
    model() {
      if (this._locked) return;
      this.onSearch();
    },
    isFocused(val) {
      if (val) {
        this.$emit('focus');
      } else {
        this.$emit('blur');
      }
    },
  },
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
  width: 358px;
  right: 0;
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
      font-family: "Roboto Mono", monospace;
    }
    .v-list-item__subtitle {
      margin-right: auto;
    }
  }
}
.unfocused-searchbar {
  min-width: auto !important;
  left: auto !important;
}
.searchbox-custom-progress-circular {
  position: absolute;
  align-self: center;
  right: 3rem;
}
</style>
