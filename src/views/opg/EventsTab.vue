<template>
  <div class="fill-canvas canvas">
    <v-container fluid class="pa-8">
      <ImplementationsList
          name="Events"
          implements-list="events"
          hidden-implementations-fields="hiddenImplementationsFields"
          events
      />
    </v-container>
  </div>
</template>

<script>
import ImplementationsList from "@/views/opg/ImplementationsList";

export default {
  name: "EventsTab",
  components: {
    ImplementationsList
  },
  data() {
    return {
    }
  }
}
</script>
