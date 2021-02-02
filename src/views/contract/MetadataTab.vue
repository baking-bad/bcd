<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="card">
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
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import Vue from 'vue';

export default {
  name: "Metadata",
  props: { contract: Object },
  data: () => {
    return {
      metadata: {},
      loading: true,
    };
  },
  mounted() {
    this.checkMetadata(this.contract);
  },
  watch: {
    contract: {
      deep: true,
      immediate: true,
      handler(value) {
        this.checkMetadata(value);
      }
    },
  },
  methods: {
    checkMetadata(obj) {
      if ('metadata' in obj) {
        Vue.set(this, 'metadata', obj.metadata);
        this.loading = false;
      }
    }
  },
};
</script>