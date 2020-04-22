<template>
  <div>
    <v-overlay :value="loading" v-if="loading" absolute color="white">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
    <v-container fluid v-else-if="opg && opg.length > 0" class="py-6 px-8">
      <v-expansion-panels multiple popout tile v-model="panels">
        <template v-for="(item, idx) in opg">
          <Operation :data="item" :key="idx" />
        </template>
      </v-expansion-panels>
    </v-container>
    <ErrorState v-else></ErrorState>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { getOPG } from "@/api/index.js";
import Operation from "@/components/Operation.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "OPG",
  components: {
    Operation,
    ErrorState
  },
  created() {
    this.getOPG();
  },
  data: () => ({
    loading: true,
    opg: [],
    panels: []
  }),
  methods: {
    ...mapActions(["showError"]),
    getOPG() {
      getOPG(this.$route.params.hash)
        .then(res => {
          this.prepareOperations(res);
          this.panels = [];
          for (let i = 0; i < this.opg.length; i++) {
            this.panels.push(i);
          }
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
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
    $route: "getOPG"
  }
};
</script>

<style>
.bcd-toolbar > .v-toolbar__content {
  border-bottom: 1px solid #ddd;
  background-color: rgb(250, 250, 250);
}
</style>