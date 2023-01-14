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
import { schema } from '@/utils/approve.js';
import { validationRules } from '@/utils/tz';
import { Wallet } from "@/utils/wallet";

export default {
    name: "SchemaFormApprove",
    props: {
        model: Object,
    },
    created() {
      let account = Wallet.getLastUsedAccount();
      if (account){
        this.schema.properties.
          allowances.items.properties.
          token_type.oneOf[1].properties.
          owner.default = account.address;
      }      
    },
    data() {
        return {
            schema: schema,
            rules: validationRules
        }
    }
}
</script>