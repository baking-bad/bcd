<template>
  <div>
    <header>
      <h3 class="text--secondary font-weight-regular header-table">Network Info</h3>
    </header>
    <div class="ba-1 bg-database px-4 py-2 mt-4 radius-1">
      <v-list-item
        class="pl-0"
        v-for="(field, pos) in networkObjInfo"
        :key="pos"
      >
        <v-list-item-content>
          <v-list-item-subtitle class="overline"
          >{{ field.name }}</v-list-item-subtitle
          >
          <v-list-item-title class="body-2">
            {{ state[field.key] }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "NetworkInfo",
  props: {
    state: Object,
  },
  data() {
    return {
      networkObjInfo: [
        {
          name: 'Chain ID',
          key: 'chain_id',
        },
        {
          name: 'Protocol',
          key: 'protocol',
        },
        {
          name: 'Head Level',
          key: 'level',
        },
        {
          name: 'Head Hash',
          key: 'hash',
        },
        {
          name: 'Hard Gas Limit per Operation',
          key: 'hard_gas_limit_per_operation',
        },
        {
          name: 'Hard Storage Limit per Operation',
          key: 'hard_storage_limit_per_operation',
        },
        {
          name: 'Time Between Blocks',
          key: 'time_between_blocks',
        },
        {
          name: 'Cost per byte',
          key: 'cost_per_byte',
        }
      ]
    }
  }
}
</script>