<template>
  <div>
    <v-toolbar flat class="opg-toolbar" v-if="!this.passedOPG">
      <v-breadcrumbs large class="px-2 hash" :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mr-2">
        <ExpandableSearch></ExpandableSearch>
      </div>
    </v-toolbar>
    <v-overlay :value="loading" v-if="loading" absolute color="white">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
    <v-container fluid v-else-if="opg && opg.length > 0" class="pa-8">
      <template v-for="(op, opid) in opg">
        <v-card tile elevation="1" :key="opid" class="mb-8">
          <InternalOperation :data="op" />
          <InternalOperation
            v-for="(intop, intid) in op.internal_operations"
            :data="intop"
            :mainOperation="op"
            :key="intid"
          />
        </v-card>
      </template>
    </v-container>
    <ErrorState v-else></ErrorState>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import InternalOperation from "@/components/InternalOperation.vue";
import ExpandableSearch from "@/components/ExpandableSearch.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "OPG",
  props: {
    newOPG: Array
  },
  computed: {
    passedOPG() {
      return this.newOPG;
    }
  },
  components: {
    InternalOperation,
    ExpandableSearch,
    ErrorState
  },
  created() {
    if (!this.passedOPG) {
      this.getOPG();
    } else {
      this.processing(this.passedOPG);
      this.loading = false;
    }
  },
  data: () => ({
    loading: true,
    opg: [],
    panels: [],
    breadcrumbs: []
  }),
  methods: {
    ...mapActions(["showError"]),
    fillBreadcrumbs(op) {
      this.breadcrumbs = [
        {
          text: op.network.slice(0, 1).toUpperCase() + op.network.slice(1),
          disabled: true
        },
        {
          text: this.$route.params.hash,
          disabled: true
        }
      ];
    },
    getOPG() {
      if (this.opg && this.opg.length > 0) return;

      this.api
        .getOPG(this.$route.params.hash)
        .then(res => {
          this.processing(res);
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    processing(data) {
      this.opg = [];
      this.prepareOperations(data);
      this.panels = [];
      for (let i = 0; i < this.opg.length; i++) {
        this.panels.push(i);
      }
      if (this.opg.length > 0) {
        this.fillBreadcrumbs(this.opg[0]);
      }
    },
    prepareOperations(data) {
      data.forEach(element => {
        if (element.internal) {
          this.opg[this.opg.length - 1].internal_operations.push(element);
        } else {
          element.internal_operations = [];
          this.opg.push(element);
        }
      });
    }
  },
  watch: {
    $route: "getOPG",
    passedOPG: function(newValue) {
      if (newValue) this.processing(newValue);
    }
  }
};
</script>

<style>
.opg-toolbar > .v-toolbar__content {
  border-bottom: 1px solid #ddd;
  background-color: rgb(250, 250, 250);
}
</style>