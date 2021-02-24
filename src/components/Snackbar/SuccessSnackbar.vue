<template>
  <v-snackbar :value="$store.state.success" color="primary" :timeout="2000" @input="hideSuccess" top>
    <v-icon class="mr-3">mdi-check-circle-outline</v-icon>  
   {{ $store.state.success }}
    <v-btn text @click="hideSuccess">OK</v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SuccessSnackbar",
  methods: {
    ...mapActions(["hideSuccess"])
  }
};
</script>