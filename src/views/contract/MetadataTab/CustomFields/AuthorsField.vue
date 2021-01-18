<template>
  <span>
    <a
        v-for="author in value"
        v-bind:key="getAuthorName(author)"
        :href="getAuthorLink(author)"
    >
      {{
        getAuthorName(author)
      }}
    </a>
  </span>
</template>

<script>
export default {
  name: "AuthorsField",
  props: {
    value: Array,
  },
  methods: {
    isEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    getAuthorName(author) {
      return author.substring(0, author.indexOf('<') - 1)
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
