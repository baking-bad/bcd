<template>
  <div>
    <v-dialog max-width="525" v-model="show" @click:outside="close()">
      <v-card class="data">
        <v-card-title class="px-6 py-3 d-flex align-center sidebar">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Watch:</span>
          <span class="ml-2 body-1" v-html="helpers.shortcut(subscription.address)"></span>
          <span
            class="ml-4 mt-1 overline"
            :class="subscription.network === 'mainnet' ? 'primary--text' : ''"
          >{{ subscription.network }}</span>
        </v-card-title>
        <v-card-text class="px-10 pb-0 pt-10">
          <v-text-field label="Alias (optional)" v-model="subscription.alias" clearable></v-text-field>
          <div class="d-flex flex-row justify-space-between">
            <div v-for="(group, i) in groups" :key="i">
              <div class="my-4">
                <span class="subtitle-2">{{ group.name }}</span>
              </div>
              <template v-for="item in group.items">
                <v-switch
                  flat
                  dense
                  class="ma-0"
                  v-if="!item.prefix || subscription.address.startsWith(item.prefix)"
                  v-model="subscription[item.value]"
                  :label="item.label"
                  :key="item.value"
                ></v-switch>
              </template>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex flex-row align-center justify-end pa-6">
          <v-btn
            v-if="data"
            :loading="removing"
            @click="unsubscribe()"
            small
            text
            class="px-4 mr-auto error--text"
          >
            <v-icon small class="mr-1">mdi-eye-off-outline</v-icon>
            <span>Unwatch</span>
          </v-btn>
          <v-btn small text class="px-4 mr-2 text--secondary" @click="close()">
            <span>Cancel</span>
          </v-btn>
          <v-btn
            :loading="updating"
            small
            outlined
            class="px-6"
            @click="subscribe()"
          >
            <span>Save</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "WatchSettings",
  props: {
    show: Boolean,
    data: Object,
    contract: Object,
    onUpdate: Function,
    onRemove: Function
  },
  data: () => ({
    updating: false,
    removing: false,
    subscription: {
      address: "",
      network: "",
      alias: "",
      watch_errors: null,
      watch_deployments: null,
      watch_migrations: null,
      watch_calls: null,
      watch_same: null,
      watch_similar: null,
      watch_deployed: null
    },
    groups: [
      {
        name: "Tracked events",
        items: [
          {
            value: "watch_errors",
            label: "Failed operations",
            default: true
          },
          {
            value: "watch_deployments",
            label: "New deployments",
            prefix: "tz",
            default: true
          },
          {
            value: "watch_migrations",
            label: "Code modifications",
            default: true
          },
          {
            value: "watch_calls",
            label: "Contract calls",
            default: false
          }
        ]
      },
      {
        name: "Also watch",
        items: [
          {
            value: "watch_same",
            label: "Same contracts",
            prefix: "KT",
            default: true
          },
          {
            value: "watch_similar",
            label: "Similar contracts",
            prefix: "KT",
            default: false
          },
          {
            value: "watch_deployed",
            label: "Deployed contracts",
            prefix: "tz",
            default: true
          }
        ]
      }
    ]
  }),
  methods: {
    ...mapActions(["showError", "showSuccess"]),
    close() {
      this.$emit("update:show", false);
    },
    getDefaultFlags(address) {
      return this.groups
        .map(g =>
          g.items.map(item => {
            const val =
              !item.prefix || address.startsWith(item.prefix)
                ? item.default
                : false;
            return [item.value, val];
          })
        )
        .flat()
        .reduce(function(obj, kv) {
          obj[kv[0]] = kv[1];
          return obj;
        }, {});
    },
    subscribe() {
      if (this.updating || this.removing) return;
      this.updating = true;
      this.api
        .addProfileSubscription(this.subscription)
        .then(() => {
          if (this.onUpdate) {
            this.onUpdate(Object.assign({}, this.subscription));
          }
          this.showSuccess("Watch settings updated");
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => {
          this.updating = false;
          this.close();
        });
    },
    unsubscribe() {
      if (this.updating || this.removing) return;
      this.removing = true;
      this.api
        .removeProfileSubscription(
          this.subscription.network,
          this.subscription.address
        )
        .then(() => {
          if (this.onRemove) {
            this.onRemove(Object.assign({}, this.subscription));
          }
          this.showSuccess("Watch removed");
        })
        .catch(err => {
          this.showError(err);
          console.log(err);
        })
        .finally(() => {
          this.removing = false;
          this.close();
        });
    }
  },
  watch: {
    show(newValue) {
      if (!newValue) return;
      if (this.data) {
        Object.assign(this.subscription, this.data);
      } else if (this.contract) {
        Object.assign(
          this.subscription,
          {
            address: this.contract.address,
            network: this.contract.network,
            alias: this.contract.alias
          },
          this.getDefaultFlags(this.contract.address)
        );
      } else {
        this.showError("Failed to init subscription");
      }
    }
  }
};
</script>