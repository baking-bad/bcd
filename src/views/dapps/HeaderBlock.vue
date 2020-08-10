<template>
  <v-row>
    <v-col cols="2">
      <v-skeleton-loader :loading="loading" type="image">
        <v-img v-if="logo" :src="logo.link" width="200" aspect-ratio="1" class="rounded-logo"></v-img>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="8">
      <v-skeleton-loader :loading="loading" type="list-item-three-line">
        <div class="mt-2">
          <h2>{{ dapp.name }}</h2>
          <span class="subtitle-1 text--secondary">{{ dapp.short_description }}</span>
          <p class="body-1">{{ dapp.authors.join(', ') }}</p>

          <p class="caption">{{ dapp.full_description }}</p>
        </div>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="2" class="d-flex justify-center align-center" v-if="dapp.website">
      <v-skeleton-loader :loading="loading" type="button">
        <v-btn class="primary" :href="dapp.website" target="_blank">Open {{ dapp.name }}</v-btn>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>


<script>
export default {
  name: "HeaderBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
  computed: {
    logo() {
      for (let i = 0; i < this.dapp.pictures.length; i++) {
        if (this.dapp.pictures[i].type === "logo") {
          return this.dapp.pictures[i];
        }
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.rounded-logo {
  border-radius: 50px;
}
</style>