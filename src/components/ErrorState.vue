<template>
  <v-card max-height="100%">
    <v-row no-gutters>
      <v-col cols="4" class="d-flex align-center">
        <div class="ml-10 pl-10">
          <span class="display-2">Oooops...</span>
          <p class="subtitle-1 text-uppercase grey--text text--darken-2">Something went wrong</p>
        </div>
      </v-col>
      <v-col>
          <v-img src="/empty.jpg" contain max-height="100vh"></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "ErrorState"
};
</script>