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
      <ImplementationsList
          v-if="metadata.events"
          :implementsList="metadata.events"
          name="Events"
      />
      <ImplementationsList
          v-if="metadata.views && schema"
          :implementsList="metadata.views"
          :network="network"
          :address="address"
          name="Views"
          executable
      />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import BriefInfo from "@/views/contract/MetadataTab/ListBlocks/BriefInfo";
import FieldsWrapper from "@/views/contract/MetadataTab/CustomFields/FieldsWrapper";
import ReservedFields from "@/views/contract/MetadataTab/ListBlocks/ReservedFields";
import ImplementationsList from "@/views/contract/MetadataTab/ListBlocks/ImplementationsList";
import {mapActions} from "vuex";

export default {
  name: "Metadata",
  components: {ImplementationsList, ReservedFields, FieldsWrapper, BriefInfo},
  props: {
    contract: Object,
    network: String,
    address: String,
  },
  data: () => {
    return {
      metadata: {},
      schema: null,
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
  async mounted() {
    await this.checkMetadata(this.contract);
  },
  watch: {
    contract: {
      deep: true,
      immediate: true,
      async handler(value) {
        await this.checkMetadata(value);
      }
    },
  },
  methods: {
    ...mapActions(["showError"]),
    async checkMetadata(obj) {
      if ('metadata' in obj) {
        this.$set(this, 'metadata', obj.metadata);
        if (this.network && this.address) {
          try {
            const data = await this.api.getMetadataViewsSchema(this.network, this.address);
            this.$set(this, 'schema', data);
            this.putSchemaToViews();
          } catch (err) {
            this.showError("Error when getting views");
          }
        }
        this.loading = false;
      }
    },
    putSchemaToViews() {
      this.metadata.views.forEach(view => {
        const { name } = view;
        const relevantSchemas = this.schema.filter(schema => schema.name === name);
        relevantSchemas.forEach(relevantSchema => {
          const { implementation, schema, typedef } = relevantSchema;
          const key = Object.keys(view.implementations[implementation])[0];
          view.implementations[implementation][key].schema = schema;
          view.implementations[implementation][key].typedef = typedef;
        });
      })
    }
  },
};
</script>
