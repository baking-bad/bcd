<template>
  <v-container fluid class="pa-0 ma-0 canvas fill-canvas">
    <v-row class="pa-8 ma-0" v-if="loading || total > 0">
      <v-col cols="9">
        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line, list-item-two-line, list-item-two-line"
        >
          <v-expansion-panels mandatory flat>
            <BigMapDiff
              v-if="diff"
              :diff="diff"
              :network="network"
              :address="address"
              :ptr="ptr"
              :single="true"
            />
          </v-expansion-panels>
        </v-skeleton-loader>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" class="pt-3">
        <v-card flat outlined>
          <v-skeleton-loader
            :loading="loading"
            type="list-item-two-line, list-item-two-line, list-item-two-line"
          >
            <v-list class="ma-0 pa-0 data">
              <v-list-item-group
                v-model="selectedItem"
                mandatory
                active-class="selected-date"
                color="transparent"
              >
                <template v-for="(item, i) in diffs">
                  <v-divider :key="`${i}-divider`" v-if="i != 0" />
                  <v-list-item :key="i" class="px-8 py-1">
                    <v-list-item-content>
                      <v-list-item-title
                        class="body-2 text--primary"
                      >{{ helpers.formatDate(item.timestamp) }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text>
                        <v-list-item-subtitle class="body-2">
                          <v-icon v-if="!item.value" small class="mb-1 error--text">mdi-trash-can-outline</v-icon>
                          <v-icon v-else small class="mb-1 text--secondary">mdi-cube-outline</v-icon>
                          {{ item.level }}
                        </v-list-item-subtitle>
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-skeleton-loader>
        </v-card>
        <v-pagination
          circle
          v-if="total > diffsPerPage"
          v-model="page"
          :length="Math.ceil(total / diffsPerPage)"
          class="mt-4"
        ></v-pagination>
      </v-col>
    </v-row>
    <ErrorState v-else />
  </v-container>
</template>

<script>
import BigMapDiff from "@/views/big_map/BigMapDiff.vue";
import ErrorState from "@/components/ErrorState.vue";
import { mapActions } from "vuex";

export default {
  name: "BigMapHistory",
  props: {
    network: String,
    address: String,
    ptr: String,
    keyhash: String,
    count: Number
  },
  components: {
    BigMapDiff,
    ErrorState
  },
  computed: {
    diff() {
      if (this.selectedItem < 0 || this.diffs.length - 1 < this.selectedItem)
        return null;
      const data = {
        key: this.key,
        key_hash: this.keyhash,
        ...this.diffs[this.selectedItem]
      };
      return { data, count: this.total };
    }
  },
  data: () => ({
    loading: true,
    diffs: [],
    key: null,
    total: 0,
    page: 1,
    diffsPerPage: 10,
    breadcrumbs: [],
    selectedItem: -1
  }),
  created() {
    this.requestData();
  },
  methods: {
    ...mapActions(["showError"]),
    requestData() {
      this.loading = true;
      this.api
        .getContractBigMapHistory(
          this.network,
          this.ptr,
          this.keyhash,
          (this.page - 1) * this.diffsPerPage
        )
        .then(res => {
          this.diffs = res.values;
          this.key = res.key;
          this.total = res.total;
        })
        .catch(err => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
          this.$emit("update:count", this.total);
        });
    }
  },
  watch: {
    $route: "requestData",
    active(newVal) {
      if (newVal !== null) this.showTreeNodeDetails = true;
    },
    page(newVal) {
      if (newVal && newVal > 0 && newVal <= this.total) {
        this.requestData();
      }
    }
  }
};
</script>

<style scoped>
.selected-date {
  border-left: 2px solid var(--v-primary-base);
  background: var(--v-sidebar-base) !important;
}
</style>