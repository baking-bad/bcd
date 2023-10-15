<template>
    <v-card class="mx-auto sticky-card" outlined :loading="loading">
        <v-card-text>
            <v-list>
                <v-list-item two-line class="px-3">
                    <v-list-item-avatar size="50">
                         <v-icon size="50">mdi-swap-horizontal</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text-h4 text--primary">{{ helpers.shortcutOnly(item.body.Hash) }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="secondary--text overline">{{ item.body.Network }}</span>
                            <span class="overline" v-if="info"> | {{ status }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn color="primary" target="_blank" :to="link" text small>Operation group page</v-btn>
                    </v-list-item-action>
                </v-list-item>

                <v-list-item two-line v-if="info">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Timestamp</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.timestamp | formatTime }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="info">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Level</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.level }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions class="pl-8 mb-4" v-if="item.body.Hash">
            <v-btn color="primary" target="_blank" outlined small :to="link">
                Operation group page
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "OperationCard",
    props: {
        item: Object
    },
    data: () => ({
        loading: false,
        info: null
    }),
    computed: {
        status() {
            if (this.info.status === 'applied') {
                return 'applied';
            }
            if (this.info.mempool) {
                return 'mempool';
            }
            return 'failed';
        },
        link() {
            return `/${this.item.body.Network}/opg/${this.item.body.Hash}`;
        }
    },
    methods: {
        getOPG(item) {
            if (this.loading) return;
            this.loading = true;

            this.api.getOPG(item.body.Hash, true, false, item.body.Network)
                .then(opg => {
                    if (opg.length > 0){
                        this.info = opg[0];
                    }
                })
                .catch(err => console.log(err))
                .finally(() => this.loading = false);
        },
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            async handler(value) {
                if (value)
                    await this.getOPG(value);
            }
        }
    }
}
</script>