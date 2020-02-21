<template>
  <v-container fluid>
    <DiffViewer
      v-if="!loading"
      :left="diffs.left"
      :right="diffs.right"
      :nameRight="diffs.name_right"
      :nameLeft="diffs.name_left"
      :added="diffs.added"
      :removed="diffs.removed"
    />
    <v-skeleton-loader v-else height="400" type="image" class="ma-3"></v-skeleton-loader>
  </v-container>
</template>

<script>
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
  async created() {
    this.diffs = await getContractMigration(
      this.$route.params.network,
      this.$route.params.address
    );
    this.loading = false;
  },
  data: () => ({
    diffs: null,
    loading: true
  }),
  watch: {
    $route: async function() {
      this.loading = true;
      this.diffs = await getContractMigration(
        this.$route.params.network,
        this.$route.params.address
      );
      this.loading = false;
    }
  }
};
</script>
