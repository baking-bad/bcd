<template>
  <v-container fluid>
    <v-skeleton-loader v-if="loading" height="400" type="image" class="ma-3"></v-skeleton-loader>
    <v-row v-else>
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-btn text icon color="primary" @click="upVote">
          <v-icon>mdi-thumb-up-outline</v-icon>
        </v-btn>
        <v-btn text icon color="red" @click="downVote">
          <v-icon>mdi-thumb-down-outline</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <DiffViewer
          :left="diffs.left"
          :right="diffs.right"
          :nameRight="diffs.name_right"
          :nameLeft="diffs.name_left"
          :added="diffs.added"
          :removed="diffs.removed"
        />
        <v-snackbar v-model="snackbar">
          {{ snacktext }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { getDiff, vote } from "@/api/index.js";

import DiffViewer from "@/components/DiffViewer.vue";

export default {
  name: "Diff",
  components: {
    DiffViewer
  },
  data: () => ({
    diffs: null,
    loading: true,
    snackbar: false,
    snacktext: ""
  }),
  created() {
    this.getDiff();
  },
  methods: {
    ...mapActions(["showError"]),
    getDiff() {
      this.loading = true;
      getDiff(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.network2,
        this.$route.params.address2
      )
        .then(res => (this.diffs = res))
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    upVote() {
      vote(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.network2,
        this.$route.params.address2,
        1
      )
        .then(() => {
          this.snacktext = "Success";
          this.snackbar = true;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    },
    downVote() {
      vote(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.network2,
        this.$route.params.address2,
        0
      )
        .then(() => {
          this.snacktext = "Success";
          this.snackbar = true;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        });
    }
  },
  watch: {
    $route: "getDiff"
  }
};
</script>


<style>
.CodeMirror-merge,
.CodeMirror-merge .CodeMirror {
  height: 100% !important;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}
</style>