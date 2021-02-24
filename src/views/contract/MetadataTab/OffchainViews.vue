<template>
  <v-row no-gutters>
      <v-col cols="8" class="pr-4">
        <template v-if="selectedItem">
          <SchemaHeader
              title="View"
              :is-storage="true"
              :storage-html="selectedItem.name"
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
          <SchemaAlertData
              v-if="alertData"
              :alert-data="alertData"
              @dismiss="showAlertData('')"
          />
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
      <v-col cols="4" class="pl-4">
        <v-card flat outlined style="max-width: 500px;">
          <v-navigation-drawer floating permanent style="max-height: 80vh; width: 100%;">
            <v-expansion-panels
              flat
              accordion
              mandatory
              active-class="entrypoint-selected"
              v-model="selected"
            >
              <v-expansion-panel
                v-for="(item, i) in views"
                :key="i"
                :class="i > 0 ? 'bt-1' : ''"
                class="entrypoint-panel"
              >
                <v-expansion-panel-header>
                  <div class="d-flex">
                    <span class="hash">{{ item.name }}</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <TypeDef :typedef="item.typedef" first="parameter"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-navigation-drawer>
        </v-card>
      </v-col>
  </v-row>
</template>

<script>
import SchemaHeader from "@/components/schema/schemaComponents/SchemaHeader";
import SchemaAlertData from "@/components/schema/schemaAlert/SchemaAlertData";
import SchemaForm from "@/components/schema/schemaForm/SchemaForm";
import MiguelTreeView from "@/components/MiguelTreeView";
import TypeDef from "@/views/contract/TypeDef";

export default {
  name: "OffchainViews",
  components: {MiguelTreeView, SchemaForm, SchemaAlertData, SchemaHeader, TypeDef},
  props: {
    views: Array,
    network: String,
    address: String,
  },
  watch: {
    implementation(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.showAlertData('');
      }
    }
  },
  computed: {
    selectedItem() {
      if (this.selected < 0 || this.views.length < this.selected) {
        return null;
      }
      if (typeof this.selected === "number") {
        return this.views[this.selected];
      }
      return null;
    },
  },
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    setModel(val) {
      this.$set(this, 'model', val);
    },
    callOffchainView() {
      this.api
          .executeMetadataView(this.network, this.address, {
            name: this.selectedItem.name,
            implementation: this.selectedItem.implementation,
            data: this.model
          })
          .then((res) => {
            if (!res) return;
            this.showSuccess = true;
            this.successResponse = res;
          })
          .catch(() => {
            this.showAlertData('Cannot execute the view');
          })
    }
  },
  data() {
    return {
      model: {},
      selected: -1,
      alertData: '',
      successText: '',
      showSuccess: false,
      successResponse: null,
    }
  }
}
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
