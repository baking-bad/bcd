<template>
    <v-text-field
        v-model="address"
        :key="fullKey"
        :ref="fullKey"
        :label="label"
        :rules="rules.address"
        :placeholder="label"
        hint="If you attached a wallet, its address will be pasted automatically"
        outlined
        dense
        persistent-hint
        @input="$emit('input', $event)"
        class="mb-2"
    >
   </v-text-field>
</template>

<script>
import { Wallet } from "@/utils/wallet";
import { validationRules } from '@/utils/tz';

export default {
    name: 'WalletTextField',
    props: {
        fullKey: String,
        label: String,
        placeholder: String,
        value: String
    },
    mounted() {
        if (this.address !== '') return;

        let account = Wallet.getLastUsedAccount();
        if (account){
            this.address = account.address;
            this.$emit('input', this.address);
        }
    },
    data() {
        return {
            rules: validationRules,
            address: this.value
        }
    }
}
</script>