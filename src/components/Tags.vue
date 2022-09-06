<template>
  <v-chip-group v-if="this.tags" active-class="primary--text" column>
      <v-chip disabled active small class="caption chip" v-for="(tag) in readable" :key="tag">{{ tag }}</v-chip>
  </v-chip-group>
</template>

<script>
const standards = {
  'fa2': "FA2",
  'fa1-2': "FA1.2",
  'fa1': "FA1",
  'delegator': "Delegator",
  'multisig': "Multisig",
  'sapling': "Sapling",
  'ledger': "Ledger",
  'CREATE_CONTRACT': "Contract factory",
  'SET_DELEGATE': "Delegatable",
  'upgradable': "Upgradable",
  'CHAIN_ID': "",
  'CHECK_SIGNATURE': "",
  'view_address': "",
  'view_balance_of': "",
  'view_nat': ""
};

export default {
  name: "Tags",
  props: {
    tags: Array,
  },
  computed: {
    readable() {
      if (this.tags) {
        let result = [];
        this.tags.forEach(tag => {
          let text = standards[tag];
          if (text) result.push(text)
        })
        return result;
      }
      return null;
    }
  }
}
</script>

<style scoped>
.chip {
  opacity: 1;
}
</style>