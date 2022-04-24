<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row>
      <v-col cols="6" class="pr-4">
        <v-breadcrumbs
          class="pl-0"
          divider="/"
          :items="breadcrumbsItems"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="pr-4">
        <router-link class="text--secondary no-decoration" :to="`/${network}/${address}/operations`">
          <p>
            <v-icon class="text--secondary">
              mdi-arrow-left
            </v-icon>
            <span class="vertical-align-middle ml-2">Go to contract</span>
          </p>
        </router-link>
      </v-col>
      <v-col cols="9">
        <div class="pl-9">

        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="3" class="pr-4">
        <v-skeleton-loader
          :loading="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        >
          <v-card flat outlined style="max-width: 500px;">
            <v-navigation-drawer floating permanent style="max-height: 80vh; width: 100%;">
              <v-expansion-panels
                flat
                accordion
                mandatory
                active-class="entrypoint-selected"
                v-model="selected"
              >
                <v-expansion-panel
                  v-for="(item, i) in entrypoints"
                  :key="i"
                  :class="i > 0 ? 'bt-1' : ''"
                  class="entrypoint-panel"
                >
                  <v-expansion-panel-header disable-icon-rotate>
                    <div class="d-flex">
                      <span class="hash">{{ item.name }}</span>
                    </div>
                    <template v-slot:actions>
                      <v-icon></v-icon>
                    </template>
                  </v-expansion-panel-header>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-navigation-drawer>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6" class="pr-4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <Schema
            header="Parameters"
            title="Call"
            type="parameter"
            v-if="selectedItem"
            v-model="model"
            :schema="addValidatorsToSchema(selectedItem.schema)"
            :name="selectedItem.name"
            :network="network"
            :address="address"
          />
          <div v-else></div>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="3" class="pl-4">
        <v-skeleton-loader
          :loading="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        >
          <v-card flat outlined style="max-width: 500px;">
            <v-navigation-drawer floating permanent style="max-height: 80vh; width: 100%;">
              <div class="pa-3">
                <TypeDef
                  v-if="entrypoints[selected].typedef"
                  :typedef="entrypoints[selected].typedef"
                  first="parameter"
                />
                <p v-else class="mb-0">
                  No typedef for this entrypoint.
                </p>
              </div>
            </v-navigation-drawer>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { applyStyles } from '@/utils/styles.js';
import Schema from "@/components/schema/Schema.vue";
import TypeDef from "@/views/contract/TypeDef";

export default {
  name: "InteractTab",
  props: {
    address: String,
    network: String,
  },
  components: {
    Schema,
    TypeDef
  },
  data: () => ({
    loading: true,
    entrypoints: [],
    selected: -1,
    model: {},
  }),
  computed: {
    breadcrumbsItems() {
      return [
        {
          text: 'Home',
          to: '/',
        },
        {
          disabled: true,
          text: this.network,
        },
        {
          text: this.address.slice(0, 7) + '...' + this.address.slice(-4),
          to: `/${this.network}/${this.address}/operations`,
        },
        {
          disabled: true,
          text: 'Interact',
        },
        {
          disabled: true,
          text: this.selected === -1 ? '...' : this.entrypoints[this.selected].name,
        },
      ];
    },
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
    this.getEntrypoints(this.$route.params.entrypoint);
  },
  destroyed() {
    this.$router.push({path: this.$route.path, query: { ...this.$route.query, entrypoint: undefined }})
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    addValidatorsToSchema(schema) {
      const modifiedSchema = Object.assign({}, schema);
      const { properties } = modifiedSchema;
      if (properties) {
        Object.keys(properties).forEach(propertyKey => {
          if (properties[propertyKey].prim === "bytes") {
            properties[propertyKey].pattern = "^[0-9a-fA-F]+$"
            properties[propertyKey]["x-options"] = {
              "messages": {
                "pattern": "String must be HEX"
              }
            };
          }
        });
      }
      return modifiedSchema;
    },
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
      if (this.$route.params.entrypoint !== newValue.name) {
        this.$router.push({
          path: `/${this.network}/${this.address}/interact/${newValue.name}`,
        });
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
