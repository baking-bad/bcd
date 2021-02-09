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
          <span class="text--primary">{{ type }}</span>
        </span>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="type === 'code'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              outlined
              v-bind="attrs"
              v-on="on"
              class="mr-4 text--secondary"
            >
              <v-icon small class="mr-1">mdi-content-copy</v-icon>Copy
            </v-btn>
          </template>
          <v-list>
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
  },
  components: {
    VueJsonPretty,
  },
  data: () => ({
    data: null,
    url: null,
    loaded: false,
  }),
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    close() {
      this.$emit("update:show", false);
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
  },
  watch: {
    show(newValue) {
      if (!newValue) return;

      if (this.raw) {
        this.data = this.raw;
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
          this.data = r.data;
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

<style>
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

.vjs-checkbox{position:absolute;left:-30px;color:#1f2d3d;user-select:none}.vjs-checkbox.is-checked .vjs-checkbox__inner{background-color:#1890ff;border-color:#0076e4}.vjs-checkbox.is-checked .vjs-checkbox__inner:after{transform:rotate(45deg) scaleY(1)}.vjs-checkbox .vjs-checkbox__inner{display:inline-block;position:relative;border:1px solid #bfcbd9;border-radius:2px;vertical-align:middle;box-sizing:border-box;width:16px;height:16px;background-color:#fff;z-index:1;cursor:pointer;transition:border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)}.vjs-checkbox .vjs-checkbox__inner:after{box-sizing:content-box;content:"";border:2px solid #fff;border-left:0;border-top:0;height:8px;left:4px;position:absolute;top:1px;transform:rotate(45deg) scaleY(0);width:4px;transition:transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;transform-origin:center}.vjs-checkbox .vjs-checkbox__original{opacity:0;outline:none;position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;margin:0}.vjs-radio{position:absolute;left:-30px;color:#1f2d3d;user-select:none}.vjs-radio.is-checked .vjs-radio__inner{background-color:#1890ff;border-color:#0076e4}.vjs-radio.is-checked .vjs-radio__inner:after{transform:translate(-50%,-50%) scale(1)}.vjs-radio .vjs-radio__inner{border:1px solid #bfcbd9;border-radius:100%;width:16px;height:16px;vertical-align:middle;background-color:#fff;position:relative;cursor:pointer;display:inline-block;box-sizing:border-box}.vjs-radio .vjs-radio__inner:after{width:4px;height:4px;border-radius:100%;background-color:#fff;content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);transition:transform .15s ease-in}.vjs-radio .vjs-radio__original{opacity:0;outline:none;position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;margin:0}.vjs-tree{font-family:Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;font-size:14px}.vjs-tree.is-root{position:relative}.vjs-tree.is-root.has-selectable-control{margin-left:30px}.vjs-tree.is-mouseover{background-color:#e6f7ff}.vjs-tree.is-highlight-selected{background-color:#ccefff}.vjs-tree .vjs-tree__content{padding-left:1em}.vjs-tree .vjs-tree__content.has-line{border-left:1px dotted #bfcbd9}.vjs-tree .vjs-tree__brackets{cursor:pointer}.vjs-tree .vjs-tree__brackets:hover{color:#1890ff}.vjs-tree .vjs-comment{color:#bfcbd9}.vjs-tree .vjs-value__null{color:#ff4949}.vjs-tree .vjs-value__boolean,.vjs-tree .vjs-value__number{color:#1d8ce0}.vjs-tree .vjs-value__string{color:#13ce66}
</style>
