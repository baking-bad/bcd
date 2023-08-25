<template>
    <v-list>
        <v-skeleton-loader
            :loading="isLoading"
            type="list-item-two-line, list-item-two-line"
        >
            <v-list-item style="height: 74px">
                <v-list-item-content two-line>
                    <v-list-item-title class="headline">
                    <v-tooltip bottom :disabled="alias && alias.length < 25">
                        <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on" style="cursor: inherit;">{{ alias ? alias : address }}</span>
                        </template>
                        <span>{{ alias ? alias : address }}</span>
                    </v-tooltip>                
                    </v-list-item-title>
                    <v-list-item-subtitle>
                    <span
                    class="overline"
                    :class="network === 'mainnet' ? 'secondary--text' : ''"
                    >{{ network }}</span
                    >
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle class="overline"
                    >Was active</v-list-item-subtitle
                    >
                    <v-list-item-title class="body-2">
                    {{ helpers.formatDatetime(contract.timestamp) }}
                    <span v-if="contract.last_action > contract.timestamp">—
                            {{ helpers.formatDatetime(contract.last_action) }}</span
                    >
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="balance">
                <v-list-item-content>
                    <v-list-item-subtitle class="overline"
                    >Balance</v-list-item-subtitle
                    >
                    <v-list-item-title class="body-2">
                        <span>{{ balance | uxtz }}</span>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <AccountBox
                v-if="contract.manager"
                title="Deployed by"
                :address="contract.manager"
                :network="contract.network"
                gutters
            />
            <AccountBox
                v-if="contract.delegate"
                title="Delegated to"
                :address="contract.delegate"
                :network="contract.network"
                gutters
            />
            <v-list-item v-if="usedBytes">
                <v-list-item-content>
                    <v-list-item-subtitle class="overline">Storage used</v-list-item-subtitle>
                    <v-list-item-title class="body-2">
                    <span>{{ parseInt(usedBytes).toLocaleString('en-US') }} bytes</span>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="paidUsed">
                <v-list-item-content>
                    <v-list-item-subtitle class="overline"
                    >Storage paid</v-list-item-subtitle
                    >
                    <v-list-item-title class="body-2">
                    <span>{{ parseInt(paidUsed).toLocaleString('en-US') }} bytes</span>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-skeleton-loader>
    </v-list>
</template>

<script>

import AccountBox from "../../../components/Dialogs/AccountBox.vue";

export default {
  name: "ContractInfo",
  props: {
    contract: Object,
    address: String,
    network: String,
    alias: String,
    balance: Number,
  },
  components: {
    AccountBox,
  },
  data: () => ({
    isUsedBytesLoading: true,
    usedBytes: null,
    isPaidUsedLoading: true,
    paidUsed: null,
  }),
  mounted() {
    this.getInfo();
  },
  computed: {
    isLoading() {
        return this.isUsedBytesLoading || this.isPaidUsedLoading
    }
  },
  methods: {
    getInfo() {
      this.getUsedBytes()
      this.getPaidUsed()
    },
    async getUsedBytes() {
      this.usedBytes = await this.rpc.getStorageUsedBytesByContract(this.network, this.address)
        .catch(err => {
          console.log(err);
          return null;
        })
        .finally(() => (this.isUsedBytesLoading = false))
    },
    async getPaidUsed() {
      this.paidUsed = await this.rpc.getStoragePaidUsedByContract(this.network, this.address)
        .catch(err => {
          console.log(err);
          return null;
        })
        .finally(() => (this.isPaidUsedLoading = false))
    },
  },
};
</script>
