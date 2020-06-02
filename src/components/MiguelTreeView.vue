<template>
  <div>
    <v-treeview
      :items="tree"
      :open="openNodes"
      :active.sync="activeNodes"
      :open-all="openAll"
      hoverable
      transition
      activatable
      open-on-click
      return-object
    >
      <template v-slot:label="{ item }">
        <div :class="`${item.kind} pl-1`">
          <span
            class="key"
            :class="item.name.startsWith('@') ? 'text--secondary' : ''"
          >{{ item.name }}:</span>

          <v-btn
            v-if="hasAddress(item.name)"
            @click.prevent.stop="handleAddress(item.name)"
            target="_blank"
            tile
            x-small
            text
          >
            <v-icon class="accent--text" small>mdi-open-in-new</v-icon>
          </v-btn>
          <span class="ml-2" v-else></span>

          <template v-if="item.value_type === 'big_map'">
            <v-btn
              v-if="item.val && !diffMode"
              :to="{ path: `/${network}/big_map/${item.value}` }"
              outlined
              small
              color="accent"
              class="px-3 mb-1"
            >
              <v-icon class x-small left>mdi-vector-link</v-icon>
              <span class>Big Map {{ item.value }}</span>
            </v-btn>
            <template v-else>
              <span class="accent--text">big_map&nbsp;</span>
              <span v-if="item.children.length === 0" class="text--disabled">0 diffs</span>
              <span v-else :class="item.type">{{ item.value }}</span>
            </template>
          </template>

          <span v-else :class="item.type">{{ item.value }}</span>
        </div>
      </template>
    </v-treeview>
    <TreeNodeDetails v-model="showTreeNodeDetails" :data="active" :network="network" />
  </div>
</template>

<script>
import { getTree } from "@/utils/diff.js";
import TreeNodeDetails from "@/components/TreeNodeDetails.vue"

export default {
  name: "MiguelTreeView",
  components: {
    TreeNodeDetails
  },
  props: {
    miguel: Object,
    network: String,
    openAll: Boolean,
    diffMode: Boolean
  },
  data: () => ({
    showTreeNodeDetails: false,
    activeNodes: []
  }),
  computed: {
    tree() {
      return getTree(this.miguel, true);
    },
    openNodes() {
      return this.tree.map(x => this.getChangedItems(x), this).flat();
    },
    active() {
      if (this.activeNodes.length > 0) {
        return this.activeNodes[0];
      }
      return null;
    }
  },
  methods: {
    getChangedItems(item) {
      let res = item.children.map(x => this.getChangedItems(x), this).flat();
      if (item.kind || res.length > 0 || this.openAll) {
        res.push(item);
      }
      return res;
    },
    hasAddress(s) {
      if (s !== undefined && /(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/.test(s)) {
        return s.startsWith("KT") || this.tzkt.supports(this.network);
      }
      return false;
    },
    handleAddress(s) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith("KT")) {
        let routeData = this.$router.resolve({
          path: `/${this.network}/${address}`
        });
        window.open(routeData.href, "_blank");
      } else {
        let href = this.tzkt.resolve(this.network, address);
        window.open(href, "_blank");
      }
    }
  },
  watch: {
    active(newVal) {
      if (newVal !== null) this.showTreeNodeDetails = true;
    },
    showTreeNodeDetails(newVal) {
      if (!newVal) this.activeNodes = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.v-treeview-node__root {
  min-height: 20px !important;
}

.v-treeview {
  font-size: 14px;
  font-weight: 400;
  font-family: "Roboto Mono", monospace;

  .key {
    opacity: .8;
  }
  .value {
    color: var(--v-tree-base);
  }
  .object {
    opacity: .8;
    font-weight: 300;
  }

  .added-tree-item {
    background-color: #4caf5025;
    .value {
      color: var(--v-success-base);
    }
  }
  .removed-tree-item {
    background-color: #f4433625;
    .value {
      color: var(--v-error-base);
    }
  }
  .edited-tree-item {
    background-color: #ffc10725;
    .value {
      color: var(--v-warning-base);
    }
  }
}
</style>