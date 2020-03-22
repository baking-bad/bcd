<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <div v-else-if="contract.code">
      <v-toolbar flat class="mb-2 transparent">
        <v-spacer></v-spacer>
        <v-btn small text class="toolbar-btn" @click="downloadFile">
          <v-icon>mdi-download-outline</v-icon>
          <span>Download</span>
        </v-btn>
      </v-toolbar>
      <v-card tile>
        <Michelson :code="contract.code"></Michelson>
      </v-card>
    </div>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import Michelson from "@/components/Michelson.vue"
import { mapActions } from "vuex";
import { getContractCode } from "@/api/index.js";
import ErrorState from "@/components/ErrorState.vue";

export default {
  props: {
    contract: Object
  },
  components: {
    ErrorState,
    Michelson
  },
  data: () => ({
    loading: true
  }),
  created() {
    this.getCode();
  },
  methods: {
    ...mapActions(["showError"]),
    getCode() {
      if (this.contract == null) return;
      if (this.contract.code !== undefined) {
        this.loading = false;
        return;
      }
      getContractCode(this.contract.network, this.contract.address)
        .then(res => {
          this.contract.code = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    downloadFile() {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(this.contract.code)
      );
      element.setAttribute("download", this.contract.address + ".tz");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  },
  watch: {
    contract: "getCode"
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>