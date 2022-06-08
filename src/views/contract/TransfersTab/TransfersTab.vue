<template>
  <v-container class="canvas fill-canvas pa-8 ma-0" fluid>
    <v-row no-gutters>
      <v-col cols="12" class="pa-2">
        <InfoCard>
          <span
            >The information you are looking for is no longer available on BCD,
            please use
          </span>
          <a v-if="network !== 'jakartanet'" :href="tzkt_link" target="_blank">TzKT.io</a>
          <span v-else></span>
          <span> for this particular case</span>
        </InfoCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InfoCard from "@/components/Cards/InfoCard.vue";

let sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

export default {
  name: "TransfersTab",
    components: {
    InfoCard,
  },
  props: {
    contract: Object,
    address: String,
    network: String,
  },
  computed: {
    tzkt_link() {
      return sanitizeUrl(`https://${this.network}.tzkt.io/${this.address}/balances`);
    }
  }
};
</script>
