<template>
  <div>
    <v-btn
      icon
      class="text--secondary mr-2"
      href="tg://resolve?domain=baking_bad_chat"
      target="_blank"
      rel="nofollow noopener"
      @click="sendSocialGtag('Telegram')"
    >
      <v-icon>mdi-telegram</v-icon>
    </v-btn>
    <v-btn
      icon
      class="text--secondary mr-2"
      href="https://twitter.com/TezosBakingBad"
      target="_blank"
      rel="nofollow noopener"
      @click="sendSocialGtag('Twitter')"
    >
      <v-icon>mdi-twitter</v-icon>
    </v-btn>
    <v-btn
      icon
      class="text--secondary"
      href="https://github.com/baking-bad/bcd"
      target="_blank"
      rel="nofollow noopener"
      @click="sendSocialGtag('Github')"
    >
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn
      icon
      class="text--secondary"
      href="https://discord.gg/aG8XKuwsQd"
      target="_blank"
      rel="nofollow noopener"
      @click="sendSocialGtag('Discord')"
    >
      <v-icon>mdi-discord</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "SocialsList",
  methods: {
    sendSocialGtag(name) {
      if (this.$gtag) {
        this.$gtag.event('Social Click', {
          "event_category": name,
          "event_label": this.$router.currentRoute.fullPath
        });
      }
    }
  }
}
</script>