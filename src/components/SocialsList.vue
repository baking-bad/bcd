<template>
  <div>
    <v-btn
      icon
      class="white--text"
      href="https://github.com/baking-bad/bcd"
      target="_blank"
      rel="nofollow noopener"
      @click="sendSocialGtag('Github')"
    >
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn
      icon
      class="white--text"
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