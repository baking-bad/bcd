<template>
  <v-card flat outlined rounded>
    <v-list class="py-0 item">
      <v-list-item-group v-model="selectedToken" mandatory>
        <template v-for="(token) in tokens">
          <v-list-item
              :key="token.token_id"
              :class="!isSelectShown ? 'v-list-item--inactive v-item--inactive' : ''"
              @click="changeSelectedToken(token.token_id)"
          >
            <v-row>
              <v-col cols="8" class="pa-0 pl-3 pr-3">
                <v-list-item-content>
                  <v-list-item-title>
                    <span v-if="token.name">{{ token.name }}</span>
                    <span v-else v-html="helpers.shortcut(token.contract)"></span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span
                        v-if="isTokenSupply"
                        class="caption text--disabled"
                    >token ID: {{ token.token_id }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col cols="3" class="pa-0 pr-3">
                <v-list-item-content class="fill-height" v-if="isTokenSupply">
                  <v-list-item-title>
                    {{ tokenSupply }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span
                        v-if="isTokenSupply"
                        class="caption text--disabled"
                    >supply</span>
                  </v-list-item-subtitle>
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
    currentToken: Object,
    preselectedToken: Number,
  },
  computed: {
    tokenSupply() {
      return typeof this.token.total_supply === "number" ? this.token.total_supply : this.token.supply;
    },
    isTokenSupply() {
      return this.token && (typeof this.token.total_supply === "number" ||  typeof this.token.supply === "number");
    },
    token() {
      if (this.selectedToken < 0 || this.selectedToken >= this.tokens.length)
        return null;
      return this.tokens[this.selectedToken];
    },
  },
  mounted() {
    this.selectedToken = this.preselectedToken;
  },
  methods: {
    changeSelectedToken(id) {
      this.selectedToken = this.tokens.findIndex(token => token.token_id === id);
      this.$emit('changeSelectedToken', id);
      this.isSelectShown = true;
    }
  },
  watch: {
    tokens(val) {
      this.isSelectShown = !!val.find(item => item.token_id === this.currentToken.token_id);
      this.selectedToken = val.findIndex(token => token.token_id === this.preselectedToken);
    },
  },
  data() {
    return {
      selectedToken: -1,
      isSelectShown: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list-item--inactive,
.v-item--inactive {
  &::before {
    background: transparent;
  }
}
</style>
