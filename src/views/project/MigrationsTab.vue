<template>
  <v-container fluid>
    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >
      <div class="elevation-2 ma-3">
        <template v-for="(item, idx) in migrations">
          <template v-if="item.vesting">
            <v-hover :key="idx" v-slot:default="{ hover }">
              <v-row
                :class="{ 'on-hover': hover, 'migration-row vesting': true }"
                no-gutters
                align="center"
                @click="to({name: 'code', params: {address: $route.params.address, network: $route.params.network}, query: {level: 1}})"
              >
                <v-col cols="2">
                  <div class="subtitle-2">{{ item.timestamp | formatDate }}</div>
                  <div class="overline grey--text text--darken-3">genesis block</div>
                </v-col>
                <v-col cols="10">
                  <div class="subtitle-2">Vesting</div>
                </v-col>
              </v-row>
            </v-hover>
          </template>
          <template v-else-if="item.hash">
            <v-hover :key="idx" v-slot:default="{ hover }">
              <v-row
                :class="{ 'on-hover': hover, 'migration-row lambda': true }"
                no-gutters
                align="center"
                @click="to({name: 'opg', params: {hash: item.hash}})"
              >
                <v-col cols="2">
                  <div class="subtitle-2">{{ item.timestamp | formatDate }}</div>
                  <div class="overline grey--text text--darken-3">{{ item.level }}</div>
                </v-col>
                <v-col cols="10">
                  <div class="subtitle-2">Lambda in storage was altered</div>
                  <div class="subtitle hash grey--text text--darken-3">{{ item.hash }}</div>
                </v-col>
              </v-row>
            </v-hover>
          </template>
          <template v-else>
            <v-hover :key="idx" v-slot:default="{ hover }">
              <v-row
                :class="{ 'on-hover': hover, 'migration-row protocol': true }"
                no-gutters
                align="center"
                @click="to({name: 'migration', params: {address: $route.params.address, network: $route.params.network, protocol: item.protocol}})"
              >
                <v-col cols="2">
                  <div class="subtitle-2">{{ item.timestamp | formatDate }}</div>
                  <div class="overline grey--text text--darken-3">{{ item.level }}</div>
                </v-col>
                <v-col cols="10">
                  <div class="subtitle-2">Contract was altered during a protocol update</div>
                  <div class="subtitle hash grey--text text--darken-3">{{ item.protocol }}</div>
                </v-col>
              </v-row>
            </v-hover>
          </template>
          <v-divider v-if="idx < migrations.length - 1" :key="idx + migrations.length" />
        </template>
      </div>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { getContractMigrations } from "@/api/index.js";

export default {
  name: "MigrationsTab",
  props: {
    contract: Object
  },
  computed: {
    migrations() {
      if (this.loading) return [];
      return this.contract.migrations;
    }
  },
  created() {
    this.getMigrations();
  },
  data: () => ({
    loading: true
  }),
  methods: {
    ...mapActions(["showError"]),
    getMigrations() {
      this.loading = true;
      if (!this.contract) {
        return;
      }
      if (this.contract.migrations) {
        this.loading = false;
        return;
      }
      getContractMigrations(this.contract.network, this.contract.address)
        .then(res => {
          if (!res) return;
          this.contract.migrations = res;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    to(route) {
      let routeData = this.$router.resolve(route);
      window.open(routeData.href, "_blank");
    }
  },
  watch: {
    contract: "getMigrations"
  }
};
</script>

<style lang="scss" scoped>
.on-hover {
  background-color: rgb(250, 250, 250);
  cursor: pointer;
}
.migration-row {
  padding: 7px 20px;
  min-height: 58px;
}

.lambda {
  border-left: 5px solid purple;
}

.vesting {
  border-left: 5px solid teal;
}

.protocol {
  border-left: 5px solid orange;
}

.subtitle {
  font-size: 12px;
}
</style>