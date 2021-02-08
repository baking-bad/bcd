<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row no-gutters>
      <v-col cols="9" class="pa-2">
        <MetadataToken :token="token"/>
        <v-skeleton-loader v-show="isHoldersListLoading" :loading="isHoldersListLoading" type="image" class="mt-3">
        </v-skeleton-loader>
        <HoldersInfo
            v-show="!isHoldersListLoading && token && holders[token.token_id]"
            class="mt-3"
            :holders="sortedCurrentHolder"
            :token="token.symbol"
        />
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
import AccountBox from "@/components/AccountBox.vue";
import MetadataToken from "@/views/contract/TokensTab/Metadata/MetadataToken";
import HoldersInfo from "@/views/contract/TokensTab/Metadata/HoldersInfo";

export default {
  name: "ContractTokensTab",
  props: {
    tokens: Array,
    network: String,
  },
  components: {
    HoldersInfo,
    MetadataToken,
    AccountBox,
  },
  computed: {
    token() {
      if (this.selectedToken < 0 || this.selectedToken >= this.tokens.length)
        return null;
      return this.tokens[this.selectedToken];
    },
    sortedCurrentHolder() {
      return Object.fromEntries(Object.entries(this.holders[this.token.token_id])
          .sort((item1, item2) => Number(item2[1]) - Number(item1[1])));
    },
  },
  data: () => ({
    loading: false,
    isHoldersListLoading: false,
    selectedToken: -1,
    holders: {},
  }),
  watch: {
    tokens: function () {
      this.selectedToken = 0;
    },
    async token(newVal) {
      if (!this.holders[newVal.token_id]) {
        this.isHoldersListLoading = true;
        const data = await this.api.getTokenHoldersList(this.network, newVal.contract, newVal.token_id);
        this.isHoldersListLoading = false;
        this.$set(this.holders, newVal.token_id, data);
      }
    },
  },
};
</script>

<style scoped>
.item {
  background-color: var(--v-canvas-base);
  opacity: 0.8;
}
</style>
