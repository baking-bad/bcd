<template>
  <v-container>
    <v-card flat outlined>
      <v-card-text class="pa-0 pt-6 data">
        <SchemaHeader
            :title="implementation.implementationName"
        />
        <SchemaForm
            header="Parameters"
            title="Call"
            type="parameter"
            fallback-text="This implementation doesn't have parameters"
            :is-deploy="true"
            :schema="implementation.info.schema"
            :show="true"
            :is-optional-settings="false"
            @executeClick="implementSchema"
            @modelChange="setModel"
        />
        <SchemaAlertData
            v-if="alertData"
            :alert-data="alertData"
            @dismiss="showAlertData('')"
        />
      </v-card-text>
    </v-card>
    <v-dialog
        v-model="showSuccess"
        max-width="525"
        persistent
        dark
        @click:outside="showSuccess = false"
        @keydown.esc="showSuccess = false"
    >
      <MiguelTreeView
        :miguel="successResponse"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import SchemaHeader from "@/components/schema/schemaComponents/SchemaHeader";
import SchemaAlertData from "@/components/schema/schemaAlert/SchemaAlertData";
import SchemaForm from "@/components/schema/schemaForm/SchemaForm";
import MiguelTreeView from "@/components/MiguelTreeView";

export default {
  name: "SchemaImplementation",
  components: {MiguelTreeView, SchemaForm, SchemaAlertData, SchemaHeader},
  props: {
    title: String,
    implementation: Object,
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
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    setModel(val) {
      this.$set(this, 'model', val);
    },
    implementSchema() {
      this.api
          .executeMetadataView(this.network, this.address, {
            name: this.implementation.name,
            implementation: this.implementation.id,
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
      alertData: '',
      successText: '',
      showSuccess: false,
      successResponse: null,
    }
  }
}
</script>
