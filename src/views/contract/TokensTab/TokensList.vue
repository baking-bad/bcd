<template>
  <div v-if="tokens" class="ma-0 pa-0">
    <v-data-table
      :items="tokens"
      :page.sync="tokensPage"
      :items-per-page="12"
      hide-default-header
      hide-default-footer
      class="elevation-0"        
      @page-count="tokensPageCount = $event"
    >
      <template v-slot:item="{ item }">
        <v-list-item @click="selectedToken = item" :key="`${item.contract}:${item.token_id}`" 
            :class="item == selectedToken ? 'token-card token-card-selected' : 'token-card'">
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
    </v-data-table>
    <div class="text-center mt-2">
      <v-pagination
        v-model="tokensPage"
        :length="tokensPageCount"
        v-if="tokens.length > 10"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "TokensList",
  props: {
    tokens: Array,
    currentToken: Object,
    preselectedToken: Number,
  },
  created() {
    this.selectFirst(this.tokens);
  },
  methods: {
    getTokenSupply(item) {
      return this.helpers
          .round(
              item.supply,
              item.decimals ? item.decimals : 0
          )
          .toLocaleString(undefined, {
            maximumFractionDigits: item.decimals
                ? item.decimals
                : 0,
          })
    },
    selectFirst(tokens) {
      if (tokens && tokens.length > 0) {
        this.selectedToken = tokens[0];
      }
    }
  },
  watch: {
    tokens(newVal) {
      this.selectFirst(newVal);
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
      selectedToken: null, 
      tokensPage: 0,
      tokensPageCount: 0
    }
  }
}
</script>

<style scoped>
table {
  margin: 0 !important;
}

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