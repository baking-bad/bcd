<template>
  <v-list class="fields-wrapper pb-3" ref="list">
    <v-subheader class="title">Token Info</v-subheader>
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
          <div @click="showTreeInfo(item)">
            <span class="key">
              {{item.name.split(':')[0].trim()}}:
            </span>
            <span :class="item.children ? 'value_white' : 'value'">
              {{ getValue(item.name, item.children) }}
            </span>
          </div>
        </template>
      </v-treeview>
    </v-list-item>
    <TreeNodeDetails
        v-model="showTreeNodeDetails"
        :data="dataTreeNode"
        :network="'delphinet'"
    />
  </v-list>
</template>

<script>
import { makeTreeview } from '@/utils/parsing';
import TreeNodeDetails from "@/components/TreeNodeDetails";

export default {
  name: "OtherFields",
  components: {TreeNodeDetails},
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
    },
    showTreeInfo(item) {
      if (item.children) {
        return;
      }

      const splittedItem = item.name.split(':');
      const name = splittedItem[0].trim();
      const value = splittedItem[1].trim();
      this.dataTreeNode.val = value;
      this.dataTreeNode.name = name;
      this.dataTreeNode.realPrim = name;
      this.showTreeNodeDetails = true;
    }
  },
  data() {
    return {
      treeview: makeTreeview(this.token),
      showTreeNodeDetails: false,
      dataTreeNode: {
        val: '',
        name: '',
        realPrim: '',
      }
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
