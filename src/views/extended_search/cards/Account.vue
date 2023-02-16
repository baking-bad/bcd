<template>
    <v-card class="mx-auto sticky-card" outlined :loading="loading">
        <v-card-text>
            <v-list>
                <v-list-item two-line class="px-3">
                    <v-list-item-avatar size="50">
                         <v-icon size="50">mdi-wallet-outline</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text-h4 text--primary">{{ alias ? alias : info.address }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="secondary--text overline">{{ item.body.Network }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn color="primary" target="_blank" :to="link" text small>View</v-btn>
                    </v-list-item-action>
                </v-list-item>

                <v-list-item two-line v-if="alias">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Address</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ item.body.Address }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Balance</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.balance | uxtz }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Operations count</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.tx_count }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Last action</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.last_action | fromNow }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions class="pl-8 mb-4">
            <v-btn color="primary" target="_blank" outlined small :to="link">
                Account page
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { getAccountAlias } from '@/api/search.js';

export default {
    name: "AccountCard",
    props: {
        item: Object
    },
    data: () => ({
        loading: false,
        info: {}
    }),
    computed: {
        alias() {
            let alias = getAccountAlias(this.item.body);
            if (alias) return this.$sanitize(alias);
            return this.$sanitize(this.info.alias);
        },
        link() {
            return `/${this.item.body.Network}/${this.info.address}`;
        }
    },
    methods: {
        getAccountInfo(item) {
            if (this.loading) return;
            this.loading = true;

            this.api.getAccountInfo(item.body.Network, item.body.Address)
            .then(account => {
                this.info = account;
            })
            .catch(err => console.error(err))
            .finally(() => this.loading = false);
        }
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            async handler(value) {
                if (value)
                    await this.getAccountInfo(value);
            }
        }
    }
}
</script>