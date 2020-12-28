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
                :hint="props.schema.tag ? `\'Fill\' button finds the newest contract with this contract type. If contract's absent nothing is set.` : ``"
                persistent-hint
            >
              <template v-slot:append-outer v-if="props.schema.tag">
                <v-btn text small @click="getRandomContract(props)" class="text--secondary">
                  <v-icon small left>mdi-format-horizontal-align-left</v-icon>fill
                </v-btn>
              </template>
            </v-text-field>
          </template>
        </v-jsf>
        <div v-else></div>
      </v-skeleton-loader>
    </div>
    <SchemaOptionalSettings />
    <SchemaFormExecutionActions />
  </v-form>
</template>

<script>
import SchemaOptionalSettings from "@/components/SchemaOptionalSettings";
import SchemaFormExecutionActions from "@/components/SchemaFormExecutionActions";
export default {
name: "SchemaForm",
  components: {SchemaFormExecutionActions, SchemaOptionalSettings}
}
</script>

<style scoped>

</style>