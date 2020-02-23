<template>
  <v-container fluid v-if="!loading && opg" class="mt-5">
    <v-expansion-panels multiple popout tile v-model="panels">
      <template v-for="(item, idx) in opg">
        <Operation :data="item" :key="idx" />
      </template>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { getOPG } from "@/api/index.js";

import Operation from "@/components/Operation.vue";

export default {
  name: "OPG",
  components: {
    Operation
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
    getOPG() {
      getOPG(this.$route.params.hash)
        .then(res => {
          this.prepareOperations(res);
          this.panels = [];
          for (let i = 0; i < this.opg.length; i++) {
            this.panels.push(i);
          }
        })
        .catch(err => console.log(err))
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