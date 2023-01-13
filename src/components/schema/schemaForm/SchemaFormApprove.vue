<template>
  <v-form>
    <div class="pa-2 canvas">
      <v-jsf
        v-model="model"
        :schema="schema"
        :options="{
          initialValidation: false,
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
      </v-jsf>
    </div>
  </v-form>
</template>

<script>
import { schema } from '@/utils/approve.js';

export default {
    name: "SchemaFormApprove",
    props: {
        model: Object,
    },
    data() {
        return {
            schema: schema
        };
    },
    methods: {
        setModel(newModel) {
            this.model = newModel;
        },
    }
}
</script>