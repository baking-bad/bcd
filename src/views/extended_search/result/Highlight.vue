<template>
    <div class="d-flex mx-4">
        <template v-for="(values, key) in highlights">
            <div :key="key" class="d-flex flex-column flex-child pr-1 mr-6 mb-4"
                v-if="!['alias',  'entrypoint', 'key_strings'].includes(key)">
                <span class="caption font-weight-medium text-uppercase">{{ key }}</span>
                <span v-for="(value, i) in values" :key="key + i">
                <span v-html="highlight(value)" class="body-2 text--primary"></span>
                </span>
            </div>
        </template>
    </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';

export default {
    name: "Highlight",
    props: {
        highlights: Object,
        words: Array,
    },
    methods: {
        highlight(s) {
            if (this.words === undefined) return s;
            for (var i = 0; i < this.words.length; i++) {
                let re = new RegExp(`(${this.words[i]})`, "gmi");
                s = sanitizeHtml(s.replace(re, "<span class='highlight'>$1</span>"));
            }
            return s;
        },
    }
}
</script>

<style scoped>
.highlight {
  font-weight: 500;
  font-style: italic;
}
.flex-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
