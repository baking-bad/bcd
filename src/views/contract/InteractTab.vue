<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="8" class="pr-4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <Schema
            header="Parameters"
            title="Call"
            type="parameter"
            v-if="selectedItem"
            v-model="model"
            :schema="selectedItem.schema"
            :name="selectedItem.name"
            :network="network"
            :address="address"
            :binPath="selectedItem.bin_path"
          />
          <div v-else></div>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="4" class="pl-4">
        <v-skeleton-loader
          :loading="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        >
          <EntrypointsCard
            @selected="(newVal) => this.selected = newVal"
            :entrypoints="entrypoints"
            :selected-outside="selected"
          />
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Schema from "@/components/Schema.vue";
import { applyStyles } from '@/utils/styles.js';
import EntrypointsCard from "@/components/Cards/EntrypointsCard";

export default {
  name: "InteractTab",
  props: {
    address: String,
    network: String,
  },
  components: {
    EntrypointsCard,
    Schema,
  },
  data: () => ({
    loading: true,
    entrypoints: [],
    selected: -1,
    model: {},
  }),
  computed: {
    selectedItem() {
      if (this.selected < 0 || this.entrypoints.length < this.selected) {
        return null;
      }
      if (typeof this.selected === "number") {
        return this.entrypoints[this.selected];
      }
      const entrypointQuery = this.$route.query.entrypoint;
      return this.entrypoints.find(item => item.name === entrypointQuery)
    },
  },
  created() {
    this.getEntrypoints(this.$route.query.entrypoint);
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    getEntrypoints(selectedName = undefined) {
      this.loading = true;
      this.api
        .getContractEntrypoints(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.entrypoints = res.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          this.entrypoints.forEach((e) => applyStyles(e.schema));
          const idx = this.entrypoints.findIndex(
            (element) => element.name === selectedName
          );
          this.selected = Math.max(0, idx);
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  watch: {
    address: "getEntrypoints",
    selectedItem: function (newValue) {
      if (newValue === null) return;
      if (this.$route.query.entrypoint !== newValue.name) {
        this.$router.replace({ query: { entrypoint: newValue.name } });
      }
      this.model = Object.assign({}, newValue.default_model);
    },
  },
};
</script>



<style lang="scss" scoped>
.entrypoint-panel > .v-expansion-panel-header {
  background-color: var(--v-sidebar-base);
}

.v-expansion-panel.entrypoint-selected {
  background-color: var(--v-data-base);
  & > .v-expansion-panel-header {
    background-color: var(--v-data-base);
  }
}
</style>