<template>
    <v-card class="mx-auto" outlined :loading="loading">
        <v-card-title class="sidebar py-2" primary-title>Top result</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item two-line class="pl-3">
                    <v-list-item-avatar size="50">
                         <v-icon size="50">mdi-database</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text-h4 text--primary">{{ helpers.shortcutOnly(item.body.KeyHash) }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="secondary--text overline">{{ item.body.Network }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Pointer</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ item.body.BigMapID }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Key hash</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ item.body.KeyHash }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Status</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ item.body.IsActive ? 'Active' : 'Removed' }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions class="pl-8 mb-4">
            <v-btn color="primary" outlined small :to="`/${item.body.Network}/big_map/${item.body.BigMapID}/${item.body.KeyHash}`">
                Key page
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "BigMapKeyCard",
    props: {
        item: Object
    },
    data: () => ({
        loading: false
    })
}
</script>