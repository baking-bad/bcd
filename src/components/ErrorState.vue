<template>
    <v-row no-gutters>
      <v-col cols="6" class="d-flex align-center justify-center">
        <div class="ml-8 pl-8 flex-column d-flex align-center justify-center">
          <span class="display-2">This wasn't planned 😓</span>
          <div class="headline font-weight-light mt-3 d-flex flex-column align-center justify-center">
            <template v-if="code === 404 && address && tzkt.supports(network)">
              <span>We couldn't find what you are looking for, but...</span>
              <v-btn 
                depressed x-large class="mt-3" target="_blank" 
                :href="tzkt.resolve(network, address)">
                <span>Try tzkt</span>
                <v-img 
                  class="img-catava" 
                  :src="`https://services.tzkt.io/v1/avatars/${address}`"></v-img>
              </v-btn>
            </template>
            <template v-else>
              <span>If this error continues to appear, please contact us:</span>
              <div class="mt-3">
                <v-btn 
                  v-for="(link, i) in links" 
                  :key="i"
                  icon
                  x-large
                  color="primary"
                  :href="link.href"
                  target="_blank"
                  rel="nofollow noopener">
                  <v-icon x-large>{{ link.icon }}</v-icon>
                </v-btn>
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
export default {
  name: "ErrorState",
  props: {
    code: Number,
  },
  data: () => ({
    links: [
      {
        'href': 'https://github.com/baking-bad/bcd/issues',
        'icon': 'mdi-github'
      },
      {
        'href': 'https://twitter.com/TezosBakingBad',
        'icon': 'mdi-twitter'
      },
      {
        'href': 'tg://resolve?domain=baking_bad_chat',
        'icon': 'mdi-telegram'
      },
      {
        'href': 'https://tezos-dev.slack.com/archives/CV5NX7F2L',
        'icon': 'mdi-slack'
      },
      {
        'href': 'mailto:hello@baking-bad.org',
        'icon': 'mdi-email'
      }
    ]
  }),
  computed: {
    address() {
      return this.$route.params.address;
    },
    network() {
      return this.$route.params.network;
    }
  },
};
</script>

<style scoped>
.img-catava {
  max-width: 50px;
  max-height: 50px;
}
</style>