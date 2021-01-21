<template>
  <v-container class="pa-0">
    <v-list>
      <v-list-item v-if="metadata.name" selectable>
        <v-list-item-content>
          <v-list-item-title class="headline"
          ><span>{{ metadata.name }}</span
          >&nbsp;<span v-if="metadata.version" class="overline">{{
              metadata.version
            }}</span></v-list-item-title
          >
          <v-list-item-subtitle>{{
              metadata.description
            }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <div class="d-flex flex-horizontal justify-center align-center">
            <v-btn
                class="mr-1 text--secondary"
                v-clipboard="() => metadata"
                v-clipboard:success="showClipboardOK"
                v-clipboard:error="showClipboardFail"
                small
                text
            >
              <v-icon class="mr-1" small>mdi-content-copy</v-icon>
              <span>Copy</span>
            </v-btn>
            <v-btn @click="showRaw = true" small text class="text--secondary">
              <v-icon class="mr-1" small>mdi-code-json</v-icon>
              <span>Raw JSON</span>
            </v-btn>
            <v-btn small text @click="downloadFile" class="text--secondary ml-2">
              <v-icon class="mr-1 text--secondary" small>mdi-download-outline</v-icon>
              <span>Download</span>
            </v-btn>
          </div>
        </v-list-item-action>
      </v-list-item>
      <div class="pl-2 mb-4">
        <v-chip
            v-for="(i, idx) in metadata.interfaces"
            :key="idx"
            class="mx-2"
            disabled
            small
        >
          {{ i }}
        </v-chip>
      </div>
    </v-list>
    <RawJsonViewer
        :show.sync="showRaw"
        type="code"
        :raw="metadata"
        :is-copiable-options="false"
    />
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import RawJsonViewer from "@/components/RawJsonViewer";

export default {
  name: "BriefInfo",
  components: {RawJsonViewer},
  props: {
    metadata: Object,
  },
  methods: {
    ...mapActions(["showClipboardFail", "showClipboardOK"]),
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
  data() {
    return {
      showRaw: false,
    }
  }
}
</script>
