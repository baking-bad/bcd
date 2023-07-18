<template>
  <div>
    <header class="d-flex">
      <h3 class="text--secondary font-weight-regular header-table">Network Info</h3>
      <v-btn @click="showRaw = true" small text class="text--secondary ml-auto">
        <v-icon class="mr-1" small>mdi-code-json</v-icon>
        <span>Constants</span>
      </v-btn>
    </header>
    <div class="ba-1 bg-database px-4 py-2 radius-1" style="margin-top: 19px;">
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
    <RawJsonViewer
      v-model="showRaw"
      type="constants"
      :network="network"
    />
  </div>
</template>

<script>
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";

export default {
  name: "NetworkInfo",
  components: {
    RawJsonViewer,
  },
  props: {
    state: Object,
    network: String
  },
  data() {
    return {
      showRaw: false,
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