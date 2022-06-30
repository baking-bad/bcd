<template>
    <v-dialog v-model="show" width="800" scrollable ref="michelsonDialog">
    <v-card flat outlined>
      <v-card-title class="sidebar d-flex justify-center py-2">
        <span class="body-1 font-weight-medium text-uppercase text--secondary">Michelson</span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <Michelson :code="code"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Michelson from '@/components/Michelson.vue';

export default {
    name: "SchemaMichelson",
    components: {
        Michelson
    },
    props: {
        value: Boolean,
        code: String
    },
    computed:{ 
        show: {
            get () {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    updated() {
        if (this.value) {
            this.$refs.michelsonDialog.show();
        }
    }
}
</script>