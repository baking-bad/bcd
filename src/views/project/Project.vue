<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="contract">
      <ProjectNav :contract="contract"/>

      <v-container fluid class="py-0 my-0">
        <v-row no-gutters>
          <v-col cols="7" style="height: 64px;" class="d-flex align-end">
            <v-tabs background-color="transparent" slider-color="primary" v-if="contract">
              <v-tab :to="{name: 'operations'}" replace class="overline">
                <v-icon left small>mdi-swap-horizontal</v-icon>Operations
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
          <v-col cols="5" class="d-flex align-end">
            <ExpandableSearch></ExpandableSearch>
          </v-col>
          <v-col cols="12">
            <v-slide-x-reverse-transition mode="out-in">
              <router-view :contract="contract" />
            </v-slide-x-reverse-transition>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/index.js";
import ExpandableSearch from "@/components/ExpandableSearch.vue";
import ProjectNav from "@/views/project/Nav.vue";

export default {
  name: "Project",
  components: {
    ProjectNav,
    ExpandableSearch
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
        this.contract.network === 'mainnet' &&
        this.contract.level < 655360
      );
    }
  },
  data: () => ({
    contract: null,
    loading: true
  }),
  created() {
    this.requestData(this.$route.params.network, this.$route.params.address);
  },
  methods: {
    requestData(network, address) {
      api
        .getContract(network, address)
        .then(res => {
          this.contract = res;
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    }
  },
  watch: {
    $route: function() {
      this.requestData(this.$route.params.network, this.$route.params.address);
    }
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
</style>