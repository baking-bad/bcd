<template>
  <div>
    <v-overlay :value="loading" v-if="loading" absolute color="white">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
    <div v-else-if="contract">
      <ProjectNav :contract="contract" />

       <v-toolbar flat class="project-toolbar">
        <v-tabs
          class="ml-4"
          center-active
          background-color="transparent"
          slider-color="primary"
          v-if="contract"
        >
          <v-tab :to="{name: 'operations'}" replace>
            <v-icon left small>mdi-swap-horizontal</v-icon>
            Operations ({{ contract.tx_count || 0 }})
          </v-tab>
          <v-tab :to="{name: 'code'}" replace >
            <v-icon left small>mdi-code-braces</v-icon>Code
          </v-tab>
          <v-tab :to="{name: 'entrypoints'}" replace v-if="hasEntrypoints">
            <v-icon left small>mdi-doorbell</v-icon>Entrypoints
          </v-tab>
          <v-tab :to="{name: 'storage'}" replace>
            <v-icon small left>mdi-alphabetical</v-icon>Storage
          </v-tab>
          <v-tab :to="{name: 'migrations'}" replace v-if="contract.migrations_count">
            <v-icon small left>mdi-transfer</v-icon>Migrations ({{ contract.migrations_count || 0 }})
          </v-tab>
        </v-tabs>
        <div class="mr-4">
          <ExpandableSearch></ExpandableSearch>
        </div>
       </v-toolbar>

      <v-container fluid class="py-0 my-0">
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-slide-x-reverse-transition mode="out-in">
              <router-view :contract="contract" />
            </v-slide-x-reverse-transition>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <ErrorState v-else :code="errorCode"></ErrorState>
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
    }
  },
  data: () => ({
    contract: null,
    loading: true,
    errorCode: 0
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
          if (!res) return;
          this.contract = res;
        })
        .catch(err => {
          const matches = err.message.match(/\d+/);
          if (matches !== null && matches.length === 1)
            this.errorCode = parseInt(matches[0]);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    }
  },
  watch: {  
    $route: "requestData"
  }
};
</script>

<style>
.project-toolbar > .v-toolbar__content {
  border-bottom: 1px solid #ddd;
  background-color: rgb(250, 250, 250);
}
</style>

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
.v-tab {
  font-size: 12px;
}
</style>