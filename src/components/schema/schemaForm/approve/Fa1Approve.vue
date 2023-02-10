<template>
    <div>
        <v-text-field
            class="mb-2"                            
            v-model="model.tokenContract"
            outlined
            dense
            clearable
            validate-on-blur
            label="Token contract"
            placeholder="Token contract"
            background-color="data"
            :rules="rules.address"
        >
        </v-text-field>
        <v-text-field
            key="fa1-allowance"
            v-model="model.allowance"
            type="number"
            outlined
            dense
            validate-on-blur
            label="Allowance"
            placeholder="Allowance"
            background-color="data"
            :rules="rules.nat"
        >
        </v-text-field>
    </div>
</template>

<script>
export default {
    name: "Fa1Approve",
    props: {
        value: Object,
        rules: Object
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    }
}
</script>