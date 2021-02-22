<template>
  <v-card v-if="tokenHolders && tokenHolders.length > 0" class="mr-6 mt-4" flat outlined>
    <v-card-text class="pa-0 pt-6 pb-4 data">
      <h2 class="ml-6 font-weight-regular">Top holders</h2>
      <v-row class="canvas mx-6 mt-6" no-gutters>
        <v-col cols="6">
          <v-list class="canvas">
            <v-list-item v-for="(item, i) in tokenHolders" v-bind:key="item.address">
              <v-list-item-content class="pa-0 pl-4">
                <v-list-item-title
                    class="font-weight-light hash"
                >
                  <AccountBox
                      :address="item.address"
                      :network="token.network"
                      :title="`Holder ${i + 1}`"
                  />
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action class="pa-0">
                <v-list-item-action-text>
                  <span class="hash text--primary" style="font-size: 1.2em;">
                    {{ formatBalance(item.balance) }}
                  </span>
                  <span v-if="token.symbol">&nbsp;{{ token.symbol }}</span>
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6">
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import AccountBox from "@/components/Dialogs/AccountBox";

export default {
  name: "TokenHolders",
  components: { AccountBox },
  props: {
    token: Object
  },
  watch: {
    token: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          if (this.cache[newVal.token_id] === undefined) {
            this.cache[newVal.token_id] = await this.getHolders(newVal);
          }
          this.tokenHolders = this.cache[newVal.token_id];
        }
      }
    }
  },
  methods: {
    async getHolders(token) {
      const res = await this.api.getTokenHoldersList(token.network, token.contract, token.token_id);
      if (res) {
        return Object.entries(res)
          .sort((a, b) => Math.sign(b[1] - a[1]))
          .map(([address, balance]) => { return { address, balance }})
          .slice(0, 5);
      } else {
        return []
      }
    },
    formatBalance(balance) {
      return this.helpers
          .round(
              balance,
              this.token.decimals ? this.token.decimals : 0
          )
          .toLocaleString(undefined, {
            maximumFractionDigits: this.token.decimals
                ? this.token.decimals
                : 0,
          })
    },
  },
  data() {
    return {
      cache: {},
      tokenHolders: []
    }
  }
}
</script>
