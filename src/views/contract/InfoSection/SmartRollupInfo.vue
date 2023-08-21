<template>
    <v-list class="contract-list">
        <v-skeleton-loader
            :loading="infoLoading"
            type="list-item-two-line, list-item-two-line"
        >
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
                        {{ helpers.formatDatetime(smartRollup.timestamp) }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle class="overline"
                    >Level</v-list-item-subtitle
                    >
                    <v-list-item-title class="body-2">
                        {{ smartRollup.level }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-dialog v-model="showGenesisCommitment" width="800" @keydown.esc="showGenesisCommitment = false">
                <template v-slot:activator="{ on }">
                    <v-list-item>
                        <v-list-item-content v-on="on">
                            <v-list-item-subtitle class="overline"
                            >Genesis commitment</v-list-item-subtitle
                            >
                            <v-list-item-title class="body-2">
                                {{ smartRollup.genesis_commitment_hash }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <v-card>
                    <v-card-title class="py-3 px-6 align-center sidebar">
                        <span class="body-1 font-weight-medium text-uppercase text--secondary mr-2"
                        >Smart Rollup:
                        </span>
                        <span v-if="alias" class="ml-2 body-1">{{ alias }}</span>
                        <span v-else class="ml-2 body-1" v-html="address"></span>
                        <v-spacer></v-spacer>
                        <span
                            class="caption text-uppercase font-weight-medium"
                            :class="network === 'mainnet' ? 'primary--text' : 'text--secondary'"
                        >{{ network }}</span
                        >
                    </v-card-title>
                    <v-card-text class="pt-7">
                        <v-row no-gutters>
                            <v-col cols="12">
                                <ValueInspector
                                    prim="string"
                                    :value="smartRollup.genesis_commitment_hash"
                                    :network="network"
                                    label="Genesis commitment">
                                </ValueInspector>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle class="overline"
                    >PVM kind</v-list-item-subtitle
                    >
                    <v-list-item-title class="body-2">
                        {{ smartRollup.pvm_kind }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-dialog v-model="showKernel" width="800" @keydown.esc="showKernel = false">
                <template v-slot:activator="{ on }">
                    <v-list-item>
                        <v-list-item-content v-on="on">
                            <v-list-item-subtitle class="overline"
                            >Kernel</v-list-item-subtitle
                            >
                            <v-list-item-title class="body-2">
                                {{ smartRollup.kernel }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <v-card>
                    <v-card-title class="py-3 px-6 align-center sidebar">
                        <span class="body-1 font-weight-medium text-uppercase text--secondary mr-2"
                        >Smart Rollup:
                        </span>
                        <span v-if="alias" class="ml-2 body-1">{{ alias }}</span>
                        <span v-else class="ml-2 body-1" v-html="address"></span>
                        <v-spacer></v-spacer>
                        <span
                            class="caption text-uppercase font-weight-medium"
                            :class="network === 'mainnet' ? 'primary--text' : 'text--secondary'"
                        >{{ network }}</span
                        >
                    </v-card-title>
                    <v-card-text class="pt-7">
                        <v-row no-gutters>
                            <v-col cols="12">
                                <ValueInspector
                                    prim="string"
                                    :value="smartRollup.kernel"
                                    :network="network"
                                    label="Kernel">
                                </ValueInspector>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-skeleton-loader>
    </v-list>
</template>

<script>

import ValueInspector from "@/components/ValueInspector.vue"

export default {
  name: "SmartRollupInfo",
  props: {
    address: String,
    network: String,
    alias: String,
  },
  components: {
    ValueInspector,
  },
  data: () => ({
    infoLoading: true,
    smartRollup: {},
    showGenesisCommitment: false,
    showKernel: false,
  }),
  mounted() {
    this.getInfo();
  },
  computed: {
  },
  methods: {
    getInfo() {
      this.infoLoading = true;
      this.api
        .getSmartRollupInfo(this.network, this.address)
        .then((res) => {
          if (!res) return;
          this.smartRollup = res;
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => (this.infoLoading = false));
    },
  },
};
</script>
