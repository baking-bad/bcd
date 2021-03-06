<template>
  <v-dialog
    class="raw-json-dialog"
    v-model="show"
    fullscreen
    scrollable
    persistent
    :retain-focus="false"
  >
    <v-card>
      <v-card-title class="sidebar py-2" primary-title>
        <span class="body-1 font-weight-medium text-uppercase text--secondary">
          Raw JSON:
          <span class="text--primary">{{ type }} </span>
        </span>
        <span
            v-if="isShowRenderingWarning"
            class="ml-3 text--uppercase text--secondary raw-json-dialog__warning"
        >
          Rendering in progress: Step {{renderingStep}} of 3
        </span>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="type === 'code'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-if="isCopiableOptions"
                text
                outlined
                v-bind="attrs"
                v-on="on"
                class="mr-4 text--secondary"
            >
              <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
            </v-btn>
            <v-btn
              text
              outlined
              v-bind="attrs"
              v-on="on"
              v-else
              v-clipboard="handleCopyClick"
              class="mr-4 text--secondary"
            >
              <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
            </v-btn>
          </template>
          <v-list v-if="isCopiableOptions">
            <v-list-item
              class="px-4"
              v-for="(item, index) in ['parameter', 'storage', 'code', 'all']"
              :key="index"
              @click="() => {}"
              v-clipboard="() => getSection(item)"
              v-clipboard:success="showClipboardOK"
            >
              <v-list-item-title class="text-capitalize">{{
                item
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          v-else
          class="mr-4 text--secondary"
          v-clipboard="() => JSON.stringify(data, null, '  ')"
          v-clipboard:success="showClipboardOK"
          text
        >
          <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
        </v-btn>
        <v-btn
          v-if="url"
          class="mr-4 text--secondary"
          :href="url"
          target="_blank"
          rel="nofollow noopener"
          text
        >
          <v-icon small class="mr-1">mdi-open-in-new</v-icon>In new tab
        </v-btn>
        <v-btn text @click="close"> <v-icon>mdi-close</v-icon>Close </v-btn>
      </v-card-title>
      <v-progress-linear
        absolute
        v-if="!loaded"
        indeterminate
        color="primary"
      ></v-progress-linear>
      <v-card-text class="data" style="max-height: calc(100% - 52px)">
        <vue-json-pretty
          class="raw-json-viewer"
          v-if="loaded"
          :data="data"
          :highlightMouseoverNode="true"
        ></vue-json-pretty>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import VueJsonPretty from "vue-json-pretty";

const BIG_SIZE_JSON_SYMBOLS = 10000;

export default {
  name: "RawJsonViewer",
  props: {
    show: Boolean,
    raw: Object,
    type: String,
    network: String,
    level: Number,
    address: String,
    hash: String,
    ptr: String,
    keyhash: String,
    isCopiableOptions: {
      type: Boolean,
      default: true
    }
  },
  components: {
    VueJsonPretty,
  },
  data: () => ({
    data: null,
    url: null,
    loaded: false,
    isShowRenderingWarning: false,
    isLastBigDataPushed: false,
    renderingStep: 1,
  }),
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    close() {
      this.$emit("update:show", false);
    },
    handleCopyClick() {
      if (!this.isCopiableOptions && this.raw) {
        return this.raw
      }
    },
    handleKeyUp(e) {
      if (e.key === "Escape"){
        this.close();
      }
    },
    reset() {
      this.loaded = false;
    },
    getSection(section = undefined) {
      if (section && Array.isArray(this.data)) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].prim === section) {
            return this.data[i];
          }
        }
      }
      return this.data;
    },
    loadCodePartially(data) {
      this.data = [data[0]];
      setTimeout(() => {
        this.data.push(data[1]);
        this.renderingStep = this.renderingStep + 1;
        setTimeout(() => {
          this.data.push(data[2]);
          this.renderingStep = this.renderingStep + 1;
          this.isLastBigDataPushed = true;
        }, 0);
      }, 0);
    },
  },
  beforeUpdate() {
    if (this.isLastBigDataPushed && this.isShowRenderingWarning) {
      this.isShowRenderingWarning = false;
      this.isLastBigDataPushed = false;
    }
  },
  mounted() {
    document.addEventListener('keyup', this.handleKeyUp);
  },
  destroyed() {
    document.addEventListener('keyup', this.handleKeyUp);
  },
  watch: {
    show(newValue) {
      if (!newValue) return;

      if (this.raw) {
        if (JSON.stringify(this.raw).length > BIG_SIZE_JSON_SYMBOLS) {
          this.isShowRenderingWarning = true;
          this.loadCodePartially(this.raw);
        } else {
          this.data = this.raw;
        }
        this.loaded = true;
        return;
      }

      if (this.loaded) return;

      let res = null;
      const level = this.level && this.level > 0 ? this.level : "head";

      if (this.type === "operation") {
          res = this.rpc.getOperation(this.network, level, this.hash);
      } else if (this.type === "big_map") {
        res = this.rpc.getBigMapValue(
          this.network,
          level,
          this.ptr,
          this.keyhash
        );
      } else if (this.type === "code") {
        res = this.rpc.getContractCode(this.network, level, this.address);
      } else if (this.type === "storage") {
        res = this.rpc.getContractStorage(this.network, level, this.address);
      } else {
        this.showError(`Unsupported type ${this.type}`);
      }

      res
        .then((r) => {
          const data = r.data.contents ? r.data.contents : r.data;
          if (JSON.stringify(r.data).length > BIG_SIZE_JSON_SYMBOLS) {
            this.isShowRenderingWarning = true;
            this.loadCodePartially(data);
          } else {
            this.data = data;
          }
          this.url = r.url;
          this.loaded = true;
        })
        .catch((err) => {
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
    keyhash: "reset",
  },
};
</script>

<style lang="scss">
@import '../../styles/vue-json-pretty.css';

.vjs-tree .vjs-value__string {
  color: var(--v-tree-base) !important;
}
.vjs-tree .vjs-tree__content.has-line {
  border-color: var(--v-border-base) !important;
}
.vjs-tree .is-mouseover {
  background-color: #99999920 !important;
}
.raw-json-viewer {
  background-color: transparent !important;
}
.raw-json-dialog__warning {
  font-size: 0.6em;
}
</style>
