<template>
    <v-card class="ma-0 px-10 py-0 canvas" elevation="0">
        <v-card-text class="px-10">
            <v-row>
                <v-col cols="4" >
                    <TagsCombobox label="Tags" placeholder="Add some tags" v-model="filters.tags"/>
                </v-col>
                <v-col cols="4">
                    <TagsCombobox label="Mime type" placeholder="Add mime type" v-model="filters.mime_types" :items="mimeTypes"/>
                </v-col>
                <v-col cols="4">
                    <TagsCombobox label="Creators" placeholder="Add creators" v-model="filters.creators"/>
                </v-col>
                <v-col cols="4">
                    <TagsCombobox label="Minters" placeholder="Add minters" v-model="filters.minters"/>
                </v-col>
                <v-col cols="8">
                    <div class="d-flex">
                        <v-spacer/>
                        <v-btn text class="primary--text" @click="applyFilters" :disabled="isBtnDisabled">
                            Apply filters
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import TagsCombobox from './TagsCombobox.vue';

export default {
    name: "TokenFilters",
    props: {
        value: Object,
        search: String
    },
    components: {
        TagsCombobox
    },
    computed: {
        filters: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        isEmptyFilters() {
            return this.filters.tags.length === 0 &&
                this.filters.mime_types.length === 0 &&
                this.filters.creators.length === 0 &&
                this.filters.minters.length === 0
        }
    },
    data: () => {
        return {
            mimeTypes: [],
            isBtnDisabled: true
        }
    },
    created() {
        this.getMimeTypes();
    },
    methods: {
        applyFilters() {
            this.isBtnDisabled = true;
            this.$emit('applied')
        },
        removeTag(tag) {
            this.filters.tags.splice(this.filters.tags.indexOf(tag), 1)
        },
        getMimeTypes() {
            this.searchService.mimeTypes()
                .then(response => {
                    response.forEach(element => {
                        this.mimeTypes.push(element.name)
                    });
                })
                .catch(err => console.log(err))
        }
    },
    watch: {
        filters: {
            deep: true,
            handler: function() {
                if (this.isBtnDisabled) this.isBtnDisabled = false;
                if (this.search === '' || !this.search) {
                    if (this.isEmptyFilters) {
                        this.isBtnDisabled = true;
                    }
                }
            }
        },
        search(value) {
            if (value === '' || !value) {
                if (this.isEmptyFilters) {
                    this.isBtnDisabled = true;
                }
            }
        }
    }
}
</script>