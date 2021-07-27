<template>
  <div class="fill-height canvas">
    <SideNavigation :app="true" />
    <v-container fluid class="pa-4">
      <v-row v-if="loading" no-gutters>
        <v-col cols="6" class="pr-1">
          <v-skeleton-loader v-if="loading" type="card-heading, image"></v-skeleton-loader>
        </v-col>
        <v-col cols="6">
          <v-skeleton-loader v-if="loading" type="card-heading, image"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-if="!loading && res" no-gutters>
        <v-col cols="12">
          <DiffViewer :left="res.left" :right="res.right" :diff="res.diff" />
          <v-snackbar v-model="snackbar">
            {{ snacktext }}
            <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
          </v-snackbar>
        </v-col>
      </v-row>
      <ErrorState v-if="!loading && !res" />
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SideNavigation from "@/components/SideNavigation.vue";
import DiffViewer from "@/views/diff/DiffViewer.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "Diff",
  components: {
    SideNavigation,
    DiffViewer,
    ErrorState,
  },
  data: () => ({
    res: null,
    loading: true,
    snackbar: false,
    snacktext: "",
    task: null,
  }),
  created() {
    this.requestData();
  },
  computed: {
    query() {
      const params = this.$route.query;
      const left = {
        address: params.addressA,
        network: params.networkA,
        protocol: params.protocolA,
        level: parseInt(params.levelA),
      };
      const right = {
        address: params.addressB,
        network: params.networkB,
        protocol: params.protocolB,
        level: parseInt(params.levelB),
      };
      return { left, right };
    },
  },
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      this.getDiff();
      this.task = null;
      this.snackbar = false;
    },
    getDiff() {
      this.loading = true;
      this.api
        .getDiff(this.query)
        .then((res) => {
          this.res = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  watch: {
    $route: "requestData",
  },
};
</script>