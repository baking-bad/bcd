<template>
<div>
    <Michelson 
        v-if="prim === 'lambda'" 
        :code="value">
    </Michelson>
    <pre v-else-if="isPreFormatted">{{ value }}</pre>
    <v-textarea 
        v-else-if="prim === 'string' || prim === 'bytes'"
        auto-grow
        rows="1"
        filled
        readonly
        :label="label"
        :value="value">
    </v-textarea>
    <v-text-field 
        v-else
        :value="value"
        :suffix="suffix"
        readonly
        filled
        :label="label">
    </v-text-field>
    <v-btn v-if="isKeyHash" text small link :href="getTzKTLink(this.value)" target="_blank">
        <v-icon small class="mr-1">mdi-open-in-new</v-icon>Open in explorer
    </v-btn>
    <v-btn v-else-if="isContract" text small link :to="getLinkObject(this.value)" target="_blank">
        <v-icon small class="mr-1">mdi-open-in-new</v-icon>Search contract
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
        isPreFormatted() {
            return this.prim === 'string' && /\n/.test(this.value);
        },
        isKeyHash() {
            return this.prim === 'key_hash' 
                || (this.prim === 'address' && this.value.startsWith('tz'));
        },
        isContract() {
            return (this.prim === 'address' || this.prim === 'contract') 
                && this.value.startsWith('KT');
        }
    },
    methods: {
        getTzKTLink(address) {
            if (address.startsWith("tz"))
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