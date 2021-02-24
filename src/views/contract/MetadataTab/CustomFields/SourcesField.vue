<template>
  <a
    :href="value.location"
    target="_blank"
    res="noopener"
  >
    {{value.tools.join(',')}}
  </a>
</template>

<script>
export default {
  name: "SourcesField",
  props: {
    value: Object,
  }
}
</script>
