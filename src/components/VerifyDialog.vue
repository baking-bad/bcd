<template>
  <v-dialog v-model="value" persistent max-width="800">
    <v-card>
      <v-card-title class="d-flex flex-column align-start">
        <span class="title-1">Contract verification</span>
        <div v-if="address">
          <span class="hash text--secondary">{{address}}</span>&nbsp;
          <span class="overline" v-if="network">{{ network}}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-stepper v-model="step" vertical class="elevation-0">
          <v-stepper-step :complete="selectedRepo >= 0" step="1" editable>
            {{ selectedRepo === -1 ? 'Select repository' : repos[selectedRepo].project }}
            <small>{{ selectedRepo === -1 ? 'Only public repos are availiable' : 'Selected repository' }}</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-skeleton-loader :loading="loadingRepos" type="list-item@3">
              <v-list dense v-if="repos && repos.length" class="py-0">
                <v-list-item-group v-model="selectedRepo">
                  <template v-for="(repo, i) in repos">
                    <v-list-item :key="i" @click="onRepoSelected(repo)">
                      <v-list-item-content>
                        <v-list-item-title>{{ repo.project }}</v-list-item-title>
                        <v-list-item-subtitle>{{ repo.url }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="`divider-${i}`" v-if="i < repos.length - 1" />
                  </template>
                </v-list-item-group>
              </v-list>
              <div v-else>There aren't any repositories</div>
            </v-skeleton-loader>
          </v-stepper-content>
          <v-stepper-step :complete="selectedTag >= 0" step="2" editable>
            {{ selectedTag === -1 ? 'Select branch/tag' : refs[selectedTag].name }}
            <small>{{ selectedTag === -1 ? 'Contract code in branch must be equal code in chain' : 'Selected branch/tag' }}</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-skeleton-loader :loading="loadingRefs" type="list-item@3">
              <v-list dense v-if="refs && refs.length" class="py-0">
                <v-list-item-group v-model="selectedTag">
                  <template v-for="(tag, i) in refs">
                    <v-list-item :key="i" @click="step=3">
                      <v-list-item-content>
                        <v-list-item-title>{{ tag.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ tag.type }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="`divider-${i}`" v-if="i < tag.length - 1" />
                  </template>
                </v-list-item-group>
              </v-list>
              <div v-else>No refs in this repository</div>
            </v-skeleton-loader>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="verify"
          :disabled="selectedRepo == -1 || selectedTag == -1"
          :loading="verification"
        >Verify</v-btn>
        <v-btn text @click="close" :disabled="verification">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "VerifyDialog",
  props: {
    value: Boolean,
    address: String,
    network: String,
  },
  data: () => ({
    step: 1,
    loadingRepos: false,
    loadingRefs: false,
    repos: [],
    refs: [],
    selectedRepo: -1,
    selectedTag: -1,
    verification: false,
  }),
  methods: {
    ...mapActions(["showError", "showSuccess"]),
    close() {
      this.$emit("input", false);
    },
    getRepos() {
      this.loadingRepos = true;
      this.api
        .getProfileRepos()
        .then((res) => {
          this.repos = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingRepos = false;
        });
    },
    getRefs(name) {
      this.loadingRefs = true;
      this.api
        .getProfileRefs(name)
        .then((res) => {
          this.refs = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingRefs = false;
        });
    },
    verify() {
      this.verification = true;
      this.api
        .verifyContract(
          this.network,
          this.address,
          this.repos[this.selectedRepo].project,
          this.refs[this.selectedTag].name
        )
        .then(() => {
          this.showSuccess("Contract verification is in processing");
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.verification = false;
          this.selectedTag = -1;
          this.selectedRepo = -1;
          this.step = 1;
          this.close();
        });
    },
    onRepoSelected(item) {
      this.step = 2;
      this.getRefs(item.project);
    },
  },
  watch: {
    value: function(newValue) {
      if (!newValue) return;
      if (!this.repos || this.repos.length > 0) return;
      this.getRepos();
    }
  },
};
</script>