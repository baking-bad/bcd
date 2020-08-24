<template>
  <v-dialog v-model="value" persistent max-width="800">
    <v-card>
      <v-card-title class="d-flex flex-column align-start">
        <span class="title-1">Contract verification</span>
        <div v-if="address">
          <span class="hash text--secondary">{{address}}</span>&nbsp;<span class="overline" v-if="network">{{ network}}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-stepper v-model="step" vertical class="elevation-0">
          <v-stepper-step :complete="selectedRepo >= 0" step="1">
            {{ selectedRepo === -1 ? 'Select repository' : repos[selectedRepo].project }}
            <small>{{ selectedRepo === -1 ? 'Only public repos are availiable' : 'Select repository' }}</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-list dense v-if="repos && repos.length">
              <v-list-item-group v-model="selectedRepo">
                <template v-for="(repo, i) in repos">
                  <v-list-item :key="i" @click="step=2">
                    <v-list-item-content>
                      <v-list-item-title>{{ repo.project }}</v-list-item-title>
                      <v-list-item-subtitle>{{ repo.url }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="`divider-${i}`" v-if="i < repos.length - 1" />
                </template>
              </v-list-item-group>
            </v-list>
          </v-stepper-content>
          <v-stepper-step :complete="selectedTag >= 0" step="2">
            {{ selectedTag === -1 ? 'Select branch/tag' : tags[selectedTag].name }}
            <small>{{ selectedTag === -1 ? 'Contract code in branch must be equal code in chain' : 'Select branch/tag' }}</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-list dense v-if="tags && tags.length">
              <v-list-item-group v-model="selectedTag">
                <template v-for="(tag, i) in tags">
                  <v-list-item :key="i" @click="step=3">
                    <v-list-item-content>
                      <v-list-item-title>{{ tag.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ helpers.shortcut(tag.commit.sha) }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="`divider-${i}`" v-if="i < tag.length - 1" />
                </template>
              </v-list-item-group>
            </v-list>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="verify" :disabled="selectedRepo == -1 || selectedTag == -1">Verify</v-btn>
        <v-btn text @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VerifyDialog",
  props: {
    value: Boolean,
    address: String,
    network: String,
  },
  data: () => ({
    step: 1,
    repos: [
      {
        project: "BCD hub",
        url: "https://github.com/baking-bad/bcdhub",
      },
      {
        project: "BCD",
        url: "https://github.com/baking-bad/bcd",
      },
    ],
    tags: [
      {
        name: "v0.1",
        commit: {
          sha: "c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
          url:
            "https://api.github.com/repos/octocat/Hello-World/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
        },
      },
    ],
    selectedRepo: -1,
    selectedTag: -1,
  }),
  methods: {
    close() {
      this.$emit("input", false);
    },
    verify() {
      this.selectedTag = -1;
      this.selectedRepo = -1;
      this.step = 1;
      this.close();
    },
  },
};
</script>