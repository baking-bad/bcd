<template>
  <v-card flat outlined>
    <v-card-text class="pa-0 pt-6 data">
      <SchemaHeader
          :title="implementation.implementationName"
      />
      <EventsImplementationForm />
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
import EventsImplementationForm from "@/views/opg/tabs/EventsTab/EventsImplementation/EventsImplementationForm";

export default {
name: "EventsImplementation",
  components: {EventsImplementationForm, SchemaAlertCustomSuccess, SchemaAlertData, SchemaHeader},
  props: {
    implementation: Object,
  },
  methods: {
    showAlertData(msg) {
      this.alertData = msg;
    },
    showSuccessMessage(msg) {
      this.successText = msg;
    },
  },
  data() {
    return {
      alertData: '',
      successText: '',
    }
  }
}
</script>
