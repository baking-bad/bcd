<template>
  <v-list>
    <v-subheader class="title">Other fields</v-subheader>
    <v-list-item
        v-for="(field, idx) in metadata"
        :key="idx"
        selectable
    >
      <v-list-item-content>
        <v-list-item-title class="overline">
          {{
            field.key
          }}:
          {{ field.value }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "OtherFields",
  props: {
    metadata: Object,
  },
}
</script>
