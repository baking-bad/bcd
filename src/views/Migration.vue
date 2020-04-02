<template>
  <v-container fluid>
    <v-skeleton-loader :loading="loading" height="400" type="image" class="ma-3">
      <DiffViewer
        v-if="diff != null"
        :left="diff.left"
        :right="diff.right"
        :nameRight="diff.name_right"
        :nameLeft="diff.name_left"
        :added="diff.added"
        :removed="diff.removed"
      />
      <ErrorState v-else />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { getContractMigration } from "@/api/index.js";

import DiffViewer from "@/components/DiffViewer.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "Migration",
  components: {
    DiffViewer,
    ErrorState
  },
  created() {
    this.getMigration();
  },
  data: () => ({
    loading: true,
    diff: null
  }),
  methods: {
    ...mapActions(["showError"]),
    getMigration() {
      this.loading = true;
      getContractMigration(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.protocol
      )
        .then(res => {
          if (!res) return;
           this.diff = res;
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
