<template>
  <div class="fill-canvas canvas">
    <v-container fluid class="pa-8">
      <ImplementationsList
          name="Events"
          :implements-list="events"
          :hidden-implementations-fields="hiddenImplementationsFields"
          executable
      />
    </v-container>
  </div>
</template>

<script>
import ImplementationsList from "@/views/contract/MetadataTab/ListBlocks/ImplementationsList";
import { testEvents } from "@/utils/metadata";

export default {
  name: "EventsTab",
  components: {
    ImplementationsList
  },
  data() {
    return {
      events: testEvents,
      hiddenImplementationsFields: ['parameter', 'returnType'],
    }
  }
}
</script>
