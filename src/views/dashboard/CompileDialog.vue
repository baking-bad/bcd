<template>
  <v-dialog v-model="value" persistent>
    <v-card min-height="300" min-width="600">
      <v-card-title class="pa-0 pb-4">
        <v-toolbar flat>
          <v-toolbar-title>Build new contract</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <vue-dropzone
          :options="dropzoneOptions"
          ref="dropzone"
          id="customdropzone"
          useCustomSlot
          v-if="dropzoneOptions.url"
        >
          <div class="d-flex flex-column align-center justify-center" style="min-height: 300px">
            <v-icon class="text--secondary" size="60">mdi-cloud-upload-outline</v-icon>
            <div class="overline text--secondary">Drag'n drop or click to upload files</div>
            <div
              class="caption"
            >Maximum file size is {{ dropzoneOptions.maxFilesize }} MB. After you upload contract source files we'll compile it. After that you'll be able to deploy your contract to blockchain.</div>
          </div>
        </vue-dropzone>
      </v-card-text>
      <v-card-actions class="py-4 px-6">
        <v-spacer></v-spacer>
        <v-btn primary @click="onSubmit">Build</v-btn>
        <v-btn text @click="onClose">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

import { getJwt } from "@/utils/auth.js";

export default {
  name: "CompileDialog",
  props: {
    value: Boolean,
  },
  components: {
    vueDropzone: vue2Dropzone,
  },
  created() {
    this.dropzoneOptions.url = `${this.config.API_URI}profile/compilations/deploy`;
  },
  data: () => {
    return {
      dropzoneOptions: {
        autoProcessQueue: false,
        maxFilesize: 1,
        maxFiles: 10,
        parallelUploads: 10,
        headers: {
          Authorization: getJwt(),
        },
        uploadMultiple: true,
      },
    };
  },
  methods: {
    onClose() {
      this.$emit("input", false);
      this.$refs["dropzone"].removeAllFiles();
    },
    onSubmit() {
      this.$refs["dropzone"].processQueue();
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" scoped>
#customdropzone {
  background-color: transparent;
  border: 2px dashed lightgrey;
  border-radius: 5px;
  min-height: 300px;
}
</style>