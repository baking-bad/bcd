<template>
  <div>
    <v-snackbar color="primary" v-model="updateOk" :timeout="2000" top>
      Watch settings updated!
      <v-btn text @click="updateOk = false">OK</v-btn>
    </v-snackbar>
    <v-dialog max-width="525" :value="show" @click:outside="close()">
      <v-card color="canvas">
        <v-card-title class="px-6 d-flex flex-row justify-space-between settings-card-title">
          <div class="my-1 d-flex flex-column justify-center">
            <span class="info-item-title">{{ address }}</span>
            <span 
              class="overline" 
              :class="network === 'mainnet' ? 'primary--text' : ''">{{ network }}</span>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-10 pb-0 pt-10">
          <v-text-field
              label="Alias (optional)"
              :value="alias"
              outlined
              clearable
          ></v-text-field>
          <div class="d-flex flex-row justify-space-between">
            <div v-for="(group, i) in groups" :key="i">
              <div class="my-4">
                <span class="subtitle-2">{{ group.name }}</span>
              </div>
              <template v-for="item in group.items">
                <v-switch flat dense class="ma-0"
                  v-if="!item.prefix || address.startsWith(item.prefix)" v-model="flags" 
                  :label="item.label" :value="item.value" :key="item.value">
                </v-switch>
              </template>
            </div>  
          </div>
        </v-card-text>
        <v-card-actions class="d-flex flex-row align-center justify-end pa-6">
          <v-btn small text class="px-4 mr-auto red--text">
            <v-icon small class="mr-1" @click="unsubscribe">mdi-eye-off-outline</v-icon>
            <span>Unwatch</span>
          </v-btn>
          <v-btn small text class="px-4" @click="close()">
            <span>Cancel</span>
          </v-btn>
          <v-btn small outlined class="px-4" color="primary" @click="subscribe">
            <v-icon small class="mr-1">mdi-eye-outline</v-icon>
            <span>Watch</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "WatchSettings",
  props: {
    show: Boolean,
    id: String,
    settings: Array,
    address: String,
    network: String,
    alias: String
  },
  data: () => ({
    updateOk: false,
    flags: [],
    groups: [{
      name: "Tracked events",
      items: [{
        value: "watch_errors",
        label: "Failed operations",
        default: true
      }, {
        value: "watch_deployments",
        label: "New deployments",
        prefix: "tz",
        default: true
      }, {
        value: "watch_migrations",
        label: "Code modifications",
        default: true
      }, {
        value: "watch_calls",
        label: "Contract calls",
      }]
    }, {
      name: "Also watch",
      items: [{
        value: "watch_same",
        label: "Same contracts",
        prefix: "KT",
        default: true
      }, {
        value: "watch_similar",
        label: "Similar contracts",
        prefix: "KT"
      }, {
        value: "watch_deployed",
        label: "Deployed contracts",
        prefix: "tz",
        default: true
      }]
    }]
  }),
  created() {
    if (!this.settings) {
      const address = this.address;
      this.flags = this.groups.map(g => g.items
        .filter(i => i.default && (!i.prefix || address.startsWith(i.prefix)))
        .map(i => i.value)
      ).flat();
    } else {
      this.flags = this.settings;
    }
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    subscribe() {
      this.api.addProfileSubscription(this.id, "contract")
        .then(() => {
          this.updateOk = true;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => {
          this.close()
        });
    },
    unsubscribe() {
      this.api.removeProfileSubscription(this.id, "contract")
        .then(() => {
          this.updateOk = true;
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => {
          this.close()
        });
    },
  }
};
</script>

<style scoped>
.info-item-title {
  font-family: "Roboto Mono", monospace;
  font-size: 1.1rem;
  line-height: 1.2rem;
}
.settings-card-title {
  background-color: var(--v-sidebar-base);
}
</style>