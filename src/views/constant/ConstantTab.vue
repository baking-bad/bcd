<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col cols="3" class="pt-0 pl-0">
        <ReferenceContract :network="network"/>
      </v-col>
      <v-col cols="6" class="pt-0 px-8">
        <div class="d-flex justify-end mt-2">
          <v-spacer></v-spacer>
          <v-btn
              class="mr-1 text--secondary"
              v-clipboard="getValueToCopy"
              v-clipboard:success="showSuccessCopy"
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
        <v-card tile flat outlined class="pa-0 mt-2">
          <v-card-text class="pa-0">
            <Michelson :code="constantInfo.code"></Michelson>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3" class="pt-0 pl-0">
        <ConstantInfo :contract-info-items="constantInfoItems" :loading="loading"/>
      </v-col>
    </v-row>
    <RawJsonViewer
        :raw="constantInfo.value"
        :show.sync="showRaw"
        type="code"
        :network="network"
        :address="address"
        :level="0"/>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import ConstantInfo from "./ConstantInfo";
import ReferenceContract from "@/views/constant/ReferenceContract";
import Michelson from "@/components/Michelson";
import {toTitleCase} from "@/utils/string";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";
import {downloadFileFormContent} from "@/utils/download";

export default {
  name: "NetworkTab",
  props: {
    network: String,
    address: String,
  },
  components: {
    Michelson,
    ReferenceContract,
    ConstantInfo,
    RawJsonViewer
  },
  data: () => ({
    loading: true,
    constantInfo: {},
    series: {},
    showRaw: false
  }),
  computed: {
    constantInfoItems() {
      const items = ['address', 'timestamp', 'level'];

      return items.map((item) => ({
        value: this.constantInfo[item],
        label: toTitleCase(item)
      }))
    }
  },
  methods: {
    ...mapActions(["showClipboardOK", "showClipboardWarning"]),
    async getConstantInfo() {
      this.loading = true;
      this.constantInfo = await this.api.getConstant(this.$route.params.network, this.$route.params.address);
      this.loading = false;
    },
    getValueToCopy() {
      return this.constantInfo.code;
    },
    showSuccessCopy() {
      if (this.constantInfo.code.length) {
        this.showClipboardOK();
      }
    },
    downloadFile() {
      downloadFileFormContent(this.constantInfo.code, this.$route.params.address)
    },
  },
  watch: {
    network: {
      handler() {
        this.getConstantInfo();
      },
      immediate: true
    }
  }
};
</script>

<style>
.v-timeline-item__dot {
  background-color: var(--v-data-base) !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
