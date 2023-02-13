<template>
    <v-list-item :href="$sanitize(link)" target="_blank" rel="nofollow noopener" two-line class="ma-0">
        <v-list-item-avatar>
            <v-icon>{{ icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title>{{ name }}</v-list-item-title>
            <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
import { humanFileSize } from '@/utils/number.js';

const mimeTypes = {
    'image/png': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/jpeg': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/jpg': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/bmp': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/tiff': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/webp': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/svg+xml': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'image/avif': {
        icon: 'mdi-image-frame',
        name: 'image'
    },
    'audio/mpeg': {
        icon: 'mdi-music',
        name: 'music'
    },
    'audio/flac': {
        icon: 'mdi-music',
        name: 'music'
    },
    'audio/ogg': {
        icon: 'mdi-music',
        name: 'music'
    },
    'audio/wav': {
        icon: 'mdi-music',
        name: 'music'
    },
    'audio/x-wav': {
        icon: 'mdi-music',
        name: 'music'
    },
    'video/mp4': {
        icon: 'mdi-video-outline',
        name: 'video'
    },
    'video/webm': {
        icon: 'mdi-video-outline',
        name: 'video'
    },
    'video/ogg': {
        icon: 'mdi-video-outline',
        name: 'video'
    },
    'video/avi': {
        icon: 'mdi-video-outline',
        name: 'video'
    },
    'video/quicktime': {
        icon: 'mdi-video-outline',
        name: 'video'
    },
    'text/html': {
        icon: 'mdi-file-code-outline',
        name: 'HTML page'
    },
    'text/markdown': {
        icon: 'mdi-file-code-outline',
        name: 'Markdown'
    },
    'application/xml': {
        icon: 'mdi-file-code-outline',
        name: 'XML file'
    },
    'application/json': {
        icon: 'mdi-code-json',
        name: 'JSON file'
    },
    'application/x-directory': {
        icon:'mdi-folder-outline',
        name: 'folder'
    },
    'application/pdf': {
        icon: 'mdi-file-pdf-box',
        name: 'PDF file'
    },
    'application/zip': {
        icon: 'mdi-zip-box-outline',
        name: 'ZIP archive'
    },
    'model/gltf-binary': {
        icon: 'mdi-video-3d',
        name: '3D content'
    }
}

const DEFAULT_MIME_TYPE = {
    icon: 'mdi-file-outline',
    name: 'file'
}

export default {
    name: "FileTreeItem",
    props: {
        file: Object
    },
    computed: {
        icon() {
            if (!this.file.mimeType || typeof this.file.mimeType !== 'string')
                return DEFAULT_MIME_TYPE.icon;
            
            const data = mimeTypes[this.file.mimeType];
            if (data) {
                return data.icon;
            }
            
            return DEFAULT_MIME_TYPE.icon;
        },
        name() {
            if (this.file.fileName) return this.$sanitize(this.file.fileName);
            if (this.file.uri) return this.$sanitize(this.file.uri);

            const data = mimeTypes[this.file.mimeType];
            if (data) {
                return data.name;
            }

            return DEFAULT_MIME_TYPE.name;
        },
        link() {
            if (!this.file.uri || this.file.uri === '')  {
                return '';
            }

            try {
                let link = '';
                if (this.file.uri.startsWith('ipfs://')) {
                    link = `${this.config.IPFS_NODE}/ipfs/${this.file.uri.replace('ipfs://', '')}`;
                } else if (this.file.uri.startsWith('https://')) {
                    link = this.file.uri;
                } else {
                    return '';
                }
                return new URL(link).toString();
            } catch {
                return '';
            }
        },
        subtitle() {
            let subtitle = [];
            if (this.file.fileSize && typeof this.file.fileSize === 'number') 
                subtitle.push(humanFileSize(this.file.fileSize));
            if (this.file.duration && typeof this.file.duration === 'string') 
                subtitle.push(this.$sanitize(this.file.duration))
            if (this.file.dataRate) {
                if (this.file.dataRate.value)
                    subtitle.push(`${this.file.dataRate.value} ${this.$sanitize(this.file.dataRate.unit)}`)
            }
            if (this.file.dimensions) {
                if (this.file.dimensions.value && this.file.dimensions.value !== '')
                    subtitle.push(`${this.$sanitize(this.file.dimensions.value)} ${this.$sanitize(this.file.dimensions.unit)}`)
            }
            return subtitle.join(' - ');
        }
    }
}
</script>