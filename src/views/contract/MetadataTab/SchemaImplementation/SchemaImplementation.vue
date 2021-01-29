<template>
  <v-card flat outlined>
    <v-card-text class="pa-0 pt-6 data">
      <SchemaHeader
          v-if="title"
          :title="title"
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
export default {
  name: "SchemaImplementation",
  components: {SchemaAlertCustomSuccess, SchemaAlertData, SchemaHeader},
  props: {
    title: String,
    alertData: String,
    successText: String,
  },
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    showSuccessMessage(msg) {
      this.successText = msg;
    }
  }
}
</script>
