<template>
  <span>
    <span class="font-weight-light">{{ str.slice(0, head) }}</span>{{ str.slice(head, head + tail) }}<v-icon>mdi-dots-horizontal</v-icon>{{ str.slice(str.length - tail) }}
  </span>
</template>


<script>
export default {
  name: "Shortcut",
  props: {
    str: String,
  },
  data() {
    return {
      tail: 4,
    };
  },
  computed: {
    head() {
      if (!this.str) return "";

      let head = 0;
      if (this.str.startsWith("tz") || this.str.startsWith("KT")) {
        head = 3;
      } else if (this.str.startsWith("o")) {
        head = 1;
      } else if (this.str.startsWith("expr")) {
        head = 4;
      }
      return head;
    },
  },
};
</script>

<style scoped>

</style>
