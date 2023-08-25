<template>
    <v-list>
        <v-list-item style="height: 74px">
            <v-list-item-content two-line>
                <v-list-item-title class="headline">
                    <v-tooltip bottom :disabled="alias && alias.length < 25">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on" style="cursor: inherit;">{{ alias ? alias : address }}</span>
                        </template>
                        <span>{{ alias ? alias : address }}</span>
                    </v-tooltip>                
                </v-list-item-title>
                <v-list-item-subtitle>
                    <span class="overline" :class="network === 'mainnet' ? 'secondary--text' : ''">{{ network }}</span>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-subtitle class="overline"
                >Was active</v-list-item-subtitle
                >
                <v-list-item-title class="body-2">
                    {{ helpers.formatDatetime(contract.last_action) }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="balance">
            <v-list-item-content>
                <v-list-item-subtitle class="overline"
                >Balance</v-list-item-subtitle
                >
                <v-list-item-title class="body-2">
                    <span>{{ balance | uxtz }}</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>

export default {
  name: "AccountInfo",
  props: {
    address: String,
    network: String,
    alias: String,
    contract: Object,
    balance: Number,
  },
  components: {
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  },
};
</script>
