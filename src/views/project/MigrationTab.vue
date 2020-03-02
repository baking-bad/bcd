<template>
  <v-container fluid>
    <DiffViewer
      v-if="!loading"
      :left="contract.migration.left"
      :right="contract.migration.right"
      :nameRight="contract.migration.name_right"
      :nameLeft="contract.migration.name_left"
      :added="contract.migration.added"
      :removed="contract.migration.removed"
    />
    <v-skeleton-loader v-else height="400" type="image" class="ma-3"></v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { getContractMigration } from "@/api/index.js";

import DiffViewer from "@/components/DiffViewer.vue";

export default {
  name: "MigrationTab",
  props: {
    contract: Object
  },
  components: {
    DiffViewer
  },
  created() {
    this.getMigration();
  },
  data: () => ({
    loading: true
  }),
  methods: {
    ...mapActions(["showError"]),
    getMigration() {
      if (this.contract == null) return;
      if (this.contract.migration !== undefined) {
        this.loading = false;
        return;
      }
      this.loading = true;
      getContractMigration(
        this.$route.params.network,
        this.$route.params.address
      )
        .then(res => {
          this.contract.migration = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    }
  },
  watch: {
    contract: "getMigration"
  }
};
</script>
