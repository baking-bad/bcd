<template>
    <v-list>
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
            <LongBox :network="network" title="Genesis commitment" :text="smartRollup.genesis_commitment_hash"/>
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
            <LongBox :hex="true" :network="network" title="Kernel" :text="smartRollup.kernel"/>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle class="overline"
                    >Type</v-list-item-subtitle
                    >
                    <v-list-item-title class="body-2">
                        <TypeDef :typedef="smartRollup.type" class="body-2"/>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-skeleton-loader>
    </v-list>
</template>

<script>
import LongBox from "@/components/Dialogs/LongBox.vue";
import TypeDef from "@/views/contract/TypeDef.vue";

export default {
  name: "SmartRollupInfo",
  props: {
    address: String,
    network: String,
    alias: String,
  },
  components: {
    TypeDef,
    LongBox,
  },
  data: () => ({
    infoLoading: true,
    smartRollup: {},
  }),
  mounted() {
    this.getInfo();
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
