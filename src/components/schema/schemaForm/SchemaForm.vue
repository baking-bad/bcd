<template>
  <v-form class="pa-6 pr-4">
    <div v-if="schema" class="pl-6 pt-4 pr-4 pb-4 mr-2 mb-6 canvas">
      <div class="mb-6">
        <span class="caption font-weight-medium text-uppercase text--disabled">{{ header }}</span>
      </div>

      <div class="mb-6" v-if="!isDeploy">
        <v-btn-toggle v-model="selectedFillType" color="primary" dense mandatory>
          <v-btn
              small
              :value="data.value"
              v-for="data in fillTypes"
              :key="data.value"
          >{{ data.text }}</v-btn>
        </v-btn-toggle>
      </div>

      <v-skeleton-loader :loading="!show" type="article" transition="fade-transition">
        <v-jsf v-model="model" :schema="schema" v-if="show">
          <template slot="custom-codemirror" slot-scope="{value, label, on}">
            <label class="codemirror-label">{{ label }}</label>
            <div class="mb-6 ba-1" style="border-radius: 3px;">
              <Michelson v-on="on" :code="value" mutable></Michelson>
            </div>
          </template>
          <template slot="custom-contract" slot-scope="props">
            <v-text-field
                :ref="props.fullKey"
                :label="props.label"
                v-on="props.on"
                dense
                outlined
                :value="props.value"
                :placeholder="props.label"
                :hint="schema.tag ? `\'Fill\' button finds the newest contract with this contract type. If contract's absent nothing is set.` : ``"
                persistent-hint
            >
              <template v-slot:append-outer v-if="schema.tag">
                <v-btn text small @click="$emit('getRandomContract', props)" class="text--secondary">
                  <v-icon small left>mdi-format-horizontal-align-left</v-icon>fill
                </v-btn>
              </template>
            </v-text-field>
          </template>
        </v-jsf>
        <div v-else></div>
      </v-skeleton-loader>
    </div>
    <SchemaOptionalSettings
      :is-storage="isStorage"
      :is-deploy="isDeploy"
      :networks="networks"
      :settings="settings"
      :importing="importing"
      :import-actions="importActions"
      :schema-selected-network="schemaSelectedNetwork"
      @selectedNetwork="(val) => this.$emit('selectedNetwork', val)"
      @settingsChange="(args) => this.$emit('settingsChange', args)"
    />
    <SchemaFormExecutionActions
      :execution="execution"
      :execute-actions="executeActions"
      @executeAction="$emit('executeAction')"
    />
  </v-form>
</template>

<script>
import SchemaOptionalSettings from "./SchemaOptionalSettings";
import SchemaFormExecutionActions from "./SchemaFormExecutionActions";
import Michelson from "@/components/Michelson";
import Vue from 'vue';

export default {
name: "SchemaForm",
  components: {
    Michelson,
    SchemaFormExecutionActions,
    SchemaOptionalSettings
  },
  props: {
    schema: Object,
    settings: Object,
    schemaModel: Object,
    schemaSelectedFillType: String,
    schemaSelectedNetwork: String,
    header: String,
    isDeploy: Boolean,
    isStorage: Boolean,
    importing: Boolean,
    execution: Boolean,
    show: Boolean,
    fillTypes: Array,
    networks: Array,
    importActions: Array,
    executeActions: Array,
  },
  watch: {
    selectedFillType(val) {
      this.$emit('selectedFillType', val)
    },
    model(val) {
      this.$emit('modelChange', val)
    },
    schemaModel(val) {
      Vue.set(this, 'model', val);
    },
    schemaSelectedFillType(val) {
      Vue.set(this, 'selectedFillType', val);
    },
  },
  data() {
    return {
      selectedFillType: 'empty',
      model: {},
    };
  },
}
</script>

<style scoped>

</style>