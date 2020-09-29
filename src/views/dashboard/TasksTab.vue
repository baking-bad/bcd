<template>
  <div>
    <v-alert
      dense
      outlined
      dismissible
      type="success"
      v-if="profile && profile.marked_contracts == 0"
    >
      Completing these tasks helps to teach our algorithms to detect similar contracts more precisely. Thank you!
    </v-alert>
    <v-skeleton-loader :loading="loading" type="table">
      <v-data-table
        :headers="headers"
        :items="tasks"
        hide-default-header
        hide-default-footer
        v-if="tasks.length > 0 "
      >
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <tr>
              <th v-for="(h, idx) in headers" :key="idx" class="ml-4">
                <span class="ml-4">{{ h.text }}</span>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item, idx) in items" :key="idx" @click="onTaskClick(item)" class="task-row">
              <td>
                <v-list-item disabled>
                  <v-list-item-content>
                    <v-list-item-subtitle class="hash">{{ item.address_1 }}</v-list-item-subtitle>
                    <v-list-item-title class="overline">{{ item.network_1 }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>
                <v-list-item disabled>
                  <v-list-item-content>
                    <v-list-item-subtitle class="hash">{{ item.address_2 }}</v-list-item-subtitle>
                    <v-list-item-title class="overline">{{ item.network_2 }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <v-card v-else class="elevation-0">
        <v-card-text>
          <div class="d-flex flex-column align-center justify-center">
            <span
              class="mb-4 subtitle-1"
            >Still no tasks. You can get new tasks by pressing the button below.</span>
            <v-btn depressed tile color="primary" @click="getNewTasks">Get tasks</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-skeleton-loader>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TasksTab",
  computed: {
    profile() {
      return this.$store.state.profile;
    },
    headers() {
      return [
        {
          text: "First contract",
        },
        {
          text: "Second contract",
        },
      ];
    },
  },
  created() {
    this.getTasks();
  },
  data: () => ({
    loading: true,
    tasks: [],
  }),
  methods: {
    ...mapActions(["showError"]),
    getTasks() {
      this.loading = true;
      this.api
        .getTasks()
        .then((res) => {
          this.tasks = res;
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onTaskClick(item) {
      let routeData = this.$router.resolve({
        name: "diff",
        query: {
          addressA: item.address_1,
          networkA: item.network_1,
          addressB: item.address_2,
          networkB: item.network_2,
        },
      });
      window.open(routeData.href, "_blank");
    },
    getNewTasks() {
      this.loading = true;
      this.api
        .generateTasks()
        .then((res) => {
          this.tasks = res;
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.task-row:hover {
  cursor: pointer;
}
</style>