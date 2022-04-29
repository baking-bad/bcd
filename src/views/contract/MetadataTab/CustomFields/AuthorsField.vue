<template>
  <span>
    <span
      v-for="(author, pos) in value"
      v-bind:key="getAuthorName(author) + `${pos * -1}`"
    >
      {{getAuthorName(author)}}
    </span>
  </span>
</template>

<script>
export default {
  name: "AuthorsField",
  props: {
    value: Array,
  },
  methods: {
    getAuthorName(author) {
      const linkStart = author.indexOf('<') - 1;
      if (linkStart === -2) {
        return author
      }
      return author.substring(0, linkStart)
    },
  }
}
</script>
