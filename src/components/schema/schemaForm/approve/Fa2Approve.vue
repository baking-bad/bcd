<template>
    <div>
        <v-text-field
            key="fa2-token-contract"
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
            key="fa2-owner"
            v-model="model.owner"
            class="mb-2"
            outlined
            dense
            clearable
            validate-on-blur
            label="Owner"
            placeholder="Owner"
            background-color="data"
            :rules="rules.address"
            persistent-hint
            hint="If you attached a wallet, its address will be pasted automatically"
        >
        </v-text-field>
        <v-text-field
            key="fa2-token-id"
            v-model="model.tokenId"
            type="number"
            background-color="data"
            outlined
            dense
            validate-on-blur
            label="Token id"
            placeholder="Token id"
            :rules="rules.nat"
        >
        </v-text-field>
    </div>
</template>

<script>
export default {
    name: "Fa2Approve",
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