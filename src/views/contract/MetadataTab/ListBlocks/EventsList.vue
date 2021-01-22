<template>
  <v-list class="mt-3">
    <v-subheader class="title">Events</v-subheader>
    <EntrypointsCard
        class="ml-3 mr-3"
        :card-max-width="-1"
        :entrypoints="metadata.events"
    />
  </v-list>
</template>

<script>
import EntrypointsCard from "@/components/Cards/EntrypointsCard";

export default {
  name: "EventsList",
  components: {EntrypointsCard},
  props: {
    metadata: Object,
  }
}
</script>
