<template>
  <div v-if="rating && rating.count > 0" class="d-flex flex-horizontal align-center justify-end">
    <v-avatar v-for="(item, idx) in rating.users" :key="idx" size="20" :class="idx != 0 ? 'shifted elevation-2' : 'elevation-2'">
      <img :src="item.avatarURL" :alt="item.login" />
    </v-avatar>
    <span class="subtitle-2 grey--text text--darken-1 ml-2">{{ rating.count }}</span>
  </div>
</template>

<script>
export default {
  name: "Rating",
  props: {
    rating: null
  }
};
</script>

<style scoped>
.shifted {
    margin-left: -8px;
}
</style>