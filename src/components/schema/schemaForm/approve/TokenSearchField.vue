<template>
    <v-combobox
        v-model="selectedToken"
        :search-input.sync="searchText"
        :items="suggests"
        :loading="isSuggestionsLoading"
        placeholder="Search tokens by name"
        :hint="`Tokens will be searched in current contract network: ${network}`"
        autocomplete="off"
        prepend-inner-icon="mdi-magnify"
        background-color="data"
        :item-text="item => getItemText(item)"
        outlined
        dense
        no-filter
        append-icon
        hide-no-data
        clearable
        hide-selected
        persistent-hint
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
        <v-list-item-avatar width="75">
            <v-chip active-class="primary--text" disabled active small class="caption chip hash">{{ item.type == 1 ? 'FA1.2' : 'FA2' }}</v-chip>
        </v-list-item-avatar>
        <v-list-item-content v-if="item.body">
            <v-list-item-title>
                <span v-if="item.body.Name">{{ item.body.Name }}</span>
                <Shortcut v-else :str="item.body.Address"/>
            </v-list-item-title>

            <v-list-item-subtitle class="hash">
                <span>{{item.body.Address}}</span>
                <span>&nbsp;|&nbsp;ID {{ item.body.TokenID }}</span>
            </v-list-item-subtitle>
        </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script>
import { mapActions } from "vuex";
import Shortcut from '@/components/Shortcut.vue';

const MIN_SEARCH_STRING_LEN = 1;

export default {
    name: 'TokenSearchField',
    components: {
        Shortcut
    },
    props: {
        value: Object,
        network: String,
    },
    computed: {
        selectedToken: {
            get() {
                return this.value;
            },
            set(value) {
                if (typeof value === 'object')
                    this.$emit('input', value);
            }
        }
    },
    data: () => {
        return {
            searchText: '',
            suggests: [],
            isSuggestionsLoading: false,
            isSearchCalled: false,
            _timerId: null,
            _locked: false,
            seqno: 0,
        };
    },
    destroyed() {
        clearTimeout(this._timerId);
    },
    methods: {
        ...mapActions(["showError"]),
        getItemText(item) {
            return `${item.body.Name} (${item.body.Address} with token id ${item.body.TokenID})`
        },
        async processSearchResult(res, seqno) {
            if (seqno === this.seqno) {
                if (res && res.items) {
                    for(let item of res.items) {  
                        item.type = await this.getContractType(item)
                    }

                    // additional condition: it's required because getContractType is asyncronous and seqno may change while it executes.
                    if (seqno === this.seqno) {
                        this.suggests.push(...res.items);
                    }
                }
            }
        },
        fetchSearchDebounced(text, seqno) {
            if (!this.searchService.created() || !text || text.length < MIN_SEARCH_STRING_LEN) return;
            if (text.length > 255) text = text.substring(0, 255)

            clearTimeout(this._timerId);

            this._timerId = setTimeout(() => {
                let filters = {
                    index: ["tokens"], 
                    network: [this.network]
                }

                this.isSuggestionsLoading = true;
                this.searchService
                    .suggest(text, 5, filters)
                    .then(res => this.processSearchResult(res, seqno))
                    .catch((err) => {
                        console.log(err);
                        this.showError(err);
                    })
                    .finally(() => {
                        this.isSuggestionsLoading = false;
                    });
            }, 200);
        },
        async getContractType(item) {
            if (!item || !item.body) return;

            try {
                let contract = await this.api.getContract(item.body.Network, item.body.Address, false)
                if (contract.tags && contract.tags.length > 0) {
                    if (contract.tags.includes('fa2')) {
                        return 2;
                    } else if (contract.tags.includes('fa1-2')){
                        return 1;
                    }
                }
                return;
            } catch(e) {
                console.log(e)
            }
        },
        reset() {
            this.searchText = '';
            this.suggests = [];
            this.isSuggestionsLoading = false;
            this.isSearchCalled = false;
        }
    },
    watch: {
        searchText(val, oldVal) {
            if (!val || val === '') {
                this.suggests = [];
                this.selectedToken = null;
                return
            }
            if (this.selectedToken && this.selectedToken.body && val == this.selectedToken.body.Name) {
                return
            }
            if (val === oldVal) {
                return
            }

            if (this._locked) return;

            this._locked = true;
            this.suggests = [];            
            let value = val.trim();

            if (value) {
                try {
                    this.fetchSearchDebounced(value, ++this.seqno);
                }
                catch (e) {
                    console.log(e)
                }
            }
            
            this._locked = false;
        }
    }
}
</script>