<template>
  <v-list class="data" ref="list">
    <h2 class="ml-4 my-4 hash font-weight-regular text--secondary">
      <span>Extra fields</span>
    </h2>
    <v-list-item
        v-for="(field, idx) in fields"
        :key="idx"
        selectable
    >
    <v-list-item-content class="pt-0">
      <v-row no-gutters>
        <v-col cols="2">
          <span class="key-field">
          {{
            field.key
          }}:
        </span>
        </v-col>
        <v-col>
          <vue-json-pretty
            class="value-field"
            :data="field.value"
            :deep="1"
        />
        </v-col>
      </v-row>
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
    fields: Array,
    isTreeview: {
      type: Boolean,
      default: false,
    },
    name: String
  },
  components: {
    VueJsonPretty,
  },
}
</script>

<style lang="scss" scoped>
.v-list-item {
  min-height: 1.25rem;
  font-family: Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;
  .key-field {
    color: #9e9e9e;
    line-height: 1.2rem;
  }
  .value-field {
    white-space: normal;
    line-height: 1.2rem;
  }
}
</style>