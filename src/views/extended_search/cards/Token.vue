<template>
    <v-card class="mx-auto sticky-card" outlined :loading="loading">
        <v-card-text>
            <v-list>
                <v-list-item two-line class="px-3 pt-0">
                    <v-list-item-avatar size="75" tile>
                        <keep-alive>
                            <TokenImage v-if="item.body.ThumbnailURI" :uri="item.body.ThumbnailURI" :size="75" error-icon-color="white" error-icon="mdi-circle-multiple-outline" error-hint-disabled/>
                            <v-icon v-else size="75">mdi-circle-multiple-outline</v-icon>
                        </keep-alive>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text-h4 text--primary">{{ item.body.Name ? $sanitize(item.body.Name) : info.TokenID }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="secondary--text overline">{{ item.body.Network }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn color="primary" target="_blank" :to="link" text small>Token page</v-btn>
                    </v-list-item-action>
                </v-list-item>
                
                <v-chip-group v-if="tags" active-class="primary--text" class="mx-3 mt-3" column>
                    <v-chip disabled active small class="caption chip" v-for="(tag, idx) in tags" :key="idx">{{ $sanitize(tag) }}</v-chip>

                    <v-chip v-if="hiddenTagsCount > 0" outlined small class="caption chip" @click="showAllTags = !showAllTags">
                        {{ showAllTags ? 'hide tags' : `+ ${hiddenTagsCount} others` }}
                    </v-chip>
                </v-chip-group>

                <v-list-item two-line v-if="item.body.Description">
                    <v-list-item-content>
                        <span class="hash sub-text v-list-item__action-text">{{ $sanitize(item.body.Description) }}</span>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="item.body.Symbol">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Symbol</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ $sanitize(item.body.Symbol) }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line :to="`/${item.body.Network}/${item.body.Address}`">
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

                <v-list-item two-line v-if="item.body.Minter">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Minter</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="hash">{{ $sanitize(item.body.Minter) }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="hasCreators">
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="overline">Creators</span>
                        </v-list-item-title>
                        <p class="hash sub-text v-list-item__action-text mt-1" v-for="(creator, idx) in item.body.Creators" :key="idx">{{ $sanitize(creator) }}</p>
                    </v-list-item-content>
                </v-list-item>

                <div class="mx-3" v-if="hasFiles">
                    <FileTree :items="item.body.Formats"/>
                </div>
            </v-list>
        </v-card-text>
        <v-card-actions class="pl-8 mb-4 mt-0 pt-0">
            <v-btn color="primary" target="_blank" outlined small :to="link">
                Token page
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import TokenImage from '@/components/TokenImage.vue';
import FileTree from './FileTree.vue';

const SHOW_TAGS_COUNT = 15;

export default {
    name: "TokenCard",
    props: {
        item: Object
    },
    components: {
        TokenImage,
        FileTree
    },
    computed: {
        link() {
            return `/${this.item.body.Network}/${this.item.body.Address}/tokens?search=${this.item.body.TokenID}`
        },
        hasFiles() {
            return this.item.body.Formats && Array.isArray(this.item.body.Formats);
        },
        hasCreators() {
            return this.item.body.Creators && Array.isArray(this.item.body.Creators);
        }, 
        tags() {
            if (!this.item.body.Tags) return;
            if (!Array.isArray(this.item.body.Tags)) return;

            if (this.showAllTags) return this.item.body.Tags;
            return this.item.body.Tags.slice(0, SHOW_TAGS_COUNT - 3);
        },
        hiddenTagsCount() {
            if (this.item.body.Tags.length < SHOW_TAGS_COUNT) return 0;
            return this.item.body.Tags.length - SHOW_TAGS_COUNT +    3;
        }
    },
    data: () => ({
        loading: false,
        showAllTags: false
    }),
    methods: {
        getIPFS(url) {
            if (!url) {
                return '';
            }

            let result = `${this.config.IPFS_NODE}/ipfs/${url.replace('ipfs://', '')}`;
            try {
                return new URL(result).toString();
            } catch (_) {
                return '';
            }
        }
    }
}
</script>

<style>
.sub-text {
    line-height: 1.2rem !important;
    font-size: 0.875rem !important;
}

.sticky-card {
  position: sticky;
  top: 200px;
  max-height: 72vh;
  overflow-y: auto;
}
</style>