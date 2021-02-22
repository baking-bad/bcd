<template>
  <a :href="value">
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
