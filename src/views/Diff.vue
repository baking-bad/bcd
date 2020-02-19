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
        <div v-html="result"></div>
        <v-snackbar v-model="snackbar">
          {{ snacktext }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import { getDiff, vote } from "@/api/index.js";

export default {
  name: "Diff",
  data: () => ({
    diffs: null,
    result: null,
    loading: true,
    snackbar: false,
    snacktext: ""
  }),
  mounted() {
    this.getCode();
  },
  updated() {
    this.init();
  },
  methods: {
    getCode() {
      getDiff(
        this.$route.params.network,
        this.$route.params.address,
        this.$route.params.network2,
        this.$route.params.address2
      )
        .then(res => {
          this.diffs = res.full;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.loading = false;
        });
    },
    init() {
      this.result = Diff2Html.html(this.diffs, {
        drawFileList: false,
        matching: "words",
        outputFormat: "side-by-side",
        fileListToggle: false
      });
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
        })
        .catch(err => {
          console.log(err);
          this.snacktext = err;
        })
        .finally(() => (this.snackbar = true));
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
        })
        .catch(err => {
          console.log(err);
          this.snacktext = err;
        })
        .finally(() => (this.snackbar = true));
    }
  }
};
</script>


<style>
.CodeMirror-merge,
.CodeMirror-merge .CodeMirror {
  height: 100% !important;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}

.merge {
  height: 100%;
}
</style>