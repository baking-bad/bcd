<template>
  <v-skeleton-loader :loading="loading" type="card">
    <v-row>
      <v-chip
          v-for="(c, key) in categories"
          :key="key + 'category'"
          class="mx-1 ml-3 mt-2 category-chip"
          :class="{'category-chip_not-picked': !isPicked(key)}"
          @click="setPickedCategory(key)"
      >{{ key }} {{ c }}</v-chip
      >
    </v-row>
    <v-row>
      <v-col v-for="(dapp, i) in shownDapps" :key="i" :cols="i < 2 ? 6 : 4">
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
    categories: {},
    pickedCategories: {},
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
          this.$set(this, 'dapps', res);
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setCategories() {
      this.dapps.forEach(dapp => {
        dapp.categories.forEach(category => {
          let newValue = typeof this.categories[category] === "undefined"
            ? 1
            : ++this.categories[category];
          this.$set(this.pickedCategories, category, false);
          this.$set(this.categories, category, newValue);
        });
      });
    },
    setPickedCategory(category) {
      this.$set(this.pickedCategories, category, !this.pickedCategories[category]);
    },
    isAllPickedCategoriesFalse() {
      return Object.keys(this.pickedCategories).every(category => {
        return this.pickedCategories[category] === false;
      });
    },
    isPicked(category) {
      if (this.isAllPickedCategoriesFalse()) {
        return true;
      }

      return this.pickedCategories[category];
    }
  },
  computed: {
    shownDapps() {
      if (this.isAllPickedCategoriesFalse()) {
        return this.dapps;
      }
      return this.dapps.filter(dapp => {
        return dapp.categories.some(category => {
          return this.pickedCategories[category];
        });
      });
    },
  },
  watch: {
    $route: "getList",
    dapps: "setCategories",
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

.category-chip {
  cursor: pointer;
  &_not-picked {
    background: var(--v-data-darken1) !important;
  }
}
</style>
