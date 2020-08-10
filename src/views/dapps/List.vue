<template>
  <v-skeleton-loader :loading="loading" type="card">
    <v-row>
      <v-col v-for="(dapp, i) in dapps" :key="i" :cols="i < 2 ? 6 : 4"
      
      >
        <v-hover v-slot:default="{ hover }">
          <template v-if="i > 1">
            <v-card
              :elevation="hover ? 1 : 0"
              :to="{name: 'dapp', params:{address: dapp.contracts[0].address}}"
            >
              <v-img :src="dapp.pictures[0].link" height="200"></v-img>
              <v-divider></v-divider>
              <v-card-title primary-title>
                <div>
                  <p class="headline mb-0">{{ dapp.name }}</p>
                  <p class="overline mt-0">{{ dapp.short_description }}</p>
                  <v-chip v-for="c in dapp.categories" :key="c" class="mx-1" small>{{ c }}</v-chip>
                </div>
              </v-card-title>
            </v-card>
          </template>
          <template v-else>
            <v-card
              :elevation="hover ? 1 : 0"
              :to="{name: 'dapp', params:{address: dapp.contracts[0].address}}"
            >
              <v-img :src="dapp.pictures[0].link" height="300">
                <div class="d-flex lightbox align-end" style="height: 100%; width: 100%">
                  <v-card-title
                    primary-title
                    class="title white--text pa-0"
                    style="width: 100%;"
                  >
                    <div class="d-flex pa-4 justify-space-between align-center" style="height: 50%; width: 100%">
                      <div>
                        <p class="headline mb-0">{{ dapp.name }}</p>
                        <p class="overline mt-0">{{ dapp.short_description }}</p>
                      </div>
                      <div>
                        <v-chip v-for="c in dapp.categories" :key="c" class="mx-1" small>{{ c }}</v-chip>
                      </div>
                    </div>
                  </v-card-title>
                </div>
              </v-img>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-skeleton-loader>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DAppList",
  data: () => ({
    dapps: [],
    loading: false,
  }),
  created() {
    this.getList();
  },
  methods: {
    ...mapActions(["showError"]),
    getList() {
      this.loading = true;

      this.api
        .getDApps()
        .then((res) => {
          this.dapps = res;
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
    $route: "getList",
  },
};
</script>

<style lang="scss" scoped>
.lightbox {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    transparent 150px
  );
}
</style>
