<template>
  <div v-if="tokens" class="ma-0 pa-0">
    <v-data-table
      :items="tokens"
      :page.sync="tokensPage"
      :items-per-page="9"
      hide-default-header
      hide-default-footer
      class="elevation-0"        
      @page-count="tokensPageCount = $event"
    >
      <template v-slot:item="{ item }">
        <v-list-item two-line @click="selectedToken = item" :key="`${item.contract}:${item.token_id}`" 
            :class="item == selectedToken ? 'token-card token-card-selected' : 'token-card'">
          <v-list-item-avatar class="my-0 mr-2">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small icon class="text--disabled" @click.prevent.stop="openToken(item)">
                  <v-icon small>mdi-open-in-new</v-icon>
                </v-btn>
              </template>
              <span>View contract</span>
            </v-tooltip>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.name">{{ item.name }}</span>
              <span v-else v-html="helpers.shortcut(item.contract)"></span>
            </v-list-item-title>
            <v-list-item-subtitle>
              <span class="caption text--disabled">token ID:</span>
              <span>&nbsp;{{ item.token_id }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              <span class="hash text--primary" style="font-size: 1.2em;">
                {{ getItemValue(item) }}
              </span>
              <span class="caption text-uppercase font-weight-regular text--secondary">
                &nbsp;{{ item.symbol ? item.symbol : '' }}
              </span>
            </v-list-item-action-text>
            <v-list-item-action-text>
              <span class="text--disabled">balance</span>
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
  name: "TransfersCard",
  props: {
    tokens: Array
  },
  watch: {
    tokens: {
      immediate: true,
      handler: function(newVal) {
        if (this.selectedToken === null && newVal && newVal.length > 0) {
          this.selectedToken = newVal[0];
        }
      }
    },
    selectedToken: {
      handler(newVal) { 
        this.$emit('selectedToken', newVal)
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    getItemValue(item) {
      return this.helpers
          .round(
              item.balance,
              item.decimals ? item.decimals : 0
          )
          .toLocaleString(undefined, {
            maximumFractionDigits: item.decimals
                ? item.decimals
                : 0,
          })
    },
    openToken(item) {
      const path = { path: `/${item.network}/${item.contract}/tokens` };  // ?token_id=${item.token_id}
      window.open(this.$router.resolve(path).href, "_blank");
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