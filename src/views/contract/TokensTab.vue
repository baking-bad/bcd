<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row no-gutters>
      <v-col class="pa-2">
        <TransferList :address="address" :network="network" :token="token" />
      </v-col>
      <v-col cols="3" class="pa-2">
        <v-card flat outlined rounded>
          <v-skeleton-loader :loading="loading" type="list-item@5">
            <v-list class="py-0 item">
              <AccountBox
                v-if="tokens && tokens.length > 0 && tokens[0].registry_address"
                title="Metadata Registry"
                :address="tokens[0].registry_address"
                :network="network"
                gutters
              />

              <v-list-item-group v-model="selectedToken" mandatory>
                <template v-for="(token) in tokens">
                  <v-list-item :key="token.token_id">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ token.name }}
                        <span
                          v-if="token.symbol"
                          class="overline"
                        >({{ token.symbol }})</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="`divider-${token.token_id}`" />
                </template>
              </v-list-item-group>
            </v-list>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AccountBox from "@/components/Dialogs/AccountBox.vue";
import TransferList from "@/views/contract/TransferList.vue";

export default {
  name: "ContractTokensTab",
  props: {
    tokens: Array,
    network: String,
    address: String,
  },
  components: {
    AccountBox,
    TransferList
  },
  computed: {
    token() {
      if (this.selectedToken < 0 || this.selectedToken >= this.tokens.length)
        return null;
      return this.tokens[this.selectedToken];
    },
  },
  data: () => ({
    loading: false,
    selectedToken: -1,
  }),
  watch: {
    tokens: function () {
      this.selectedToken = 0;
    }
  },
};
</script>

<style scoped>
.item {
  background-color: var(--v-canvas-base);
  opacity: 0.8;
}
</style>
