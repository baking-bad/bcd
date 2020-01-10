<template>
  <v-container fluid>
    <v-navigation-drawer app fixed clipped width="400">
      <v-subheader class="text-uppercase">Project Contracts</v-subheader>
      <v-list two-line>
        <v-list-item-group v-model="selected">
          <template v-for="(item, index) in contracts">
            <ContractItem :item="item" :key="item.address" />
            <v-divider v-if="index + 1 < contracts.length" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer fixed absolute clipped right width="350" v-if="selectedContract != null">
      <ContractItem :item="selectedContract" />

      <v-list-item v-if="hasTags">
        <v-chip-group column>
          <v-chip v-for="tag in selectedContract.tags" :key="tag" small>{{ tag.replace('_', ' ') }}</v-chip>
        </v-chip-group>
      </v-list-item>

      <v-divider></v-divider>
      <InfoItem
        title="Creator"
        :subtitle="selectedContract.manager"
        v-if="selectedContract.manager"
      />
      <InfoItem
        title="Delegate"
        :subtitle="selectedContract.delegate"
        v-if="selectedContract.delegate"
      />
      <v-divider></v-divider>
      <InfoItem title="Balance" :subtitle="selectedContract.balance | uxtz" />
      <InfoItem title="Level" :subtitle="String(selectedContract.level)" />

      <v-btn color="primary" block text>
          View Entrypoints
      </v-btn>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import * as api from "@/api/index.js";
import InfoItem from "@/components/InfoItem.vue";
import ContractItem from "@/components/ContractItem.vue";

export default {
  name: "Project",
  components: {
    ContractItem,
    InfoItem
  },
  computed: {
    selectedContract() {
      if (
        this.selected == null ||
        this.selected == undefined ||
        this.selected < 0 ||
        this.contracts.length < 1
      ) {
        return null;
      }
      return this.contracts[this.selected];
    },
    hasTags() {
        return (this.selectedContract != null && this.selectedContract.tags !== undefined && this.selectedContract.tags.length > 0)
    }
  },
  data: () => ({
    contracts: [],
    selected: null
  }),
  created() {
    this.getProject(this.$route.params.address);
  },
  methods: {
    getProject(address) {
      api
        .getProject(address)
        .then(res => {
          this.contracts = res;
        })
        .catch(err => console.log(err));
    }
  },
  watch: {
    "$route.params.address": function(address) {
      this.getProject(address);
    }
  }
};
</script>
