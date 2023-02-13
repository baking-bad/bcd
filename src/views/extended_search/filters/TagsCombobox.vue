<template>
    <v-combobox
        v-model="tags"
        hide-details
        hide-selected
        :items="items"
        :placeholder="placeholder"
        multiple
        outlined
        clearable
        dense
        rounded
        persistent-hint
        small-chips
        :loading="loading"
    >
        <template v-slot:no-data>
            <v-list-item>
            <v-list-item-content>
                <v-list-item-title>Press <kbd>enter</kbd> to create a new one</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </template>
        <template v-slot:selection="{ attrs, item, selected }">
            <v-chip
                v-bind="attrs"
                class="chip tag"
                :input-value="selected"
                close
                close-icon="mdi-close"   
                small
                active
                @click:close="removeTag(item)"
                >
                <span class="caption" style="opacity: 0.7">{{ item }}</span>
            </v-chip>
        </template>
    </v-combobox>
</template>

<script>
export default {
    name: "TagsCombobox",
    props: {
        value: Array,
        label: String,
        placeholder: String,
        items: Array
    },
    computed: {
        tags: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        loading() {
            return this.items && this.items.length === 0;
        }
    },
    methods: {
        removeTag(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1)
        }

    }
}
</script>

<style>

</style>