<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card-heading, image">
      <v-card v-if="metadata" tile flat outlined class="pa-0">
        <v-card-title class="d-flex sidebar px-4 py-3">
          <h4 class="font-weight-regular text--secondary">Contract metadata</h4>
          <v-spacer></v-spacer>
          <v-btn @click="showRaw = true" small text class="text--secondary">
            <v-icon class="mr-1" small>mdi-code-json</v-icon>
            <span>Raw JSON</span>
          </v-btn>
          <v-btn small text @click="downloadFile" class="text--secondary ml-2">
            <v-icon class="mr-1 text--secondary" small>mdi-download-outline</v-icon>
            <span>Download</span>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0 data">
          <ReservedFields
            v-if="availableReservedFields"
            :metadata="reservedMetadata"
            class="pr-8"
          />
          <template v-if="metadata.views && metadata.views.length > 0">
              <v-divider></v-divider>
              <OffchainViews
                :views="views"
                :network="network"
                :address="address"
                class="pr-8 py-8"
            />
          </template>
          <template v-if="unknownFields && unknownFields.length > 0">
              <v-divider></v-divider>
              <FieldsWrapper
                :metadata="otherMetadata"
                class="pr-8"
              />
          </template>
        </v-card-text>
      </v-card>      
      <RawJsonViewer
        :show.sync="showRaw"
        type="metadata"
        :raw="metadata"
    />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import FieldsWrapper from "@/views/contract/MetadataTab/CustomFields/FieldsWrapper";
import ReservedFields from "@/views/contract/MetadataTab/ReservedFields";
import OffchainViews from "@/views/contract/MetadataTab/OffchainViews";
import {mapActions} from "vuex";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer";

export default {
  name: "Metadata",
  components: {OffchainViews, ReservedFields, FieldsWrapper, RawJsonViewer},
  props: {
    contract: Object,
    network: String,
    address: String,
  },
  data: () => {
    return {
      metadata: {},
      views: [],
      loading: true,
      showRaw: false,
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
      ],
      ignoredKeys: [
        'level',
        'timestamp',
        'address',
        'network',
        'slug'
      ]
    };
  },
  computed: {
    availableReservedFields() {
      return this.reservedFields.filter(key => key in this.metadata);
    },
    unknownFields() {
      return Object.keys(this.metadata)
        .filter(key => !~this.reservedFields.indexOf(key) && !~this.ignoredKeys.indexOf(key))
    },
    reservedMetadata() {
      return this.availableReservedFields.map(key => ({key, value: this.metadata[key]}))
    },
    otherMetadata() {
      return this.unknownFields.map(key => ({key, value: this.metadata[key]}));
    },
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
        this.metadata = obj.metadata;
        if (this.network && this.address) {
          try {
            this.views = await this.api.getMetadataViewsSchema(this.network, this.address);
          } catch (err) {
            this.showError("Error while fetching off-chain views");
          }
        }
        this.loading = false;
      }
    },
    downloadFile() {
      const element = document.createElement("a");
      element.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.metadata))
      );
      element.setAttribute("download", `${this.metadata.name}-metadata.json`);
      element.style.display = "none";
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    },
  },
};
</script>
