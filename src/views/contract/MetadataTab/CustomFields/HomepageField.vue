<template>
  <a :href="value" target="_blank" rel="noopener">
    {{ value }}
  </a>
</template>

<script>
export default {
  name: "HomepageField",
  props: {
    value: String,
  }
}
</script>
