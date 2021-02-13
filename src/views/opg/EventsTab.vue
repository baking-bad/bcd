<template>
  <div class="fill-canvas canvas">
    <v-container fluid class="pa-8">
      <ImplementationsList
          name="Events"
          :implements-list="[]"
          executable
      />
    </v-container>
  </div>
</template>

<script>
import ImplementationsList from "@/views/contract/MetadataTab/ListBlocks/ImplementationsList";
export default {
  name: "EventsTab",
  components: {ImplementationsList}
}
</script>
