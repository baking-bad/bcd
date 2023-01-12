<template>
  <v-form>
    <div v-if="schema" class="pa-2 canvas">
      <v-skeleton-loader :loading="isLoading" type="article" transition="fade-transition">
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
      </v-skeleton-loader>
    </div>
  </v-form>
</template>

<script>
export default {
    name: "SchemaFormApprove",
    props: {
        model: Object,
    },
    data() {
        return {
            schema: {},
            isLoading: true
        };
    },
    mounted() {
        this.getSchema();
    },
    methods: {
        setModel(newModel) {
            this.model = newModel;
        },
        getSchema() {
            this.isLoading = true;
            this.api.approveSchema()
                .then(response => {
                    this.schema = response;
                })
                .catch(err => console.log(err))
                .finally(this.isLoading = false)
        }
    }
}
</script>