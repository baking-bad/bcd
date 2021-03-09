<template>
  <span>
    <a
      v-for="(author, pos) in linkableNames"
      v-bind:key="getAuthorName(author) + `${pos}`"
      :href="getAuthorLink(author)"
      target="_blank"
      rel="noopener"
    >
      {{
        getAuthorName(author)
      }}
    </a>
    <span
      v-for="(author, pos) in unlinkableNames"
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
  computed: {
    linkableNames() {
      return this.value.filter(item => item.indexOf('<') !== -1)
    },
    unlinkableNames() {
      return this.value.filter(item => item.indexOf('<') === -1)
    }
  },
  methods: {
    isEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    getAuthorName(author) {
      const linkStart = author.indexOf('<') - 1;
      if (linkStart === -2) {
        return author
      }
      return author.substring(0, linkStart)
    },
    getAuthorLink(author) {
      const link = author.substring(author.indexOf('<') + 1, author.length - 1);
      if (this.isEmail(link)) {
        return `mailto:${link}`
      } else {
        return link;
      }
    }
  }
}
</script>
