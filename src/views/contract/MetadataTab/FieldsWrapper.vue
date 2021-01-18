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
          <span class="grey--text" v-if="typeof field.value !== 'object'">
            {{ field.value }}
          </span>
          <vue-json-pretty v-else :data="field.value"/>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  name: "FieldsWrapper",
  props: {
    metadata: Array,
    name: String
  },
  components: {
    VueJsonPretty,
  },
}
</script>

<style scoped>

</style>