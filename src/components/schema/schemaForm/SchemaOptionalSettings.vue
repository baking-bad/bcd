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
          v-model="source"
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
                  @click="setSource(item)"
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
    <div class="d-flex" v-if="!isStorage">
      <v-text-field
          id="sender"
          name="sender"
          v-model="sender"
          outlined
          dense
          label="sender"
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
                  @click="setSender(item)"
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
        v-model="amount"
        outlined
        dense
        :label="isStorage ? 'balance' : 'amount'"
        type="number"
        placeholder="mutez"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: "SchemaOptionalSettings",
  props: {
    settings: Object,
    isStorage: Boolean,
    isDeploy: Boolean,
    importing: Boolean,
    networks: Array,
    importActions: Array,
    schemaSelectedNetwork: String,
  },
  watch: {
    selectedNetwork(val) {
      this.$emit('selectedNetwork', val);
    },
    source(val) {
      this.$emit('settingsChange', {key: 'source', val});
    },
    sender(val) {
      this.$emit('settingsChange', {key: 'sender', val});
    },
    amount(val) {
      this.$emit('settingsChange', {key: 'amount', val});
    },
    schemaSelectedNetwork(val) {
      this.selectedNetwork = val;
    },
    settings(val) {
      this.source = val.source;
      this.amount = val.amount;
    },
  },
  methods: {
    async setSource(item) {
      this.source = await item.callback();
    },
    async setSender(item) {
      this.sender = await item.callback();
    },
  },
  data() {
    return {
      selectedNetwork: null,
      source: null,
      sender: null,
      amount: null,
    }
  }
}
</script>

<style scoped>

</style>