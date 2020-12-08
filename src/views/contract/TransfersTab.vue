<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row v-if="balances" no-gutters>
      <v-col cols="9" class="pa-2">
        <TransferList
          :address="address"
          :network="network"
          :token="token"
          :contract="token.contract"
        />
      </v-col>
      <v-col cols="3" class="pa-2">
        <v-card flat outlined rounded>
          <v-list class="py-0">
            <v-list-item-group v-model="selectedToken" mandatory>
              <template v-for="(item, i) in balances">
                <v-list-item :key="i" two-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span v-if="item.name">{{ item.name }}</span>
                      <span v-else-if="item.symbol">{{ item.symbol }}</span>
                      <span v-else
                        >{{ item.contract.substring(0, 10) }} ... ({{
                          item.token_id
                        }})</span
                      >
                    </v-list-item-title>

                    <v-list-item-subtitle>
                      <span>{{
                        helpers
                          .round(
                            item.balance,
                            token.decimals ? token.decimals : 0
                          )
                          .toLocaleString(undefined, {
                            maximumFractionDigits: token.decimals
                              ? token.decimals
                              : 0,
                          })
                      }}</span
                      >&nbsp;
                      <span
                        class="caption text-uppercase font-weight-regular text--disabled"
                        >{{
                          token.symbol ? token.symbol : `tok_${item.token_id}`
                        }}</span
                      >
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  :key="`divider-${i}`"
                  v-if="i < balances.length - 1"
                />
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TransferList from "@/views/contract/TransferList.vue";

export default {
  name: "TransfersTab",
  props: {
    contract: Object,
    network: String,
    address: String,
  },
  components: {
    TransferList,
  },
  computed: {
    balances() {
      if (!this.contract) return [];
      return this.contract.tokens;
    },
    token() {
      if (
        this.selectedToken < 0 ||
        this.selectedToken >= this.contract.tokens.length
      )
        return null;
      return this.contract.tokens[this.selectedToken];
    },
  },
  data: () => ({
    selectedToken: 0,
  }),
};
</script>