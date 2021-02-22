<template>
  <span>
    <vue-json-pretty
        :data="value"
        :deep="1"
    />
  </span>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  name: "ErrorsField",
  components: {
    VueJsonPretty,
  },
  props: {
    value: Array,
  },
}
</script>
