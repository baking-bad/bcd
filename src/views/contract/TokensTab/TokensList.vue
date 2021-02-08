<template>
  <v-card flat outlined rounded>
    <v-list class="py-0 item">
      <v-list-item-group v-model="selectedToken" mandatory>
        <template v-for="(token) in tokens">
          <v-list-item :key="token.token_id">
            <v-row>
              <v-col cols="8" class="pa-0 pl-3 pr-3">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ token.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span
                        v-if="isTokenSupply"
                        class="caption text--disabled"
                    >total_supply: </span>
                    <span>
                      {{ tokenSupply }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col cols="3" class="pa-0 pr-3">
                <v-list-item-content class="fill-height">
                  <span
                      v-if="token.symbol"
                      class="overline text-truncate"
                  >{{ token.symbol }}</span>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider :key="`divider-${token.token_id}`" />
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "TokensList",
  props: {
    tokens: Array,
    preselectedToken: Number,
  },
  computed: {
    tokenSupply() {
      return typeof this.token.total_supply === "number" ? this.token.total_supply : this.token.supply;
    },
    isTokenSupply() {
      return typeof this.token.total_supply === "number" ||  typeof this.token.supply === "number";
    },
    token() {
      if (this.selectedToken < 0 || this.selectedToken >= this.tokens.length)
        return null;
      return this.tokens[this.selectedToken];
    },
  },
  watch: {
    preselectedToken(newVal) {
      this.selectedToken = newVal;
    },
    selectedToken(newVal) {
      this.$emit('changeSelectedToken', newVal);
    },
  },
  data() {
    return {
      selectedToken: 0,
    }
  }
}
</script>
