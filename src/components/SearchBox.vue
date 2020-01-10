<template>
    <v-combobox
        ref="sb"
        v-model="model"
        :search-input.sync="searchText"
        :items="suggests"
        item-text="address"
        item-value="address"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search anything"
        autocomplete="off"
        append-icon
        clearable
        hide-selected
        outlined
        @change="onSearch">
        <template v-slot:item="{ item }">
            <v-list-item-avatar>                
                <v-icon>mdi-magnify</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title v-text="item.address"></v-list-item-title>
                <v-list-item-subtitle v-text="item.network"></v-list-item-subtitle>
            </v-list-item-content>
        </template>
    </v-combobox>
</template>

<script>
import * as api from '@/api/index.js';

export default {
    data: () => ({
        history: [],
        suggests: [],
        model: null,
        searchText: null
    }),
    methods: {
        onSearch() {
            if (!this.model) return;

            this.$router.push({ path: `/${this.model.address}` });
        }
    },
    watch: {
        searchText(val) {
            api.search(val)
            .then(res => {
                this.suggests = res
            })
            .catch(err => console.log(err))
        }
    }
}
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
            opacity: .65;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
