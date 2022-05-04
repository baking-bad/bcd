<template>
  <div>
    <v-list-item-action v-if="tags">
      <v-list-item-action-text>
        <v-chip
          small
          class="caption"
          target="_blank"
        >{{ tags.text }}</v-chip
        >
      </v-list-item-action-text>
    </v-list-item-action>
  </div>
</template>

<script>
export default {
  name: "Tags",
  props: {
    contract: Object,
  },
  computed: {
    tags() {
      const standards = {
        fa2: "FA2",
        fa12: "FA1.2",
        fa1: "FA1",
        delegator: "Delegator",
        multisig: "Multisig",
      };
      if (this.contract && this.contract.tags) {
        for (var tag in standards) {
          if (this.contract.tags.includes(tag)) {
            return { tag, text: standards[tag] };
          }
        }
      }
      return null;
    }
  }
}
</script>

<style scoped>

</style>