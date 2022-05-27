<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-row no-gutters>
      <v-col cols="8" class="pr-4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <Schema
            v-if="storage"
            :name="$route.params.address"
            title="Fork"
            type="storage"
            header="Storage"
            :isStorage="true"
            :schema="storage.schema"
            :network="$route.params.network"
            :address="$route.params.address"
            v-model="storage.default_model"
            :alias="contract.alias"
          />
          <div v-else />
        </v-skeleton-loader>
      </v-col>
      <v-col cols="4" class="pl-4">
        <v-skeleton-loader :loading="loading" type="card-heading, image">
          <v-card v-if="storage" tile flat outlined class="pa-0">
            <v-card-text class="data">
              <span class="hash ml-2 text--primary" style="font-size: 15px; font-weight: 400;">Storage type</span>
              <TypeDef :typedef="storage.typedef" first="storage" class="pt-4 px-2" />
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

import Schema from "@/components/schema/Schema.vue";
import TypeDef from "@/views/contract/TypeDef.vue";

import { applyStyles } from "@/utils/styles.js";

export default {
  name: "ForkDialog",
  components: {
    Schema,
    TypeDef
  },
  props: {
    contract: Object,
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