<template>
  <v-list class="pb-4">
    <v-subheader class="title">Reserved Fields</v-subheader>
    <v-list-item
        v-for="(field, idx) in token"
        :key="idx"
        selectable
    >
      <v-list-item-content class="pt-1 pb-0 pl-1">
        <v-list-item-title class="d-flex">
          <span class="key-field">
            {{
              idx
            }}:
          </span>
          <span class="value-field ml-3">
            {{ field }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "ReservedFields",
  props: {
    token: Object,
  },
}
</script>

<style lang="scss" scoped>
.v-list-item {
  min-height: 1.25rem;
  font-family: Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;
  .key-field,
  .value-field {
    font-size: 0.75rem;
  }
  .key-field {
    color: #9e9e9e;
  }
  .value-field {
    white-space: normal;
    color: var(--v-tree-base);
  }
}
</style>
