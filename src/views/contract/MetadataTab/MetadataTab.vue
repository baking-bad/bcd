<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card">
      <BriefInfo :metadata="metadata" />
      <ReservedFields
          v-if="availableReservedFields"
          class="mt-3"
          :metadata="reservedMetadata"
        />
      <FieldsWrapper
          v-if="unknownFields"
          class="mt-3"
          :metadata="otherMetadata"
          name="Other Fields"
          is-treeview
      />
      <EventsList
          v-if="metadata.events"
          :metadata="metadata"
      />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import BriefInfo from "@/views/contract/MetadataTab/ListBlocks/BriefInfo";
import FieldsWrapper from "@/views/contract/MetadataTab/CustomFields/FieldsWrapper";
import ReservedFields from "@/views/contract/MetadataTab/ListBlocks/ReservedFields";
import EventsList from "@/views/contract/MetadataTab/ListBlocks/EventsList";

export default {
  name: "Metadata",
  components: {EventsList, ReservedFields, FieldsWrapper, BriefInfo},
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
      const otherMetadata = {};
      this.unknownFields.forEach(key => otherMetadata[key] = this.metadata[key])
      return otherMetadata
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