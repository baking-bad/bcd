<template>
  <v-snackbar
    :value="showSurvey"
    bottom
    right
    color="warning darken-1"
    :min-width="250"
    :timeout="0"
  >
    <span
      >✌🏻 Please
      <a
        style="
          text-decoration: none;
          color: #fff;
          border-bottom: 1px dotted #fff;
        "
        target="_blank"
        rel="noopener"
        href="https://docs.google.com/forms/d/e/1FAIpQLSes3YQuBFrEIaVoe8EPwCJlLRlK1HpNFTKduF9LJia9iOy3fw/viewform"
        >take the survey</a
      ></span
    >
    <v-btn class="ml-2" small text @click="hideSurvey">DONE</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "SurveySnackbar",
  data: () => ({
    showSurvey: false,
  }),
  mounted() {
    this.showSurvey = localStorage.getItem("showSurvey")
      ? JSON.parse(localStorage.getItem("showSurvey"))
      : true;
  },
  methods: {
    hideSurvey() {
      localStorage.setItem("showSurvey", false);
      this.showSurvey = false;
    },
  },
};
</script>
