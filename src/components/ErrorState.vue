<template>
    <v-row no-gutters>
      <v-col cols="6" class="d-flex align-center justify-center">
        <div class="ml-10 pl-10 flex-column d-flex align-center justify-center">
          <span class="display-2">This wasn't planned 😓</span>
          <div class="headline font-weight-light mt-3 d-flex flex-column align-center justify-center">
            <template v-if="code === 404 && address">
              <span>We couldn't find what you are looking for, but...</span>
              <v-btn 
                depressed x-large class="mt-3" target="_blank" 
                :href="getTzKTLink(address)">
                <span>Try tzkt</span>
                <v-img 
                  class="img-catava" 
                  :src="`https://services.tzkt.io/v1/avatars/${address}`"></v-img>
              </v-btn>
            </template>
            <template v-else>
              <span>If this error continues to appear, please contact us:</span>
              <div class="mt-3">
                  <a class="mr-3" href="https://github.com/baking-bad" target="_blank" rel="nofollow noopener"><i class="mdi mdi-github" style="font-size:36px;"></i></a>
                  <a class="mr-3" href="https://twitter.com/TezosBakingBad" target="_blank" rel="nofollow noopener"><i class="mdi mdi-twitter" style="font-size:36px;"></i></a>
                  <a class="mr-4" href="tg://resolve?domain=baking_bad_chat"><i class="mdi mdi-telegram" style="font-size:36px;"></i></a>
                  <a class="mr-4" href="https://tezos-dev.slack.com/archives/CV5NX7F2L" target="_blank" rel="nofollow noopener"><i class="mdi mdi-slack" style="font-size:36px;"></i></a>
                  <a href="mailto:hello@baking-bad.org"><i class="mdi mdi-email" style="font-size:36px;"></i></a>
              </div>
            </template>
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <v-img
          src="@/assets/error-ops.png"
          contain
          max-height="70vh"
        ></v-img>
      </v-col>
    </v-row>
</template>

<script>
import { getTzKTLink } from "@/utils/tzkt.js";

export default {
  name: "ErrorState",
  props: {
    code: Number
  },
  computed: {
    address() {
      return this.$route.params.address;
    }
  },
  methods: {
    getTzKTLink(address) {
      return getTzKTLink(this.$route.params.network, address);
    }
  }
};
</script>

<style scoped>
.img-catava {
  max-width: 50px;
  max-height: 50px;
}
</style>