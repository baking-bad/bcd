<template>
  <v-card flat class="mt-10 pa-10 d-flex flex-column align-center justify-center transparent">
    <v-icon size="85" class="text--disabled">{{ icon }}</v-icon>
    <span class="display-1 font-weight-light text--disabled">{{ title }}</span>
    <span v-if="!hasDescriptionSlot" class="body-1 font-weight-light text--secondary mt-1">{{ text }}</span>
    <slot v-else name="description" />
  </v-card>
</template>

<script>
export default {
  name: "EmptyState",
  props: {
    icon: String,
    title: String,
    text: String,
    htmlText: String
  },
  computed: {
    hasDescriptionSlot() {
      return !!this.$slots.description;
    }
  }
}
</script>