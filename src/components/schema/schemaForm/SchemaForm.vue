<template>
  <v-form class="pa-6 pr-4">
    <div v-if="schema" class="pl-6 pt-4 pr-4 pb-4 mr-2 mb-6 canvas">
      <div v-if="typeof header === 'string'" :class="typeof header === 'string' ? 'mb-6' : ''">
        <span class="caption font-weight-medium text-uppercase text--disabled">{{ header }}</span>
      </div>
      <div :class="!isDeploy ? 'mb-6' : ''" v-if="!isDeploy">
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
        <v-jsf v-model="model" :schema="schema" :options="{initialValidation: false}">
          <template slot="custom-codemirror" slot-scope="{value, label, on}">
            <label class="codemirror-label">{{ label }}</label>
            <div class="mb-6 ba-1" style="border-radius: 3px;">
              <Michelson v-on="on" :code="value" mutable></Michelson>
            </div>
          </template>
          <template slot="custom-nat" slot-scope="props">
            <v-text-field
              :ref="props.fullKey"
              :label="props.label"
              v-on="props.on"
              dense
              outlined
              :value="props.value"
              :placeholder="props.label">
            </v-text-field>
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
                :hint="schema.properties[props.modelKey] && schema.properties[props.modelKey].tag ? `\'Fill\' button finds the newest contract with this contract type. If contract's absent nothing is set.` : ``"
                persistent-hint
            >
              <template v-slot:append-outer v-if="schema.properties[props.modelKey] && schema.properties[props.modelKey].tag">
                <v-btn text small @click="$emit('getRandomContract', props)" class="text--secondary">
                  <v-icon small left>mdi-format-horizontal-align-left</v-icon>fill
                </v-btn>
              </template>
            </v-text-field>
          </template>
        </v-jsf>
      </v-skeleton-loader>
    </div>
    <div v-else-if="fallbackText">
      <p class="text--disabled">{{ fallbackText }}</p>
    </div>
    <SchemaOptionalSettings
      v-if="isOptionalSettings"
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
      @executeClick="$emit('executeClick')"
    />
  </v-form>
</template>

<script>
import SchemaOptionalSettings from "./SchemaOptionalSettings";
import SchemaFormExecutionActions from "./SchemaFormExecutionActions";
import Michelson from "@/components/Michelson";

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
    isOptionalSettings: {
      type: Boolean,
      default: true,
    },
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
    fallbackText: String,
  },
  watch: {
    selectedFillType(val) {
      this.$emit('selectedFillType', val)
    },
    model(val) {
      this.$emit('modelChange', val)
    },
    schemaModel(val) {
      this.model = val;
    },
    schemaSelectedFillType(val) {
      this.selectedFillType = val;
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
