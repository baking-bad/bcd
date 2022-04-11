<template>
  <div class="ma-0 pa-0">
    <v-card flat outlined>
      <v-list class="ma-0 pa-0 data">
        <v-list-item-group
          active-class="token-card-selected"
          mandatory
        >
          <template v-for="(item, i) in tokens">
            <v-divider :key="`${i}-divider`" v-if="i !== 0" />
            <v-list-item @click="selectedToken = item" :key="`${item.contract}:${item.token_id}`" class="token-card">
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="item.name">{{ item.name }}</span>
                  <span v-else class="text--disabled">NO NAME</span>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  <span class="caption text--disabled">token ID:</span>
                  <span>&nbsp;{{ item.token_id }}</span>
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="text-center mt-2">
      <v-pagination
        v-model="tokensPage"
        :length="tokensPageCount"
        :total-visible="5"
        v-if="tokensTotal > itemsPerPage"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "TokensList",
  props: {
    network: String,
    address: String,
    tokensTotal: Number
  },
  methods: {
    getTokens(offset, size) {
      this.api
        .getContractTokens(this.network, this.address, offset, size)
        .then((res) => {
          if (!res) return;
          this.tokens = res;
          this.selectedToken = this.tokens[0];
        })
        .catch((err) => {
          this.showError(err);
        })
    },
  },
  watch: {
    tokensPage: {
      handler(newVal) {
        this.getTokens((newVal - 1) * this.itemsPerPage, this.itemsPerPage)
      },
      immediate: true
    },
    tokensTotal: {
      handler(newVal) { 
        this.tokensPageCount = Math.ceil(newVal / this.itemsPerPage);
      },
      immediate: true
    },
    selectedToken: {
      handler(newVal) { 
        this.$emit('selectedToken', newVal)
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      tokens: [],
      selectedToken: null, 
      tokensPage: 1,
      itemsPerPage: 10,
      tokensPageCount: 0
    }
  }
}
</script>

<style scoped>
.token-card {
  border-bottom: 1px solid var(--v-border-base);
}

.token-card:last-child {
  border-bottom: none !important;
}

.token-card-selected {
  border-left: 2px solid var(--v-primary-base);
  background-color: var(--v-sidebar-base);
}
</style>