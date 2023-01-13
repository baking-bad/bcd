<template>
  <v-form>
    <div class="pa-2 canvas">
      <v-jsf
        v-model="model"
        :schema="schema"
        :options="{
          initialValidation: false,
          arrayItemCardProps: {
            'elevation': 0,
            'tile': true,
            'outlined': true,
            'autoFixArrayItems': false
          }
        }"
      >
        <template slot="custom-nat" slot-scope="props">
          <v-text-field
            :ref="props.fullKey"
            :label="props.label"
            v-on="props.on"
            dense
            outlined
            numeric
            :value="props.value"
            :rules="rules.nat"
            :placeholder="props.label">
          </v-text-field>
        </template>
        <template slot="custom-address" slot-scope="props">
          <v-text-field
              :ref="props.fullKey"
              :label="props.label"
              v-on="props.on"
              dense
              outlined
              :value="props.value"
              :placeholder="props.label"
              :rules="rules.address"
          >
          </v-text-field>
        </template>
        <template slot="custom-wallet-address" slot-scope="props">
          <WalletTextField 
            :fullKey="props.fullKey" 
            :label="props.label" 
            :placeholder="props.label" 
            :value="props.value"/>
        </template>
      </v-jsf>
    </div>
  </v-form>  
</template>

<script>
import { schema } from '@/utils/approve.js';
import { validationRules } from '@/utils/tz';
import WalletTextField from "@/components/schema/schemaComponents/WalletTextField.vue";

export default {
    name: "SchemaFormApprove",
    props: {
        model: Object,
    },
    components: {
      WalletTextField
    },
    data() {
        return {
            schema: schema,
            rules: validationRules
        }
    }
}
</script>