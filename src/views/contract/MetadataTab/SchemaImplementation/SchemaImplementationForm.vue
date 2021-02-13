<template>
  <div class="pb-6">
    <v-skeleton-loader :loading="!show" type="article" transition="fade-transition">
      <v-jsf v-model="model" :schema="schema" v-if="show" class="pa-4 mt-5 pb-0">
        <template slot="custom-contract" slot-scope="props" class="ma-1">
          <v-text-field
              :ref="props.fullKey"
              :label="props.label"
              v-on="props.on"
              dense
              outlined
              :value="props.value"
              :placeholder="props.label"
          >
            <template v-slot:append-outer v-if="schema.properties[props.modelKey].tag">
              <v-btn text small @click="$emit('getRandomContract', props)" class="text--secondary">
                <v-icon small left>mdi-format-horizontal-align-left</v-icon><span>{{props}}</span>
              </v-btn>
            </template>
          </v-text-field>
        </template>
      </v-jsf>
      <div v-else></div>
    </v-skeleton-loader>
    <SchemaFormExecutionActions
        class="pl-4 pr-6"
        @executionClick="implementForm"
    />
  </div>
</template>

<script>
import SchemaFormExecutionActions from "@/components/schema/schemaForm/SchemaFormExecutionActions";
export default {
  name: "SchemaImplementationForm",
  components: {SchemaFormExecutionActions},
  props: {
    schema: Object,
    parameters: Object,
  },
  watch: {
    parameters() {
      this.model = {};
    }
  },
  methods: {
    implementForm() {
      console.log('implement model: ', this.model)
    }
  },
  data() {
    return {
      show: true,
      model: null,
    }
  }
}
</script>
