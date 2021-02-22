<template>
  <a
    :href="value.location"
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
