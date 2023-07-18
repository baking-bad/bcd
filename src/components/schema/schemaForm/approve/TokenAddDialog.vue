<template>
    <v-dialog v-model="show" width="600" persistent @keydown.esc="onCancel" ref="tokenAddDialog" @click:outside="onCancel">        
        <v-card flat outlined class="data">
            <v-card-title class="sidebar d-flex justify-center py-2">
                <v-spacer></v-spacer>
                    <v-btn icon small @click="onCancel">
                <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pt-4 pb-0">
                <v-row>
                    <v-col cols="12" v-if="!isEdit" class="pb-0">
                        <v-alert
                            dense
                            text
                            border="left"
                            type="warning"
                            class="caption"
                            >
                            Check <strong>token contract</strong> and <strong>id</strong> found in the search. Tokens can have the same name.
                        </v-alert>
                    </v-col>
                    <v-col cols="12" v-if="!isEdit">
                        <TokenSearchField ref=tokenSearchField v-model="searchToken" :network="network"/>
                    </v-col>
                    <v-col cols="12">
                        <v-chip v-if="isEdit" active-class="primary--text" disabled active small class="caption chip hash">
                            {{ selectedTokenType == 1 ? 'Fa1.2' : 'Fa2' }}
                        </v-chip>
                        <v-btn-toggle v-else
                            v-model="selectedTokenType"
                            color="primary"
                            dense
                            mandatory
                        >
                            <v-btn :value="typ.value" :key="typ.value" v-for="typ in tokenTypes" small>{{ typ.name }}</v-btn>
                        </v-btn-toggle>
                    </v-col>
                    <v-col class="pb-0 mb-0" v-if="selectedTokenType == 1">
                        <Fa1Approve v-model="fa1" :rules="rules"/>
                    </v-col>
                    <v-col class="pb-0 mb-0" v-else>
                        <Fa2Approve v-model="fa2" :rules="rules"/>                    
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="mb-2 mt-0">
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="onCancel"
                >Cancel
                </v-btn>
                <v-btn color="primary" text @click.native="addToken">{{ isEdit ? 'Save' : 'Add' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { validationRules } from '@/utils/tz';
import { Wallet } from "@/utils/wallet";
import Fa1Approve from './Fa1Approve.vue';
import Fa2Approve from './Fa2Approve.vue';
import TokenSearchField from './TokenSearchField.vue';

export default {
    name: 'TokenAddDialog',
    props: {
        value: Boolean,
        network: String
    },
    components: {
        Fa1Approve,
        Fa2Approve,
        TokenSearchField
    },
    computed: {
        show: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    updated() {
        if (this.show) {
            this.$refs.tokenAddDialog.show();
        }
    },
    data: () => {
        return {
            rules: validationRules,
            selectedTokenType: 1,
            tokenTypes: [
                {
                    name: 'FA1.2',
                    value: 1
                }, {
                    name: 'FA2',
                    value: 2
                }
            ],
            fa1: {
                tokenContract: '',
                allowance: 0
            },
            fa2: {
                tokenContract: '',
                owner: '',
                tokenId: 0
            },
            isEdit: false,
            searchToken: null
        }
    },
    methods: {
        addToken() {
            this.show = false;
            if (!this.isEdit) {
                if (this.selectedTokenType == 1) {
                    this.$emit('tokenAdded', {type: 1, value: this.fa1, typeName: 'FA1.2'})
                } else {
                    this.$emit('tokenAdded', {type: 2, value: this.fa2, typeName: 'FA2'})
                }
            }

            const interval = setInterval(() => {
                if (this.$refs.tokenSearchField) {
                    this.$refs.tokenSearchField.reset();
                    clearInterval(interval)
                }
            }, 50)

        },
        onCancel() {
            this.show = false;
        },
        edit(token) {
            if (token.type == 1) {
                this.fa1 = token.value;
            } else {
                this.fa2 = token.value;
            }
            this.selectedTokenType = token.type;
            this.isEdit = true;
        },
        reset() {
            this.isEdit = false;
            this.selectedTokenType = 1;
            this.fa1 = {
                tokenContract: '',
                allowance: 0
            }
            this.fa2 = {
                tokenContract: '',
                owner: '',
                tokenId: 0
            }
            this.searchToken = null;
            let account = Wallet.getLastUsedAccount();
            if (account){
                this.fa2.owner = account.address;
            }
        }
    },
    watch: {
        show(visible) {
            if (!visible) {
                return;
            }
            this.reset();       
        },
        searchToken: {
            deep: true,
            handler: function(token) {
                if (!token) return;

                if (token.type === 1) {
                    this.selectedTokenType = 1;
                    this.fa1.tokenContract = token.body.Address;
                } else if (token.type === 2){
                    this.selectedTokenType = 2;
                    this.fa2.tokenContract = token.body.Address;
                    this.fa2.tokenId = token.body.TokenID;
                }
            }
        }
    }
}
</script>