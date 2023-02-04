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
            'outlined': true
          },
          textFieldProps: {
            outlined: true,
            dense: true
          },
          numberProps: {
            outlined: true,
            dense: true
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
              :id="props.fullKey"
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
          <v-text-field
              :ref="props.fullKey"
              :label="props.label"
              v-on="props.on"
              dense
              outlined
              :value="props.value"
              :placeholder="props.label"
              :rules="rules.address"
              hint="If you attached a wallet, its address will be pasted automatically"
              persistent-hint
              class="mb-2"
          >
          </v-text-field>
        </template>
      </v-jsf>
    </div>
  </v-form>  
</template>

<script>
import { getSchema } from '@/utils/approve.js';
import { validationRules } from '@/utils/tz';
import { Wallet } from "@/utils/wallet";

export default {
    name: "SchemaFormApprove",
    props: {
        model: Object,
    },
    mounted() {
      let account = Wallet.getLastUsedAccount();
      if (account){
        console.log(this.model)
      }      
    },
    data() {
        return {
            schema: getSchema(),
            rules: validationRules
        }
    }
}
</script>