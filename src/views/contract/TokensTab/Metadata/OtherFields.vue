<template>
  <v-list class="fields-wrapper pb-3" ref="list">
    <v-subheader class="title">Other Fields</v-subheader>
    <v-list-item>
      <v-treeview
        :items="treeview"
        hoverable
        transition
        open-on-click
        return-object
        class="no-arrow beautify-fonts"
      >
        <template v-slot:label="{ item }">
          <span class="key">
            {{item.name.split(':')[0].trim()}}:
          </span>
          <span :class="item.children ? 'value_white' : 'value'">
            {{ getValue(item.name, item.children) }}
          </span>
        </template>
      </v-treeview>
    </v-list-item>
  </v-list>
</template>

<script>
import { makeTreeview } from '@/utils/parsing';

export default {
  name: "OtherFields",
  props: {
    token: Object,
  },
  watch: {
    token(newVal) {
      this.treeview = makeTreeview(newVal);
    }
  },
  methods: {
    getValue(name, children) {
      if (children && children.length > 0) {
        return `object`;
      }
      return name.split(':')[1];
    }
  },
  data() {
    return {
      treeview: makeTreeview(this.token),
    }
  }
}
</script>
<style lang="scss">
.v-treeview {
  .key {
    color: #9e9e9e;
    font-size: 0.75rem;
  }
  .value {
    color: var(--v-tree-base);
    font-size: 0.75rem;
    &_white {
      font-size: 0.75rem;
      color: white;
    }
  }
  &.beautify-fonts {
    font-family: Monaco, Menlo, Consolas, Bitstream Vera Sans Mono, monospace;
  }
  &.no-arrow {
    .v-treeview-node__root {
      & > button.v-treeview-node__toggle {
        opacity: 0 !important;
      }
    }
    .v-treeview-node__content {
      margin-left: -30px !important;
    }
  }
}
</style>
