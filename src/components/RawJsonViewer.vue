<template>
  <v-dialog class="raw-json-dialog" v-model="show" fullscreen scrollable persistent :retain-focus="false">
    <v-card>
      <v-card-title class="sidebar py-2" primary-title>
        <span class="body-1 font-weight-medium text-uppercase text--secondary">
          Raw JSON:
          <span class="text--primary">{{ type }}</span>
        </span>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-4 text--secondary"
          v-clipboard="() => JSON.stringify(data, null, '  ')"
          v-clipboard:success="showClipboardOK"
          text
        >
          <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
        </v-btn>
        <v-btn text @click="close">
          <v-icon>mdi-close</v-icon>
          Close
        </v-btn>
      </v-card-title>
      <v-progress-linear absolute v-if="!loaded" indeterminate color="primary"></v-progress-linear>
      <v-card-text class="data" style="max-height: calc(100% - 52px);">
        <vue-json-pretty v-if="loaded" :data="data" :highlightMouseoverNode="true"></vue-json-pretty>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import VueJsonPretty from "vue-json-pretty";

export default {
  name: "RawJsonViewer",
  props: {
    show: Boolean,
    type: String,
    network: String,
    level: Number,
    address: String,
    hash: String,
    ptr: String,
    keyhash: String
  },
  components: {
    VueJsonPretty
  },
  data: () => ({
    data: null,
    loaded: false
  }),
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    close() {
      this.$emit("update:show", false);
    },
    reset() {
      this.loaded = false;
    }
  },
  watch: {
    show(newValue) {
      if (!newValue) return;
      if (this.loaded) return;

      let promise = null;
      const level = this.level && this.level > 0 ? this.level : "head";

      if (this.type === "operation") {
        promise = this.rpc.getOperation(this.network, level, this.hash);
      } else if (this.type === "big_map") {
        promise = this.rpc.getBigMapValue(
          this.network,
          level,
          this.ptr,
          this.keyhash
        );
      } else if (this.type === "code") {
        promise = this.rpc.getContractCode(this.network, level, this.address);
      } else if (this.type === "storage") {
        promise = this.rpc.getContractStorage(
          this.network,
          level,
          this.address
        );
      } else {
        this.showError(`Unsupported type ${this.type}`);
      }

      promise
        .then(res => {
          this.data = res;
          this.loaded = true;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    },
    type: "reset",
    network: "reset",
    level: "reset",
    address: "reset",
    hash: "reset",
    ptr: "reset",
    keyhash: "reset"
  }
};
</script>

<style>
.vjs-tree .vjs-value__string {
  color: var(--v-tree-base);
}
.vjs-tree .vjs-tree__content.has-line {
  border-color: var(--v-border-base) !important;
}
.vjs-tree .is-mouseover {
  background-color: #99999920 !important;
}
</style>