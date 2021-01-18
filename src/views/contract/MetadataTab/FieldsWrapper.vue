<template>
  <v-list>
    <v-subheader class="title">{{ name }}</v-subheader>
    <v-list-item
        v-for="(field, idx) in metadata"
        :key="idx"
        selectable
    >
      <v-list-item-content class="pt-0 pb-0">
        <v-list-item-title class="overline">
          {{
            field.key
          }}:
          <span class="grey--text">
            {{ field.value }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "FieldsWrapper",
  props: {
    metadata: Object,
    name: String
  },
}
</script>

<style scoped>

</style>