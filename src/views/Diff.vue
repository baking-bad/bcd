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
        <DiffViewer :diffs="diffs"/>
        <v-snackbar v-model="snackbar">
          {{ snacktext }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDiff, vote } from "@/api/index.js";

import DiffViewer from '@/components/DiffViewer.vue'

export default {
  name: "Diff",
  components: {
    DiffViewer
  },
  data: () => ({
    diffs: null,
    result: null,
    loading: true,
    snackbar: false,
    snacktext: ""
  }),
  created() {
    this.getCode();
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
          this.diffs = res;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.loading = false;
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
  },
  watch: {
    "$route": 'getCode'
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