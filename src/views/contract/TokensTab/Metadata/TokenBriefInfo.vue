<template>
  <v-container class="pa-0">
    <v-list>
      <v-list-item selectable>
        <v-list-item-content>
          <v-list-item-title class="headline">
            <span v-if="token.name" :title="`name: ${token.name}`">
              {{ token.name }}
            </span>
      &nbsp;     <span v-else v-html="helpers.shortcut(token.contract)"></span>
          </v-list-item-title>
          <v-list-item-subtitle class="white-space-normal">
            {{ token.token_id }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="mt-0">
          <div class="d-flex flex-horizontal justify-center align-center">
            <v-btn
                class="mr-1 text--secondary"
                v-clipboard="() => token"
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
    </v-list>
    <RawJsonViewer
        :show.sync="showRaw"
        type="code"
        :raw="token"
        :is-copiable-options="false"
    />
  </v-container>
</template>

<script>
import RawJsonViewer from "@/components/RawJsonViewer";
import {mapActions} from "vuex";

export default {
  name: "TokenBriefInfo",
  components: {RawJsonViewer},
  props: {
    token: Object,
  },
  methods: {
    ...mapActions(["showClipboardFail", "showClipboardOK"]),
    downloadFile() {
      const element = document.createElement("a");
      element.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(this.token))
      );
      element.setAttribute("download", `${this.token.contract}-${this.token.token_id}-metadata.json`);
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

