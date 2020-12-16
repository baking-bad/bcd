<template>
  <v-skeleton-loader :loading="loading" type="card">
    <v-row>
      <v-col v-for="(dapp, i) in dapps" :key="i" :cols="i < 2 ? 6 : 4">
        <v-hover v-slot:default="{ hover }">
          <template v-if="i > 1">
            <v-card
              :elevation="hover && !dapp.soon ? 1 : 0"
              :to="
                dapp.soon ? null : { name: 'dapp', params: { slug: dapp.slug } }
              "
            >
              <v-img :src="dapp.cover || dapp.logo"></v-img>
              <v-divider></v-divider>
              <v-card-text primary-title>
                <div class="d-flex flex-column">
                  <p class="headline mb-0">{{ dapp.name }}</p>
                  <p class="overline mt-0">{{ dapp.short_description }}</p>
                  <div class="d-flex">
                    <v-chip
                      v-for="c in dapp.categories"
                      :key="c"
                      class="mx-1"
                      small
                      >{{ c }}</v-chip
                    >
                  </div>
                </div>
              </v-card-text>

              <v-img
                v-if="dapp.soon"
                class="coming-soon"
                src="/img/coming_soon.png"
              />

              <v-overlay
                :opacity="0.4"
                v-model="dapp.soon"
                absolute
              ></v-overlay>
            </v-card>
          </template>
          <template v-else>
            <v-card
              :elevation="hover && !dapp.soon ? 1 : 0"
              :to="{ name: 'dapp', params: { slug: dapp.slug } }"
            >
              <v-img :src="dapp.cover || dapp.logo">
                <div
                  class="d-flex lightbox align-end"
                  style="height: 100%; width: 100%"
                >
                  <v-card-text
                    primary-title
                    class="title white--text pa-0"
                    style="width: 100%"
                  >
                    <div
                      class="d-flex px-4 justify-space-between align-center"
                      style="height: 50%; width: 100%"
                    >
                      <div>
                        <p class="headline mb-0">{{ dapp.name }}</p>
                        <p class="overline mt-0">
                          {{ dapp.short_description }}
                        </p>
                      </div>
                      <div>
                        <v-chip
                          v-for="c in dapp.categories"
                          :key="c"
                          class="mx-1"
                          small
                          >{{ c }}</v-chip
                        >
                      </div>
                    </div>
                  </v-card-text>
                </div>
              </v-img>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <AddMyDapp />
  </v-skeleton-loader>
</template>

<script>
import AddMyDapp from "@/views/dapps/AddMyDapp.vue";
import { mapActions } from "vuex";

export default {
  name: "DAppList",
  components: {
    AddMyDapp,
  },
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

.coming-soon {
  position: absolute;
  top: 0;
  left: 0;
  height: 100px;
  width: 100px;
  z-index: 100;
}
</style>
