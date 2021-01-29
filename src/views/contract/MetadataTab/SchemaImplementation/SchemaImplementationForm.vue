<template>
  <v-skeleton-loader :loading="!show" type="article" transition="fade-transition">
    <v-jsf v-model="model" :schema="schema" v-if="show">
      <template slot="custom-contract" slot-scope="props">
        {{parameters}}
        <v-text-field
            :ref="props.fullKey"
            :label="props.label"
            v-on="props.on"
            dense
            outlined
            :value="props.value"
            :placeholder="props.label"
            :hint="schema.properties[props.modelKey].tag ? `\'Fill\' button finds the newest contract with this contract type. If contract's absent nothing is set.` : ``"
            persistent-hint
        >
          <template v-slot:append-outer v-if="schema.properties[props.modelKey].tag">
            <v-btn text small @click="$emit('getRandomContract', props)" class="text--secondary">
              <v-icon small left>mdi-format-horizontal-align-left</v-icon>fill
            </v-btn>
          </template>
        </v-text-field>
      </template>
    </v-jsf>
    <div v-else></div>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: "SchemaImplementationForm",
  props: {
    model: Object,
    schema: Object,
    parameters: Object,
  },
  data() {
    return {
      show: true
    }
  }
}
</script>

<style scoped>

</style>