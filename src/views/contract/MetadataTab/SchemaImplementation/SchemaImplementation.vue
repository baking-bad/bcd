<template>
  <v-card flat outlined>
    <v-card-text class="pa-0 pt-6 data">
      <SchemaHeader
          :title="implementation.implementationName"
      />
      <SchemaImplementationForm
          :parameters="implementation.info"
          :schema="parametersSchema"
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
import SchemaImplementationForm from "@/views/contract/MetadataTab/SchemaImplementation/SchemaImplementationForm";

export default {
  name: "SchemaImplementation",
  components: {SchemaImplementationForm, SchemaAlertCustomSuccess, SchemaAlertData, SchemaHeader},
  props: {
    title: String,
    alertData: String,
    successText: String,
    implementation: Object,
  },
  computed: {
    parametersSchema() {
      return {
        "type": "object",
        "properties": this.getSchemaProperties(this.implementation.info)
      }
    }
  },
  async mounted() {
    const a = await this.api.getMetadataViews(`delphinet`, `KT1Nu6FHWrpWF3wAkKkWs1Tb1MMTgNesFrUn`);
    return a;
  },
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    showSuccessMessage(msg) {
      this.successText = msg;
    },
    getSchemaProperties(implementation) {
      let properties = {};
      Object.keys(implementation).forEach(key => {
        properties[key] = {
          type: "string",
          title: key,
          "x-display": "custom-contract"
        }
      })
      return properties;
    }
  }
}
</script>
