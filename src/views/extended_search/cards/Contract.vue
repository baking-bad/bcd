<template>
    <v-card class="mx-auto" outlined :loading="loading">
        <v-card-text>
            <v-list>
                <v-list-item two-line class="pl-3">
                    <v-list-item-avatar size="50">
                         <v-icon size="50">mdi-code-json</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text-h4 text--primary">{{ alias ? alias : info.address }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="secondary--text overline">{{ item.body.Network }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="info.tags && info.tags.length > 0">
                    <Tags :tags="info.tags"/>
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

                <v-list-item two-line v-if="info.manager">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Deployed by</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.manager }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Deployed</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ info.timestamp | fromNow }}</span>
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
            <v-btn color="primary" outlined small :to="`/${item.body.Network}/${info.address}`">
                Contract page
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Tags from "@/components/Tags";

export default {
    name: "ContractCard",
    props: {
        item: Object
    },
    components: {
        Tags
    },
    data: () => ({
        loading: false,
        info: {}
    }),
    computed: {
        alias() {
            if (this.item.body.TzKT) return this.item.body.TzKT.Name;
            if (this.item.body.Profiles) return this.item.body.Profiles.Name;
            if (this.item.body.Domains) return this.item.Domains.body.Name;
            if (this.item.body.TZIP) return this.item.body.TZIP.Name;
            return this.info.alias;
        }
    },
    created() {
        this.getContract();
    },
    methods: {
        getContract() {
            if (this.loading) return;
            this.loading = true;

            this.api.getContract(this.item.body.Network, this.item.body.Address)
                .then(contract => {
                    this.info = contract;
                })
                .catch(err => console.log(err))
                .finally(() => this.loading = false);
        },
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            async handler(newVal) {
                if (newVal) {
                    await this.getContract();
                }
            }
        }
    }
}
</script>