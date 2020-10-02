<template>
  <v-row>
    <v-col cols="2">
      <v-skeleton-loader :loading="loading" type="image">
        <v-img :src="dapp.logo" width="200" aspect-ratio="1" class="rounded-logo mt-1" contain></v-img>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6">
      <v-skeleton-loader :loading="loading" type="list-item-three-line">
        <div>
          <h2>{{ dapp.name }}</h2>
          <span class="subtitle-1 text--secondary">{{ dapp.short_description }}</span>
          <p class="body-1">{{ dapp.authors.join(', ') }}</p>

          <p class="body-2">{{ dapp.full_description }}</p>
        </div>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="4" class="d-flex justify-center align-center" v-if="dapp.website">
      <v-skeleton-loader :loading="loading" type="button">
        <v-btn class="primary" depressed :href="dapp.website" target="_blank">Use {{ dapp.name }}</v-btn>
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
};
</script>

<style lang="scss" scoped>
.rounded-logo {
  border-radius: 10px;
}
</style>