<template>
  <v-card flat :class="color || 'transparent'" class="mt-10 pa-10 d-flex flex-column align-center justify-center">
    <v-icon size="85" class="text--disabled">{{ icon }}</v-icon>
    <span class="display-1 font-weight-light text--disabled">{{ title }}</span>
    <span v-if="!htmlText" class="body-1 font-weight-light text--secondary mt-1">{{ text }}</span>
    <span v-else v-html="htmlText"></span>
  </v-card>
</template>

<script>
export default {
  name: "EmptyState",
  props: {
    icon: String,
    title: String,
    text: String,
    htmlText: String,
    color: String
  }
}
</script>