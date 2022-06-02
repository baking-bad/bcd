<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="3">
        <h3 class="mb-3 text--secondary font-weight-medium">Views</h3>
        <v-list-item-group
          class="themed-border radius-1"
          active-class="token-card-selected"
          :value="selected"
          mandatory
        >
          <template v-for="(item, i) in offChainViews">
            <v-list-item @click="selected = i" class="token-card" :key="'entrypoint-' + i">
              <v-list-item-content>
                <v-list-item-title class="d-flex justify-space-between align-center">
                  <span v-if="item.name">{{ item.name }}</span>
                  <span v-else class="text--disabled">NO NAME</span>
                  <span class="disabled-gray text-small">
                    {{ item.kind }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-col>
      <v-col cols="6" class="px-8">
        <template v-if="selectedItem">
          <v-card flat outlined>
            <v-card-text class="pa-0 pt-6 data">
              <SchemaHeader
                title="View"
                :is-storage="true"
                :storage-html="selectedItem.name"
                :storage-name="selectedItem.name"
              />
              <SchemaForm
                header="Parameters"
                fallback-text="This implementation doesn't have parameters"
                :schema="selectedItem.schema"
                :show="true"
                :is-deploy="true"
                :is-optional-settings="false"
                @executeClick="callOffchainView"
                @modelChange="setModel"
              />
            </v-card-text>
          </v-card>
        </template>
        <v-dialog
          v-model="showSuccess"
          max-width="525"
          persistent
          dark
          @click:outside="showSuccess = false"
          @keydown.esc="showSuccess = false"
        >
          <v-card flat outlined>
            <v-card-title class="sidebar d-flex justify-center pa-4">
              <span class="body-1 font-weight-medium text-uppercase text--secondary">View result</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="showSuccess = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-8">
              <MiguelTreeView :miguel="successResponse" />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="3">
        <h3 class="mb-3 text--secondary font-weight-medium">Parameters type</h3>
        <v-card flat outlined style="max-width: 500px;">
          <v-navigation-drawer floating permanent style="max-height: 80vh; width: 100%;">
            <div class="pa-3">
              <TypeDef
                v-if="selectedItem.typedef"
                :typedef="selectedItem.typedef"
                first="parameter"
                class="pt-3 pb-1 px-6"
                style="opacity: 0.8"
              />
              <p v-else class="mb-0">
                No parameters for this view.
              </p>
            </div>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <TreeNodeDetails
        prim="string"
        :data="fullErrorValue"
        :value="isErrorShown"
        is-error-info
      />
    </v-row>
  </v-container>
</template>

<script>
import SchemaHeader from "../../../components/schema/schemaComponents/SchemaHeader";
import SchemaForm from "../../../components/schema/schemaForm/SchemaForm";
import TreeNodeDetails from "../../../components/Dialogs/TreeNodeDetails";
import MiguelTreeView from "../../../components/MiguelTreeView";
import TypeDef from "../TypeDef";

export default {
  name: "ViewsTab",
  props: {
    address: String,
    network: String,
    offChainViews: Array,
  },
  components: {
    TypeDef,
    MiguelTreeView,
    TreeNodeDetails,
    SchemaForm,
    SchemaHeader,
  },
  computed: {
    selectedItem() {
      if (this.selected < 0 || this.offChainViews.length < this.selected) {
        return null;
      }
      if (typeof this.selected === "number") {
        return this.offChainViews[this.selected];
      }
      return null;
    },
  },
  methods: {
    setModel(val) {
      this.model = val;
    },
    callOffchainView() {
      this.api
        .executeMetadataView(this.network, this.address, {
          name: this.selectedItem.name,
          implementation: this.selectedItem.implementation,
          data: this.model,
          kind: this.selectedItem.kind,
        })
        .then((res) => {
          if (!res) return;
          this.showSuccess = true;
          this.successResponse = res;
        })
        .catch((err) => {
          this.isErrorShown = false;
          this.fullErrorValue = {
            name: `${err.response.statusText} — ${err.response.status}`,
            val: err.response.data.message,
            realPrim: 'string',
            label: err.response.data.message,
          };
          this.$nextTick(() => {
            this.isErrorShown = true;
          });
        })
    }
  },
  data() {
    return {
      model: {},
      selected: 0,
      isErrorShown: false,
      successText: '',
      showSuccess: false,
      successResponse: null,
      fullErrorValue: null,
    }
  }
};
</script>



<style lang="scss" scoped>
.entrypoint-panel > .v-expansion-panel-header {
  background-color: var(--v-sidebar-base);
}

.v-expansion-panel.entrypoint-selected {
  background-color: var(--v-data-base);
  & > .v-expansion-panel-header {
    background-color: var(--v-data-base);
  }
}
</style>
