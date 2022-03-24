<template>
  <v-snackbar
    v-model="isShowDocsSnackbar"
    class="mb-10 pb-6"
    bottom
    right
    color="warning darken-1"
    :min-width="250"
    :timeout="10000"
  >
    <span
    >✌🏻 Read:
      <a
        style="
          text-decoration: none;
          color: #fff;
          border-bottom: 1px dotted #fff;
        "
        target="_blank"
        rel="noopener"
        href="https://baking-bad.org/blog/2022/02/15/migrating-from-bcd-api-to-tzkt-api/"
      >How to migrate from BCD to TZKT API?</a
      ></span
    >
    <v-btn class="ml-2" small text @click="isShowDocsSnackbar = false">DONE</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "DocsSnackbar",
  data: () => ({
    isShowDocsSnackbar: true,
  }),
};
</script>
