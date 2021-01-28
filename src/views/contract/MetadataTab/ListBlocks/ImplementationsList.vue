<template>
  <v-list class="mt-3">
    <v-subheader class="title">{{ name }}</v-subheader>
    <EntrypointsCard
        class="ml-3 mr-3"
        :card-max-width="-1"
        :entrypoints="implementsList"
        :is-implementations="true"
    />
  </v-list>
</template>

<script>
import EntrypointsCard from "@/components/Cards/EntrypointsCard";
export default {
  name: "ImplementationsList",
  components: {EntrypointsCard},
  props: {
    name: String,
    implementsList: Array,
  }
}
</script>
