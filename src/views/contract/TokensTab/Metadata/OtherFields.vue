<template>
  <v-list class="fields-wrapper" ref="list">
    <v-subheader class="title">Other Fields</v-subheader>
    <v-list-item>
      <vue-json-pretty
          :data="token"
          :deep="1"
      />
    </v-list-item>
  </v-list>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  name: "OtherFields",
  components: {
    VueJsonPretty
  },
  props: {
    token: Object,
  }
}
</script>
<style lang="scss">
.fields-wrapper {
  .v-list-item {
    min-height: 32px;
    &__title {
      span {
        font-size: 0.75rem;
      }
    }
  }
  .vjs-tree {
    font-size: 0.75rem;
    color: #9e9e9e;
  }
}
</style>
