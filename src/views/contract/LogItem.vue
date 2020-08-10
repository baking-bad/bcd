<template>
  <v-list-item>
    <template v-if="log.kind == 'bootstrap'">
      <v-list-item-avatar>
        <v-icon color="blue">mdi-information-outline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="caption">Vesting contract</v-list-item-title>
        <v-list-item-subtitle>
          <span class="caption text--secondary">{{ log.timestamp | formatDate }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-else-if="log.kind == 'lambda'">
      <v-list-item-avatar>
        <v-icon color="purple">mdi-alert-outline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="caption">Potential change in logic</v-list-item-title>
        <v-list-item-subtitle>
          <span class="caption text--secondary">{{ log.timestamp | formatDate }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          small
          target="_blank"
          :to="{name: 'operation_group', params: {network, hash: log.hash}}"
        >
          <v-icon small class="mr-2">mdi-open-in-new</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
    <template v-else-if="log.kind == 'update'">
      <v-list-item-avatar>
        <v-icon color="orange">mdi-alert-outline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="caption">Code was altered</v-list-item-title>
        <v-list-item-subtitle>
          <span class="caption text--secondary">{{ log.timestamp | formatDate }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          small
          target="_blank"
          :to="{name: 'diff', query: {
                  addressA: address, 
                  networkA: network, 
                  protocolA: log.prev_protocol,
                  levelA: Math.max(0, log.level - 4096),
                  addressB: address,
                  networkB: network,
                  protocolB: log.protocol,
                  levelB: log.level
                }}"
        >
          <v-icon small class="mr-1">mdi-directions-fork</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script>
export default {
  name: "Loglog",
  props: {
    log: Object,
    network: String,
    address: String
  },
};
</script>