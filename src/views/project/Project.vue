<template>
  <div>
    <v-overlay :value="loading" v-if="loading" absolute color="white">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
    <div v-else-if="contract">
      <ProjectNav :contract="contract" />

      <v-container fluid class="py-0 my-0">
        <v-row>
          <v-col cols="7" style="height: 64px;" class="d-flex align-end pb-0">
            <v-tabs center-active background-color="transparent" slider-color="primary" v-if="contract">
              <v-tab :to="{name: 'operations'}" replace class="overline">
                <v-icon left small>mdi-swap-horizontal</v-icon>
                Operations ({{ contract.tx_count || 0 }})
              </v-tab>
              <v-tab :to="{name: 'code'}" replace class="overline">
                <v-icon left small>mdi-code-braces</v-icon>Code
              </v-tab>
              <v-tab :to="{name: 'entrypoints'}" replace v-if="hasEntrypoints" class="overline">
                <v-icon left small>mdi-doorbell</v-icon>Entrypoints
              </v-tab>
              <v-tab :to="{name: 'storage'}" replace class="overline">
                <v-icon small left>mdi-alphabetical</v-icon>Storage
              </v-tab>
              <v-tab :to="{name: 'migration'}" replace class="overline" v-if="hasMigration">
                <v-icon small left>mdi-alphabetical</v-icon>Migration
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="5" class="d-flex align-end pb-0">
            <ExpandableSearch class="mb-1"></ExpandableSearch>
            <v-btn text small class="toolbar-btn overline mb-2" @click="random">Pick random</v-btn>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-slide-x-reverse-transition mode="out-in">
              <router-view :contract="contract" />
            </v-slide-x-reverse-transition>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <ErrorState v-else></ErrorState>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import * as api from "@/api/index.js";
import ExpandableSearch from "@/components/ExpandableSearch.vue";
import ProjectNav from "@/views/project/Nav.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "Project",
  components: {
    ProjectNav,
    ExpandableSearch,
    ErrorState
  },
  computed: {
    hasEntrypoints() {
      return (
        this.contract.entrypoints !== undefined &&
        this.contract.entrypoints.length > 0
      );
    },
    hasMigration() {
      return (
        this.contract.network === "mainnet" && this.contract.level < 655360
      );
    }
  },
  data: () => ({
    contract: null,
    loading: true
  }),
  created() {
    this.requestData();
  },
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      if (
        this.contract != null &&
        this.contract.network === this.$route.params.network &&
        this.contract.address === this.$route.params.address
      )
        return;
      api
        .getContract(this.$route.params.network, this.$route.params.address)
        .then(res => {
          this.contract = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    random() {
      api
        .getRandomContract()
        .then(res => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    }
  },
  watch: {
    $route: "requestData"
  }
};
</script>

<style lang="scss" scoped>
.info-title {
  color: grey;
  font-size: 12px;
}

.info-data {
  font-size: 12px;
}
.toolbar-btn {
  color: rgba(0, 0, 0, 0.54);
}
</style>