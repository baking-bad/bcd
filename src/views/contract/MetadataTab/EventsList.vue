<template>
  <v-list>
    <v-subheader class="title" v-if="metadata.events">Events</v-subheader>
    <v-list-item
        v-for="(event, idx) in metadata.events"
        :key="idx"
        selectable
    >
      <v-list-item-content>
        <v-list-item-title class="overline">{{
            event.name
          }}</v-list-item-title>
        <v-list-item-subtitle>{{ event.description }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "EventsList",
  props: {
    metadata: Object,
  }
}
</script>
