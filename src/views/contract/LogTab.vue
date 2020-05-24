<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line"
    ></v-skeleton-loader>
    <template v-for="(item, idx) in migrations">
      <template v-if="item.kind == 'bootstrap'">
        <v-alert :key="idx" prominent text type="info">
          <v-row no-gutters align="center">
            <v-col cols="6" class="d-flex flex-column pl-4">
              <span class="hash">Vesting contract</span>
              <span class="text--secondary body-1">Contract was originated during the <b class="hash">{{ item.protocol.slice(0, 8) }}</b> activation</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="2" class="text-right pr-4">
              <span class="body-1 text--secondary">{{ item.timestamp | formatDate }}</span>
            </v-col>
          </v-row>
        </v-alert>
      </template>
      <template v-else-if="item.kind == 'lambda'">
        <v-alert :key="idx" prominent text type="warning">
          <v-row no-gutters align="center">
            <v-col cols="6" class="d-flex flex-column pl-4">
              <span class="hash">Potential change in logic</span>
              <span class="text--secondary body-1">One or more stored lambda expressions were altered</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn text small class="text--secondary" target="_blank"
                :to="{name: 'operation_group', params: {network, hash: item.hash}}">
                <v-icon small class="mr-2">mdi-open-in-new</v-icon>view operation
                </v-btn>
            </v-col>
            <v-col cols="2" class="text-right pr-4">
              <span class="body-1 text--secondary">{{ item.timestamp | formatDate }}</span>
            </v-col>
          </v-row>
        </v-alert>
      </template>
      <template v-else-if="item.kind == 'update'">
        <v-alert :key="idx" prominent text type="warning">
          <v-row no-gutters align="center">
            <v-col cols="6" class="d-flex flex-column pl-4">
              <span class="hash">Potential change in logic</span>
              <span class="text--secondary body-1">Contract code was altered during the <b>{{ item.protocol.slice(0, 8) }}</b> update</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn text small class="text--secondary" target="_blank"
                :to="{name: 'diff', query: {
                  addressA: address, 
                  networkA: network, 
                  protocolA: item.prev_protocol,
                  levelA: Math.max(0, item.level - 4096),
                  addressB: address,
                  networkB: network,
                  protocolB: item.protocol,
                  levelB: item.level
                }}">
                <v-icon small class="mr-1">mdi-directions-fork</v-icon>view code diff
              </v-btn>
            </v-col>
            <v-col cols="2" class="text-right pr-4">
              <span class="body-1 text--secondary">{{ item.timestamp | formatDate }}</span>
            </v-col>
          </v-row>
        </v-alert>        
      </template>
      <v-divider v-if="idx < migrations.length - 1" :key="idx + migrations.length" />
    </template>
  </v-container>
</template>

<script>
export default {
  name: "LogTab",
  props: {
    migrations: Array,
    network: String,
    address: String
  },
  computed: {
    loading() {
      return !this.migrations || this.migrations.length === 0;
      // if someone goes through a direct link to a contract with no migrations, well...
    }
  }
};
</script>

<style lang="scss" scoped>
.on-hover {
  background-color: #99999950;
  cursor: pointer;
}
.migration-row {
  padding: 7px 20px;
  min-height: 58px;
  background-color: var(--v-sidebar-base);
  border: 1px solid var(--v-border-base);
  border-radius: 3px;
}

.lambda, .protocol {
  border-left: 3px solid var(--v-warning-base);
}

.vesting {
  border-left: 3px solid var(--v-secondary-base);
}

</style>