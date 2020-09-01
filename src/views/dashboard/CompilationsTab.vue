<template>
  <v-data-table
    class="elevation-0"
    no-data-text
    :items="items"
    :headers="headers"
    :options.sync="options"
    item-key="id"
    :loading="loading"
    :server-items-length="total"
    show-expand
    single-expand
    hide-default-header
    :footer-props="{
      disableItemsPerPage: true,
    }"
  >
    <template v-slot:item.status="{ item }">
      <div class="d-flex align-center justify-center">
        <span class="caption mr-2 text--secondary">{{ item.status }}</span>
        <v-icon small :color="getStatusColor(item.status)">{{ getStatusIcon(item.status) }}</v-icon>
      </div>
    </template>
    <template v-slot:item.created_at="{ item }">
      <span>{{ item.created_at | formatShortTime }}</span>
    </template>
    <template v-slot:item.kind="{ item }">
      <span class="text-uppercase text--secondary">{{ item.kind }}</span>
    </template>
    <template v-slot:item.address="{ item }">
      <v-list-item class="px-0">
        <v-list-item-content>
          <v-list-item-title class="hash">{{ item.address }}</v-list-item-title>
          <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="py-2">
        <div class="d-flex" v-if="item.status === 'failed'">
          <v-spacer></v-spacer>
          <v-btn text color="primary" :loading="verify" @click="tryAgain(item)">
            <v-icon small left>mdi-play</v-icon>Try again
          </v-btn>
        </div>
        <v-list v-if="item.results" dense>
          <template v-for="(result, i) in item.results">
            <v-list-item
              :key="i"
              :three-line="result.error !== undefined"
              :two-line="!result.error"
            >
              <v-list-item-avatar>
                <v-icon
                  small
                  :color="getStatusColor(result.status)"
                >{{ getStatusIcon(result.status) }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ result.path }}</v-list-item-title>
                <v-list-item-subtitle v-if="result.language">{{ result.language }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="result.error">{{ result.error }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CompilationsTab",
  data: () => ({
    loading: false,
    verify: false,
    tasks: [],
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  computed: {
    items() {
      return this.tasks.slice(
        (this.options.page - 1) * this.options.itemsPerPage,
        this.options.page * this.options.itemsPerPage
      );
    },
    total() {
      if (this.$store.state.profile) {
        return this.$store.state.profile.compilation_tasks;
      }
      return 0;
    },
    headers() {
      return [
        { text: "", value: "created_at" },
        { text: "Type", value: "kind", sortable: false },
        { text: "Address", value: "address", sortable: false },
        {
          text: "",
          value: "status",
          align: "center",
          width: "80px",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    ...mapActions(["showError", "showSuccess"]),
    getCompilationTasks(limit, offset) {
      if (this.tasks.length === this.total) return;

      this.loading = true;
      this.api
        .getProfileCompilations(limit, offset)
        .then((res) => {
          this.tasks.push(...res);
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.loading = false));
    },
    getStatusIcon(status) {
      if (status === "failed" || status === "error") {
        return "mdi-close";
      } else if (status === "pending") {
        return "mdi-clock-outline";
      }
      return "mdi-check";
    },
    getStatusColor(status) {
      if (status === "failed" || status === "error") {
        return "red";
      } else if (status === "success") {
        return "green";
      }
      return "grey";
    },
    tryAgain(task) {
      this.verify = true;

      this.api
        .verifyContract(task.network, task.address, task.repo, task.ref)
        .then(() => {
          this.showSuccess("Contract verification is in processing");
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.verify = false;
        });
    },
  },
  watch: {
    options: {
      handler: function (newValue) {
        this.getCompilationTasks(
          newValue.itemsPerPage,
          (newValue.page - 1) * newValue.itemsPerPage
        );
      },
      deep: true,
    },
    total: function () {
      this.getCompilationTasks(
        this.options.itemsPerPage,
        (this.options.page - 1) * this.options.itemsPerPage
      );
    },
  },
};
</script>

<style lang="scss">
.v-data-table tbody tr.v-data-table__expanded__content {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
</style>