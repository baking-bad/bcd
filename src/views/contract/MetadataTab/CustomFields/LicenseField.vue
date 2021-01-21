<template>
  <span :title="value.details">
    "{{ value.name }}"
  </span>
</template>

<script>
export default {
  name: "LicenseField",
  props: {
    value: Object,
  }
}
</script>
