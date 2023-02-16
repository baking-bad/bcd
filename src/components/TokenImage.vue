<template>
    <div v-if="failed" class="d-flex flex-column justify-center align-center">
        <v-icon :color="errorColor" :size="size">{{ icon }}</v-icon>
        <span v-if="!errorHintDisabled" class="overline">Can't load image from thumbnail</span>
    </div>
    <v-img v-else @load="imageLoaded = true" :src="link" alt="Token picture" :height="size" :width="size" @error="failed = true">
        <template v-slot:placeholder>
            <v-sheet>
                <v-skeleton-loader type="image" tile :boilerplate="failed" elevation="0" :height="size" :width="size"/>
            </v-sheet>
        </template>
    </v-img>
</template>

<script>
export default {
    name: "TokenImage",
    props: {
        uri: String,
        size: Number,
        errorHintDisabled: Boolean,
        errorIcon: String,
        errorIconColor: String
    },
    computed: {
        icon() {
            if (this.errorIcon) {
                return this.errorIcon;
            }
            return 'mdi-alert-circle-outline';
        },
        errorColor() {
            if (this.errorIconColor) {
                return this.errorIconColor;
            }
            return 'tag';
        },
        link() {
            if (!this.uri || this.uri === '')  {
                return '';
            }

            try {
                let link = '';
                if (this.uri.startsWith('ipfs://')) {
                    link = `${this.config.IPFS_NODE}/ipfs/${this.uri.replace('ipfs://', '')}`;
                } else if (this.uri.startsWith('https://')) {
                    link = this.uri;
                } else {
                    return '';
                }
                return new URL(link).toString();
            } catch {
                return '';
            }
        }
    },
    data: () => {
        return {
            imageLoaded: false,
            failed: false
        }
    }
}
</script>