<template>
    <v-expansion-panels flat hover tile>
        <v-expansion-panel>
            <v-expansion-panel-header class="canvas caption font-weight-medium text-uppercase text--disabled">{{ helpers.plural(files.length, 'file') }}</v-expansion-panel-header>
            <v-expansion-panel-content class="pa-0 ma-0">
                <v-list class="pa-0 ma-0">
                    <FileTreeItem :file="file" v-for="(file, idx) in items" :key="idx" />
                </v-list>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import FileTreeItem from './FileTreeItem.vue';

export default {
    name: "FileTree",
    props: {
        items: Array
    },
    components: {
        FileTreeItem
    },
    computed: {
        files() {
            if (this.items) return this.items;
            return [];
        }
    }
}
</script>

<style scoped>
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
    padding: 0px !important;
}
</style>