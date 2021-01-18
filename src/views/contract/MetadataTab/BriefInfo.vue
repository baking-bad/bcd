<template>
  <v-list>
    <v-list-item v-if="metadata.name" selectable>
      <v-list-item-content>
        <v-list-item-title class="headline"
        ><span>{{ metadata.name }}</span
        >&nbsp;<span v-if="metadata.version" class="overline">{{
            metadata.version
          }}</span></v-list-item-title
        >
        <v-list-item-subtitle>{{
            metadata.description
          }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <div class="d-flex flex-horizontal justify-center align-center">
          <v-chip v-if="metadata.license" class="mx-2" outlined small disabled>{{
              metadata.license.name
            }}</v-chip>
          <v-btn
              v-if="metadata.homepage"
              icon
              :href="metadata.homepage"
              target="_blank"
              class="text--secondary"
              rel="nofollow noopener"
          >
            <v-icon>mdi-web</v-icon>
          </v-btn>
        </div>
      </v-list-item-action>
    </v-list-item>
    <div class="pl-2 mb-4">
      <v-chip
          v-for="(i, idx) in metadata.interfaces"
          :key="idx"
          class="mx-2"
          disabled
          small
      >
        {{ i }}
      </v-chip>
    </div>
    <v-list-item v-if="metadata.authors" selectable>
      <v-list-item-content>
        <v-list-item-title class="overline">Authors</v-list-item-title>
        <v-list-item-subtitle>{{
            metadata.authors.join(", ")
          }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "BriefInfo",
  props: {
    metadata: Object,
  }
}
</script>
