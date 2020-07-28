<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row>
      <v-col cols="8">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <Schema
            v-if="storage"
            name="Fork"
            header="Storage"
            :isStorage="true"
            :schema="storage.schema"
            :network="$route.params.network"
            :address="$route.params.address"
            v-model="storage.default_model"
          />
          <div v-else />
        </v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <v-card v-if="storage" tile flat outlined class="pa-0">
            <v-card-title class="d-flex sidebar px-4 py-3">
              <span class="caption font-weight-bold text-uppercase text--secondary">Type</span>
            </v-card-title>
            <v-card-text class="data">
              <TypeDef :typedef="storage.typedef" first="storage" class="pt-4" />
            </v-card-text>
          </v-card>
          <div v-else/>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import Schema from "@/views/contract/Schema.vue";
import TypeDef from "@/views/contract/TypeDef.vue";

import { applyStyles } from "@/utils/styles.js";

export default {
  name: "ForkDialog",
  components: {
    Schema,
    TypeDef
  },
  data: () => ({
    storage: null,
    loading: true,
  }),
  created() {
    this.getSchema();
  },
  methods: {
    ...mapActions(["showError"]),
    getSchema() {
      this.loading = true;
      this.api
        .getContractStorageSchema(
          this.$route.params.network,
          this.$route.params.address,
          "current"
        )
        .then((res) => {
          if (!res) return;
          this.storage = res;
          applyStyles(this.storage.schema);
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
  },
  watch: {
    $route: "getSchema",
  },
};
</script>