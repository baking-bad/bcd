<template>
  <div class="px-6 pt-4 pb-0 mr-2 mb-6 canvas optional-settings">
    <div class="mb-6">
              <span
                  class="caption font-weight-medium text-uppercase text--disabled"
              >Optional settings</span>
    </div>
    <div class="mb-6">
      <v-btn-toggle
          v-model="selectedNetwork"
          color="primary"
          dense
          mandatory
          v-if="isStorage || isDeploy"
      >
        <v-btn :value="n" :key="n" v-for="n in networks" small>{{ n }}</v-btn>
      </v-btn-toggle>
    </div>
    <div class="d-flex">
      <v-text-field
          id="source"
          name="source"
          v-model="settings.source"
          outlined
          dense
          label="source"
          placeholder="address"
          hint="Press 'fill' to paste your wallet address"
      >
        <template v-slot:append-outer>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  text
                  small
                  :loading="importing"
                  class="text--secondary"
                  v-bind="attrs"
                  v-on="on"
              >
                <v-icon small left>mdi-format-horizontal-align-left</v-icon>
                <span>fill</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="(item, index) in importActions"
                  :key="index"
                  @click="item.callback()"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
                <v-list-item-avatar>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-text-field>
    </div>
    <v-text-field
        id="amount"
        name="amount"
        v-model="settings.amount"
        outlined
        dense
        label="amount"
        type="number"
        placeholder="mutez"
    ></v-text-field>
  </div>
</template>

<script>
export default {
name: "SchemaOptionalSettings"
}
</script>

<style scoped>

</style>