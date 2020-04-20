<template>
  <v-container fluid class="pa-4">
    <v-skeleton-loader v-if="loading" height="400" type="image"></v-skeleton-loader>
    <v-row v-else-if="res" no-gutters>
      <v-col cols="12">
        <template v-if="isAuthorized">
          <v-btn fab elevation="3" right bottom fixed color="primary lighten-2" style="margin-right: 65px;" @click="upVote">
            <v-icon>mdi-thumb-up-outline</v-icon>
          </v-btn>
          <v-btn fab elevation="3" right bottom fixed color="red lighten-2" @click="downVote">
            <v-icon>mdi-thumb-down-outline</v-icon>
          </v-btn>
        </template>
        <DiffViewer :left="res.left" :right="res.right" :diff="res.diff" />
        <v-snackbar v-model="snackbar">
          {{ snacktext }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { getDiff, vote } from "@/api/index.js";

import DiffViewer from "@/components/DiffViewer.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "Diff",
  components: {
    DiffViewer,
    ErrorState
  },
  data: () => ({
    res: null,
    loading: true,
    snackbar: false,
    snacktext: ""
  }),
  created() {
    this.getDiff();
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    query() {
      const params = this.$route.query;
      const left = {
        address: params.addressA,
        network: params.networkA,
        protocol: params.protocolA,
        level: parseInt(params.levelA)
      }
      const right = {
        address: params.addressB,
        network: params.networkB,
        protocol: params.protocolB,
        level: parseInt(params.levelB)
      }
      return {left, right}
    }
  },
  methods: {
    ...mapActions(["showError"]),
    getDiff() {
      this.loading = true;
      getDiff(this.query)
        .then(res => (this.res = res))
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    upVote() {
      vote(
        this.query.left.network,
        this.query.left.address,
        this.query.right.network,
        this.query.right.address,
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
        this.query.left.network,
        this.query.left.address,
        this.query.right.network,
        this.query.right.address,
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