<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card">
      <BriefInfo :metadata="metadata" />
      <FieldsWrapper
          class="mt-3"
          v-if="availableReservedFields"
          :metadata="reservedMetadata"
          name="Reserved Fields"
      />
      <FieldsWrapper
          class="mt-3"
          v-if="unknownFields"
          :metadata="otherMetadata"
          name="Other Fields"
      />
      <EventsList class="mt-3" :metadata="metadata" />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import BriefInfo from "@/views/contract/MetadataTab/BriefInfo";
import EventsList from "@/views/contract/MetadataTab/EventsList";
import FieldsWrapper from "@/views/contract/MetadataTab/FieldsWrapper";

export default {
  name: "Metadata",
  components: {FieldsWrapper, EventsList, BriefInfo},
  props: { contract: Object },
  data: () => {
    return {
      metadata: {},
      loading: true,
      reservedFields: [
        'name',
        'description',
        'version',
        'license',
        'authors',
        'homepage',
        'source',
        'interfaces',
        'errors',
        'views'
      ],
    };
  },
  computed: {
    availableReservedFields() {
      return this.reservedFields.filter(field => field in this.metadata);
    },
    unknownFields() {
      return Object.keys(this.metadata).filter(key => !~this.reservedFields.indexOf(key))
    },
    reservedMetadata() {
      return this.availableReservedFields.map(key => ({key, value: this.metadata[key]}))
    },
    otherMetadata() {
      return this.unknownFields.map(key => ({key, value: this.metadata[key]}))
    },
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