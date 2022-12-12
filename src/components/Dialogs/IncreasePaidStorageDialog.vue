<template>
    <v-dialog v-model="show" max-width="600" @keydown.esc="show = false" persistent ref="dialog">
        <v-card flat outlined>
            <v-card-title class="sidebar d-flex justify-center py-2">
                <span class="body-1 font-weight-medium text-uppercase text--secondary">Increase paid storage</span>
                <v-spacer></v-spacer>
                <v-btn icon small @click.stop="show = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pt-6 pb-0">
                <v-row>
                    <v-col cols="12" class="pb-0">
                        <v-text-field
                            type="number"
                            dense
                            outlined
                            autofocus
                            label="Amount"
                            v-model="amount"
                            placeholder="Please enter amount to increase paid storage"
                            :rules="amountRules"
                            suffix="bytes"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-alert v-show="hash" type="success" prominent text class="ma-0 align-center">
                            <div class="d-flex align-center">
                                <span class="text--primary">The operation has successfully been broadcasted to the network with hash <span>{{ hash }}</span></span>
                            </div>
                        </v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="pr-6 mb-4 mt-0 pt-0">
                <v-spacer></v-spacer>
                <v-btn outlined color="accent" @click="increasePaidStorage">Increase</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
import { mapActions } from "vuex";
import {defaultEventCallbacks } from '@airgap/beacon-sdk';
import {Wallet} from "@/utils/wallet";

export default {
    name: "IncreasePaidStorageDialog",
    props: {
        network: String,
        address: String,
        value: Boolean
    },
    data() {
        return {
            amount: "0",
            executing: false,
            amountRules: [
                v => v.length > 0 || 'Amount field is required',
                v => /^\d+$/.test(v) || 'Only digits are allowed',
                v => this.validateAmount(v)
            ],
            hash: undefined,
            init: false
        }
    },
    computed: {
        show: {
            get () {
                return this.value
            },
            set (value) {
                this.$emit('input', value)
            }
        },
    },
    updated() {
        if (this.show && !this.init) {
            this.$refs.dialog.show();
            this.init = true;
        }
    },
    methods: {
        ...mapActions({
            showError: "showError",
        }),
        async increasePaidStorage() {
            this.hash = undefined;
            let amount = parseInt(this.amount)
            if (this.amount == "" || amount <= 0) return;
            if (this.executing) return;
            this.executing = true;
            try {
                let beacon = await this.beaconWallet();

                if (beacon.account.network.type !== this.network) {
                    throw new Error('network of connected wallet and contract does not equal')
                }

                console.log('here')

                const result = await beacon.client.requestOperation({
                    operationDetails: [{
                        kind: 'Increase_paid_storage',
                        destination: this.address,
                        amount: this.amount,
                        source: beacon.account.address,
                    }],
                    network: this.network,
                    sourceAddress: beacon.account.address,
                });
                this.hash = result.opHash;
            } catch (err) {
                await err;
                this.showError(err.description);
            } finally {
                this.executing = false;
            }
        },
        getWalletEventHandlers() {
            return {
                PERMISSION_REQUEST_SUCCESS: {
                    handler: async (data) => {
                        await defaultEventCallbacks.PERMISSION_REQUEST_SUCCESS(data);
                    }
                },
                OPERATION_REQUEST_SUCCESS: {
                    handler: async (data) => {
                        this.hash = data.output.transactionHash;
                        await defaultEventCallbacks.OPERATION_REQUEST_SUCCESS(data);
                    }
                }
            }
        },
        async getClient(isLast = true) {
            return await Wallet.getClient((this.network), this.getWalletEventHandlers(), isLast);
        },
        async beaconWallet() {
            let account = Wallet.getLastUsedAccount();
            if (!account) { 
                let client = await this.getClient(false);  
                account = Wallet.getLastUsedAccount();
                return {client, account}
            }

            let client = await this.getClient(true);
            return {client, account};
        },
        validateAmount(value) {
            let nat = parseInt(value);
            if (nat <= 0) {
                return 'Amount must be positive';
            }
            if (value.length > 1 && value[0] === '0') {
                return "Amount can't starts from zero";
            }
            return true;
        }
    },
    watch: {
        value(newValue) {
            if (newValue) {
                this.hash = undefined;
            }
        }
    }
}
</script>