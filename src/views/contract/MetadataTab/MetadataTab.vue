<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card">
      <BriefInfo :metadata="metadata" />
      <ReservedFields class="mt-3" :metadata="metadata" />
      <EventsList class="mt-3" :metadata="metadata" />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import BriefInfo from "@/views/contract/MetadataTab/BriefInfo";
import ReservedFields from "@/views/contract/MetadataTab/ReservedFields";
import EventsList from "@/views/contract/MetadataTab/EventsList";

export default {
  name: "Metadata",
  components: {EventsList, ReservedFields, BriefInfo},
  props: { contract: Object },
  data: () => {
    return {
      metadata: {},
      loading: true,
    };
  },
  mounted() {
    if (this.contract.metadata !== undefined) {
      this.loading = false;
      this.metadata = this.contract.metadata;
    }
  },
  watch: {
    contract: {
      deep: true,
      handler: function (value) {
        if (value.metadata !== undefined) {
          this.metadata = value.metadata;
          this.loading = false;
        }
      },
    },
  },
};
</script>