<template>
    <v-card class="mx-auto" outlined :loading="loading">
        <v-card-text>
            <v-list>
                <v-list-item two-line class="pl-3">
                    <v-list-item-avatar size="50">
                         <v-icon size="50">mdi-circle-multiple-outline</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text-h4 text--primary">{{ item.body.Name ? item.body.Name : info.TokenID }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="secondary--text overline">{{ item.body.Network }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Contract</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ item.body.Address }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Token ID</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ item.body.TokenID }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions class="pl-8 mb-4">
            <v-btn color="primary" outlined small :to="`/${item.body.Network}/${item.body.Address}/tokens?token_id=${item.body.TokenID}`">
                Token page
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "TokenCard",
    props: {
        item: Object
    },
    data: () => ({
        loading: false
    }),
}
</script>