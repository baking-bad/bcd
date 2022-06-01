<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card-heading, image">
      <div class="d-flex justify-end">
        <v-btn @click="showRaw = true" small text class="text--secondary">
          <v-icon class="mr-1" small>mdi-code-json</v-icon>
          <span>Raw JSON</span>
        </v-btn>
        <v-btn small text @click="downloadFile" class="text--secondary ml-2">
          <v-icon class="mr-1 text--secondary" small>mdi-download-outline</v-icon>
          <span>Download</span>
        </v-btn>
      </div>
      <v-card v-if="metadata" tile flat outlined class="pa-0 mt-2">
        <v-card-text class="pa-0 data">
          <ReservedFields
            v-if="availableReservedFields"
            :metadata="reservedMetadata"
            class="pr-8 pl-2"
          />
          <template v-if="unknownFields && unknownFields.length > 0">
              <v-divider></v-divider>
              <FieldsWrapper
                :fields="otherMetadata"
                class="pr-8 pl-2"
              />
          </template>
        </v-card-text>
      </v-card>      
      <RawJsonViewer
        :show.sync="showRaw"
        type="metadata"
        :raw="rawData"
    />
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import FieldsWrapper from "@/views/contract/MetadataTab/CustomFields/FieldsWrapper";
import ReservedFields from "@/views/contract/MetadataTab/ReservedFields";
import { mapActions } from "vuex";
import { applyStyles } from '@/utils/styles.js';
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer";

export default {
  name: "Metadata",
  components: { ReservedFields, FieldsWrapper, RawJsonViewer},
  props: {
    metadata: Object,
    network: String,
    address: String,
  },
  data: () => {
    return {
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
      if (this.metadata) {
        return this.reservedFields.filter(key => key in this.metadata);
      } else {
        return [];
      }
    },
    unknownFields() {
      if (this.metadata) {
        return Object.keys(this.metadata)
          .filter(key => -1 == [...this.reservedFields, ...this.ignoredKeys, 'views'].indexOf(key))
      } else {
        return [];
      }
    },
    reservedMetadata() {
      return this.availableReservedFields.map(key => ({key, value: this.metadata[key]}))
    },
    otherMetadata() {
      return this.unknownFields.map(key => ({key, value: this.metadata[key]}));
    },
    rawData() {
      if (this.metadata) {
        return Object.fromEntries(
          Object.entries(this.metadata)
            .filter(([key]) => -1 == this.ignoredKeys.indexOf(key)));
      } else {
        return {};
      }
    }
  },
  watch: {
    metadata: {
      deep: true,
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          await this.loadViewsSchema();
        }
      }
    },
  },
  methods: {
    ...mapActions(["showError"]),
    async loadViewsSchema() {
      if (this.network && this.address) {
        try {
          let views = await this.api.getMetadataViewsSchema(this.network, this.address);
          views.forEach(view => applyStyles(view.schema));
          this.views = views;
          console.log(views)
        } catch (err) {
          this.showError("Error while fetching off-chain views");
        }
      }
      this.loading = false;
    },
    downloadFile() {
      const element = document.createElement("a");
      element.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.rawData))
      );
      element.setAttribute("download", `${this.address}.json`);
      element.style.display = "none";
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    },
  },
};
</script>
