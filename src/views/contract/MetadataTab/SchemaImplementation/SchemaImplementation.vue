<template>
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
      <SchemaAlertCustomSuccess
          v-if="successText"
          :success-text="successText"
          @dismiss="showSuccessMessage('')"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import SchemaHeader from "@/components/schema/schemaComponents/SchemaHeader";
import SchemaAlertData from "@/components/schema/schemaAlert/SchemaAlertData";
import SchemaAlertCustomSuccess from "@/components/schema/schemaAlert/SchemaAlertCustomSuccess";
import SchemaForm from "@/components/schema/schemaForm/SchemaForm";

export default {
  name: "SchemaImplementation",
  components: {SchemaForm, SchemaAlertCustomSuccess, SchemaAlertData, SchemaHeader},
  props: {
    title: String,
    implementation: Object,
    network: String,
    address: String,
  },
  watch: {
    implementation(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.showSuccessMessage('');
        this.showAlertData('');
      }
    }
  },
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    showSuccessMessage(msg) {
      this.successText = msg;
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
            this.showSuccessMessage('Success!');
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
    }
  }
}
</script>
