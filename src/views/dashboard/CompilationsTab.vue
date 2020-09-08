<template>
  <div>
    <v-data-table
      class="elevation-0"
      no-data-text="You haven't done anything yet. Verify contract or deploy new contract."
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
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Actions</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="showCompileDialog = !showCompileDialog">
            <v-icon left>mdi-progress-wrench</v-icon>Build
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <div class="d-flex align-center justify-end" style="min-height: 65px;">
          <v-icon :color="getStatusColor(item.status)">{{ getStatusIcon(item.status) }}</v-icon>
        </div>
      </template>
      <template v-slot:item.created_at="{ item }">
        <span>{{ item.created_at | formatShortTime }}</span>
      </template>
      <template v-slot:item.kind="{ item }">
        <span class="text-uppercase text--secondary">{{ item.kind }}</span>
      </template>
      <template v-slot:item.address="{ item }">
        <v-list-item
          class="px-0"
          v-if="item.address"
          :to="{name: 'contract', params: {address: item.address, network: item.network}}"
          target="_blank"
        >
          <v-list-item-content>
            <v-list-item-title class="hash">{{ item.address }}</v-list-item-title>
            <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-2">
          <div class="d-flex" v-if="item.status === 'failed' && item.kind === 'verification'">
            <v-spacer></v-spacer>
            <v-btn text color="primary" :loading="verify" @click="tryAgain(item)">
              <v-icon small left>mdi-play</v-icon>Try again
            </v-btn>
          </div>
          <v-list v-if="item.status !== 'pending'" dense>
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
                <v-list-item-action v-if="item.kind === 'deployment' && item.status === 'success'">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="onDeploy(result, item.id)">
                        <v-icon color="primary">mdi-play</v-icon>
                      </v-btn>
                    </template>
                    <span>Deploy</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
          <div class="d-flex align-center justify-center" v-else>
            <v-progress-linear indeterminate striped color="secondary" />
          </div>
        </td>
      </template>
    </v-data-table>

    <v-data-table
      class="elevation-0 mt-8"
      no-data-text="You haven't deployed anything yet"
      :items="itemsDeployments"
      :options.sync="optionsDeployments"
      :headers="headersDeployments"
      :loading="loadingDeployments"
      :server-items-length="totalDeployments"
      hide-default-header
      :footer-props="{
      disableItemsPerPage: true,
    }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Deployed contracts
            <span class="text--secondary">({{ totalDeployments }})</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.created_at="{ item }">
        <span class="ml-2">{{ item.created_at | formatShortTime }}</span>
      </template>
      <template v-slot:item.operation_hash="{ item }">
        <v-btn
          :disabled="item.network === ''"
          class="text--secondary hash"
          :to="`/${item.network}/opg/${item.operation_hash}`"
          style="text-transform: none;"
          text
        >
          <span v-html="helpers.shortcut(item.operation_hash)" class="hash" />
        </v-btn>
      </template>
      <template v-slot:item.address="{ item }">
        <v-list-item
          class="px-0"
          v-if="item.address"
          :to="{name: 'contract', params: {address: item.address, network: item.network}}"
          target="_blank"
        >
          <v-list-item-content>
            <v-list-item-title class="hash">{{ item.address }}</v-list-item-title>
            <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <span v-else class="subtitle-2 text--secondary">processing...</span>
      </template>
      <template v-slot:item.sources="{ item }">
        <span class="overline">{{ helpers.plural(item.sources.length, 'source file') }}</span>
      </template>
    </v-data-table>

    <v-data-table
      class="elevation-0 mt-8"
      no-data-text="You haven't verified anything yet"
      :items="itemsVerifications"
      :options.sync="optionsVerifications"
      :headers="headersVerifications"
      :loading="loadingVerifications"
      :server-items-length="totalVerifications"
      hide-default-header
      :footer-props="{
      disableItemsPerPage: true,
    }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Verified contracts <span class="text--secondary">({{ totalVerifications }})</span></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.created_at="{ item }">
        <span class="ml-2">{{ item.created_at | formatShortTime }}</span>
      </template>
      <template v-slot:item.address="{ item }">
        <v-list-item
          class="px-0"
          v-if="item.address"
          :to="{name: 'contract', params: {address: item.address, network: item.network}}"
          target="_blank"
        >
          <v-list-item-content>
            <v-list-item-title class="hash">{{ item.address }}</v-list-item-title>
            <v-list-item-subtitle class="overline">{{ item.network }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>verified</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <span v-else class="subtitle-2 text--secondary">processing...</span>
      </template>
    </v-data-table>

    <CompileDialog v-model="showCompileDialog" />
    <DeployDialog v-model="showDeployDialog" :task="deployedTask" v-if="deployedTask" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

import CompileDialog from "@/views/dashboard/CompileDialog.vue";
import DeployDialog from "@/views/dashboard/DeployDialog.vue";

export default {
  name: "CompilationsTab",
  components: {
    CompileDialog,
    DeployDialog,
  },
  data: () => ({
    loading: false,
    loadingDeployments: false,
    loadingVerifications: false,
    verify: false,
    tasks: [],
    deployments: [],
    verifications: [],
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    optionsDeployments: {
      page: 1,
      itemsPerPage: 10,
    },
    optionsVerifications: {
      page: 1,
      itemsPerPage: 10,
    },
    showCompileDialog: false,
    showDeployDialog: false,
    deployedTask: null,
  }),
  computed: {
    items() {
      return this.tasks.slice(
        (this.options.page - 1) * this.options.itemsPerPage,
        this.options.page * this.options.itemsPerPage
      );
    },
    itemsDeployments() {
      return this.deployments.slice(
        (this.optionsDeployments.page - 1) *
          this.optionsDeployments.itemsPerPage,
        this.optionsDeployments.page * this.optionsDeployments.itemsPerPage
      );
    },
    itemsVerifications() {
      return this.verifications.slice(
        (this.optionsVerifications.page - 1) *
          this.optionsVerifications.itemsPerPage,
        this.optionsVerifications.page * this.optionsVerifications.itemsPerPage
      );
    },
    total() {
      if (this.$store.state.profile) {
        return this.$store.state.profile.compilation_tasks;
      }
      return 0;
    },
    totalDeployments() {
      if (this.$store.state.profile) {
        return this.$store.state.profile.deployments;
      }
      return 0;
    },
    totalVerifications() {
      if (this.$store.state.profile) {
        return this.$store.state.profile.verifications;
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
          align: "end",
          width: "80px",
          sortable: false,
        },
      ];
    },
    headersDeployments() {
      return [
        {
          text: "Created At",
          value: "created_at",
          width: "150px",
          sortable: false,
        },
        { text: "Address", value: "address", sortable: false },
        {
          text: "Hash",
          value: "operation_hash",
          sortable: false,
          align: "end",
          width: "150px",
        },
        {
          text: "",
          value: "sources",
          width: "150px",
          align: "center",
          sortable: false,
        },
      ];
    },
    headersVerifications() {
      return [
        {
          text: "Created At",
          value: "created_at",
          width: "150px",
          sortable: false,
        },
        { text: "Address", value: "address", sortable: false },
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
    getDeployments(limit, offset) {
      if (this.deployments.length === this.totalDeployments) return;

      this.loadingDeployments = true;
      this.api
        .getDeploymentList(limit, offset)
        .then((res) => {
          this.deployments.push(...res);
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.loadingDeployments = false));
    },
    getVerifications(limit, offset) {
      if (this.verifications.length === this.totalVerifications) return;

      this.loadingVerifications = true;
      this.api
        .getVerificationList(limit, offset)
        .then((res) => {
          this.verifications.push(...res);
        })
        .catch((err) => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => (this.loadingVerifications = false));
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
    onDeploy(task, task_id) {
      if (!task) return;
      task.compilation_task_id = task_id;
      this.deployedTask = task;
      this.showDeployDialog = !this.showDeployDialog;
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
    optionsDeployments: {
      handler: function (newValue) {
        this.getDeployments(
          newValue.itemsPerPage,
          (newValue.page - 1) * newValue.itemsPerPage
        );
      },
      deep: true,
    },
    optionsVerifications: {
      handler: function (newValue) {
        this.getDeployments(
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
    totalDeployments: function () {
      this.getDeployments(
        this.optionsDeployments.itemsPerPage,
        (this.optionsDeployments.page - 1) *
          this.optionsDeployments.itemsPerPage
      );
    },
    totalVerifications: function () {
      this.getVerifications(
        this.optionsVerifications.itemsPerPage,
        (this.optionsVerifications.page - 1) *
          this.optionsVerifications.itemsPerPage
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