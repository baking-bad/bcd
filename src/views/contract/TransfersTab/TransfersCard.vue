<template>
    <v-card flat outlined rounded>
      <v-list class="py-0">
        <v-list-item-group v-model="selectedToken" mandatory>
          <template v-for="(item, i) in balances">
            <v-list-item :key="i" two-line>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="item.name">{{ item.name }}</span>
                  <span v-else-if="item.symbol">{{ item.symbol }}</span>
                  <v-row v-else>
                    <v-col class="pt-0 pb-0" cols="6">
                      <span v-html="helpers.shortcut(item.contract)"></span>
                    </v-col>
                    <v-col class="text-right pt-0 pb-0" cols="6">
                                            <span>{{
                                                helpers
                                                    .round(
                                                        item.balance,
                                                        item.decimals ? item.decimals : 0
                                                    )
                                                    .toLocaleString(undefined, {
                                                      maximumFractionDigits: item.decimals
                                                          ? item.decimals
                                                          : 0,
                                                    })
                                              }}</span
                                            >&nbsp;
                      <span
                          class="caption text-uppercase font-weight-regular text--disabled"
                      >{{
                          item.symbol ? item.symbol : item.token_id
                        }}</span
                      >
                    </v-col>
                  </v-row>
                </v-list-item-title>

                <v-list-item-subtitle>
                  <span class="caption text--disabled">token ID:</span>
                  <span> {{item.token_id}}</span>
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
</template>

<script>
export default {
  name: "TransfersCard",
  props: {
    balances: Array,
    defaultSelectedToken: Number,
  },
  watch: {
    defaultSelectedToken(newVal) {
      this.selectedToken = newVal;
    },
    selectedToken: {
      handler(newVal) {
        this.$emit('selectedToken', newVal)
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.selectedToken = this.defaultSelectedToken
  },
  data() {
    return {
      selectedToken: 0,
    }
  }
}
</script>
