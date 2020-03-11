<template>
  <v-card max-height="100%">
    <v-row no-gutters>
      <v-col cols="4" class="d-flex align-center">
        <div class="ml-10 pl-10">
          <span class="display-2">Oooops...</span>
          <p class="subtitle-2 text-uppercase grey--text text--darken-2">Something went wrong</p>
        </div>
      </v-col>
      <v-col cols="8">
        <v-img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/05272223957341.5632ba907b4a0.jpg"
          contain
          max-height="70vh"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "ErrorState"
};
</script>