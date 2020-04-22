<template>
  <v-dialog v-model="show" width="800">
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on" :class="gutters ? '' : 'pa-0 ma-0'" selectable>
        <v-list-item-content>
          <v-list-item-subtitle class="overline">
            <span>{{ title }}</span>
          </v-list-item-subtitle>
          <v-list-item-title class="address grey--text text--darken-4">
            <span :class="[highlighted ? 'highlighted' : '']">
              <span v-if="alias">{{ alias }}</span>
              <span v-else>{{ address }}</span>
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="11">
            <v-row no-gutters>
              <v-col v-if="alias" cols="auto" class="mr-5 my-1 d-flex flex-column justify-center">
                <span class="overline grey--text text--darken-1">Alias</span>
                <span class="info-item-title grey--text text--darken-3">{{ alias }}</span>
              </v-col>
              <v-col cols="2" class="my-1 d-flex flex-column justify-center">
                <span class="overline grey--text text--darken-1">Primitive</span>
                <span class="info-item-title grey--text text--darken-3">address</span>
              </v-col>
              <v-col cols="2" class="my-1 d-flex flex-column justify-center">
                <span class="overline grey--text text--darken-1">Network</span>
                <span class="info-item-title grey--text text--darken-3">{{ network }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1" class="d-flex align-center justify-end">
            <v-btn icon text @click="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>        
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters class="mt-5">
          <v-col cols="12">
            <ValueInspector prim="address"
                            :value="address"
                            :network="network"
                            :address="address"
                            :label="title"
                            :sameTab="true">
            </ValueInspector>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ValueInspector from "@/components/ValueInspector.vue"
import { getTzKTLink } from "@/utils/tzkt.js";

export default {
  name: "AccountBox",
  props: {
    title: String,
    address: String,
    alias: String,
    highlighted: Boolean,
    gutters: Boolean,
    network: String
  },
  components: {
    ValueInspector
  },
  data: () => ({
    show: false
  }),
  methods: {
    handleAddress(s) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith('KT')) {
        let routeData = this.$router.resolve({ path: `/${this.network}/${address}` });
        window.open(routeData.href, '_blank');
      } else {
        let href = getTzKTLink(this.network, address);
        window.open(href, '_blank');
      }
    },
  }
}
</script>

<style scoped>
.address {
  font-family: "Roboto Mono", monospace;
  font-size: 0.8rem;
}
.highlighted {
  color: #e83e8c;
}
.info-item-title {
  font-family: "Roboto Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.2rem;
}
</style>