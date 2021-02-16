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
    alertData: String,
    successText: String,
    implementation: Object,
  },
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    showSuccessMessage(msg) {
      this.successText = msg;
    },
  }
}
</script>
