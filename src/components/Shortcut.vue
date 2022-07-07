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
      if (!this.str) return 0;

      if (this.str.startsWith("tz") || this.str.startsWith("KT")) {
        return 3;
      } else if (this.str.startsWith("o")) {
        return 1;
      } else if (this.str.startsWith("expr")) {
        return 4;
      }
      return 0;
    },
  },
};
</script>