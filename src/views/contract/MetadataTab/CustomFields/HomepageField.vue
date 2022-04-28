<template>
  <a :href="value" target="_blank" rel="noopener">

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
