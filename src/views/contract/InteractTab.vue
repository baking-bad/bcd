<template>
  <v-container fluid class="pa-8 pt-2 canvas fill-canvas">
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
      <v-col cols="9" class="pl-2">
        <div class="d-flex justify-space-between align-center themed-border radius-1 pa-6">
          <div class="d-flex flex-column justify-center">
            <h1 class="text--secondary d-flex align-center">
              <span>{{ contract ? (contract.alias || shortcutOnly(contract.address)) : shortcutOnly(address) }}</span>
              <Tags class="ml-2" :contract="contract" />
            </h1>
            <p class="text--secondary mb-2">
              <span>{{ contract ? (contract.alias ? shortcutOnly(address) : '') : '...' }}</span>
            </p>
          </div>
          <div class="d-flex flex-column justify-center">
            <VBtn
              @click="openTzktContract(contract)"
              small
            >
              <v-icon small>
                mdi-earth
              </v-icon>
              <span class="ml-2">
                View on TZKT
              </span>
            </VBtn>
            <VBtn
              v-if="isShareable"
              @click="shareContract(contract)"
              class="mt-2"
              small
            >
              Share
            </VBtn>
            <VBtn
              v-else
              small
              class="ml-1 mt-2"
              @click="
                () => {
                  $clipboard(address);
                  showClipboardOK();
                }
              ">
              Copy address
            </VBtn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="3" class="pr-4">
        <h3 class="mb-3 text--secondary outline">Entrypoints</h3>
        <v-skeleton-loader
          :loading="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        >
          <v-list-item-group
            class="themed-border radius-1"
            mandatory
          >
            <template v-for="(item, i) in entrypoints">
              <v-list-item @click="selected = i" class="token-card" :key="'entrypoint-' + i">
                <v-list-item-content>
                  <v-list-item-title>
                    <span v-if="item.name">{{ item.name }}</span>
                    <span v-else class="text--disabled">NO NAME</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="6" class="pr-4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <Schema
            header="Parameters"
            title="Interact:"
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
        <h3 class="mb-3 text--secondary">Signatures</h3>
        <v-skeleton-loader
          :loading="loading"
          type="list-item, divider, list-item, divider, list-item, divider, list-item, divider, list-item"
        >
          <v-card flat outlined style="max-width: 500px;">
            <v-navigation-drawer floating permanent style="max-height: 80vh; width: 100%;">
              <div class="pa-3">
                <TypeDef
                  v-if="entrypoints[selected] ? entrypoints[selected].typedef : false"
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
import { shortcutOnly } from "../../utils/tz";
import Tags from "../../components/Tags";
import {shareContract} from "../../utils/navigation";
import {openTzktContract} from "../../utils/tzkt";

export default {
  name: "InteractTab",
  props: {
    address: String,
    network: String,
  },
  components: {
    Tags,
    Schema,
    TypeDef
  },
  data: () => ({
    loading: true,
    entrypoints: [],
    selected: -1,
    model: {},
    contract: null,
  }),
  computed: {
    isShareable() {
      return navigator.share;
    },
    breadcrumbsItems() {
      return [
        {
          text: 'HOME',
          to: '/',
        },
        {
          disabled: true,
          text: this.network.toUpperCase(),
        },
        {
          text: shortcutOnly(this.address),
          to: `/${this.network}/${this.address}/operations`.toUpperCase(),
        },
        {
          disabled: true,
          text: `Interact${this.selected === -1 ? '' : `: ${this.entrypoints[this.selected].name}`}`.toUpperCase(),
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
      const entrypointQuery = this.$route.params.entrypoint;
      return this.entrypoints.find(item => item.name === entrypointQuery)
    },
  },
  created() {
    this.getEntrypoints(this.$route.params.entrypoint);
    this.api
      .getContract(this.network, this.address)
      .then((contract) => {
        this.contract = contract;
      });
  },
  destroyed() {
    this.$router.push({path: this.$route.path, query: { ...this.$route.query, entrypoint: undefined }})
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
    shortcutOnly,
    shareContract,
    openTzktContract,
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
    $route(newVal) {
      const { entrypoint } = newVal.params;
      if (!entrypoint) {
        this.$router.back();
      } else {
        this.selected = this.entrypoints.findIndex((item) => item.name === entrypoint);
      }
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
