<template>
  <v-list class="fields-wrapper" ref="list">
    <v-subheader class="title">{{ name }}</v-subheader>
    <v-list-item v-if="isTreeview">
      <vue-json-pretty
          :data="metadata"
          :deep="1"
      />
    </v-list-item>
    <v-list-item
        v-else
        v-for="(field, idx) in metadata"
        :key="idx"
        selectable
    >
      <v-list-item-content class="pt-0 pb-0">
        <v-list-item-title class="overline d-flex">
          <span>
            {{
              field.key
            }}:
          </span>
          <span class="grey--text ml-3" v-if="typeof field.value !== 'object'">
            {{ field.value }}
          </span>
          <vue-json-pretty
              v-else
              class="ml-3"
              :data="field.value"
              :deep="0"
          />
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

<style lang="scss">
.fields-wrapper {
  .v-list-item {
    min-height: 32px;
  }
  .vjs-tree {
    font-size: 0.75rem;
    color: #9e9e9e;
  }
}
</style>