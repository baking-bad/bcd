<template>
  <v-row>
    <v-col cols="6">
      <h3 class="mb-1">Information</h3>
      <v-skeleton-loader :loading="loading" type="list-item-two-line@4">
        <v-list disabled style="background-color: transparent">
          <v-list-item selectable v-if="dapp.authors.length" class="mx-0 px-0">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Authors</v-list-item-subtitle>
              <v-list-item-title class="info-item-title">{{ dapp.authors.join(', ') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item selectable class="mx-0 px-0">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">License</v-list-item-subtitle>
              <v-list-item-title class="info-item-title">{{ dapp.license }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item selectable v-if="dapp.categories.length" class="mx-0 px-0">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Categories</v-list-item-subtitle>
              <v-list-item-title class="info-item-title">{{ dapp.categories.join(', ') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item selectable v-if="dapp.interfaces.length" class="mx-0 px-0">
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Interfaces</v-list-item-subtitle>
              <v-list-item-title class="info-item-title">{{ dapp.interfaces.join(', ') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6">
      <h3 class="mb-1">Contracts</h3>

      <v-skeleton-loader :loading="loading" type="list-item-two-line@4">
        <v-list style="background-color: transparent">
          <v-list-item
            three-line
            class="mx-0 px-0"
            v-for="contract in dapp.contracts"
            :key="contract.address"
            target="_blank"
            :to="{name: 'contract', params: {address: contract.address, network: contract.network}}"
          >
            <v-list-item-content>
              <v-list-item-title>{{ contract.alias ? contract.alias : contract.address }}</v-list-item-title>
              <v-list-item-subtitle
                class="info-item-title"
                v-if="contract.alias"
              >{{ contract.address }}</v-list-item-subtitle>
              <v-list-item-subtitle>Deployed at {{ contract.release_date | formatDate }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>


<script>
export default {
  name: "InformationBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
};
</script>


<style lang="scss" scoped>
.info-item-title {
  font-size: 14px;
  font-weight: 300;
}
</style>