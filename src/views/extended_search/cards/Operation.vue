<template>
    <v-card class="mx-auto" outlined :loading="loading">
        <v-card-title class="sidebar py-2" primary-title>Top result</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item two-line class="pl-3">
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
        <v-card-actions class="pl-8 mb-4">
            <v-btn color="primary" outlined small :to="`/${item.body.Network}/opg/${item.body.Hash}`">
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
    created() {
        this.getOPG();
    },
    computed: {
        status() {
            if (this.info.status === 'applied') {
                return 'applied';
            }
            if (this.info.mempool) {
                return 'mempool';
            }
            return 'failed';
        }
    },
    methods: {
        getOPG() {
            if (this.loading) return;
            this.loading = true;

            this.api.getOPG(this.item.body.Hash)
                .then(opg => {
                    if (opg.length > 0){
                        this.info = opg[0];
                    }
                })
                .catch(err => console.log(err))
                .finally(() => this.loading = false);
        },
    }
}
</script>