<template>
  <div class="d-flex flex-column align-center justify-center">
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" small icon @click="random" :loading="pickingRandom">
          <v-icon color="grey lighten-2">mdi-dice-3-outline</v-icon>
        </v-btn>
      </template>
      <span>Pick random</span>
    </v-tooltip>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "PickRandomButton",
  data: () => ({
    pickingRandom: false,
  }),
  methods: {
    ...mapActions({
      showError: "showError",
    }),
    random() {
      if (this.pickingRandom) return;
      this.pickingRandom = true;
      this.api
        .getRandomContract()
        .then((res) => {
          this.$router.push({ path: `/${res.network}/${res.address}` });
        })
        .catch((err) => {
          if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        })
        .finally(() => {
          this.pickingRandom = false;
        });
    },
  }
}
</script>

<style scoped>

</style>