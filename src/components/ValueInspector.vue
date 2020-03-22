<template>
<div>
    <Michelson 
        v-if="prim === 'lambda'" 
        :code="value">
    </Michelson>
    <v-textarea 
        v-else-if="isMultiline"
        auto-grow
        rows="1"
        counter
        readonly
        :label="label"
        :value="data">
    </v-textarea>
    <v-text-field 
        v-else
        :value="data"
        :suffix="suffix"
        readonly
        filled
        :label="label">
    </v-text-field>
    <v-btn v-if="isKeyHash" text small link :href="getTzKTLink(this.data)" target="_blank">
        <v-icon small class="mr-1">mdi-link-variant</v-icon>Open in explorer
    </v-btn>
    <v-btn v-else-if="isContract" text small link :to="getLinkObject(this.data)" target="_blank">
        <v-icon small class="mr-1">mdi-magnify</v-icon>Search on BCD
    </v-btn>
</div>
</template>

<script>
import Michelson from "@/components/Michelson.vue"
import { getTzKTLink } from "@/utils/tzkt.js";

export default {
    name: "ValueInspector",
    props: {
        value: String,
        prim: String,
        label: String,
        network: String
    },
    components: {
        Michelson
    },
    computed: {
        suffix() {
            if (this.prim === 'mutez') {
                return 'utz';
            }
            return null;
        },
        data() {
            if (this.prim === 'string') {
                return String(this.value).replace(/\n/g, '<br/>');
            } else {
                return String(this.value);
            }
        },
        isMultiline() {
            if (this.prim === 'string' || this.prim === 'bytes') {
                if (this.value.length > 80)
                    return true;
                if (/\n/.test(this.value))
                    return true;
            }
            return false;
        },
        isKeyHash() {
            return this.prim === 'key_hash' 
                || (this.prim === 'address' && this.data.startsWith('tz'));
        },
        isContract() {
            return this.prim === 'address' && this.data.startsWith('KT');
        }
    },
    methods: {
        getTzKTLink(address) {
            return getTzKTLink(this.network, address);
        },
        getLinkObject(address) {
            return {
                name: "project",
                params: {
                    address: address,
                    network: this.network
                }
            };
        },
    }
}
</script>