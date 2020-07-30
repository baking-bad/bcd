<template>
  <v-container fluid class="pa-8 canvas fill-canvas">
    <v-skeleton-loader :loading="loading" type="table">
      <v-data-table :items="viewedTokens" :headers="headers" hide-default-footer>
        <template v-slot:item="{item}">
          <tr @click="navigate(item)" class="custom-link">
            <td>
              <div class="d-flex flex-column justify-start">
                <span class="hash">{{ item.alias || item.address}}</span>
                <span class="caption grey--text">last action {{ item.last_action | fromNow }}</span>
              </div>
            </td>
            <template v-for="(method, key) in item.methods">
              <td :key="key">
                <div class="d-flex flex-column justify-start">
                  <v-chip small class="my-1" color="transparent">
                    <v-avatar left>
                      <v-icon small color="blue lighten-2">mdi-fire</v-icon>
                    </v-avatar>
                    {{ method.average_consumed_gas }}
                  </v-chip>
                  <v-chip small class="my-1" color="transparent">
                    <v-avatar left>
                      <v-icon small color="grey darken-3">mdi-function</v-icon>
                    </v-avatar>
                    {{ method.call_count }}
                  </v-chip>
                </div>
              </td>
            </template>
          </tr>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-chip small class="my-2 mr-3" color="transparent">
              <v-avatar left>
                <v-icon small color="blue lighten-2">mdi-fire</v-icon>
              </v-avatar>Average consumed gas
            </v-chip>
            <v-chip small class="my-2 ml-3" color="transparent">
              <v-avatar left>
                <v-icon small color="grey darken-3">mdi-function</v-icon>
              </v-avatar>Method calls count
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="selectedVersion" color="primary" dense mandatory>
              <v-btn value="fa12">FA1.2</v-btn>
              <v-btn value="fa2">FA2</v-btn>
            </v-btn-toggle>
          </v-toolbar>
        </template>
        <template v-slot:footer>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <span
              class="caption grey--text mr-4"
            >{{ page*page_size }} - {{ endSlice }} of {{ total }}</span>
            <v-btn icon @click="left" :disabled="page == 0">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="right" :disabled="endSlice == total">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

const PAGE_SIZE = 10;

export default {
  name: "TokenTab",
  props: {
    network: String,
  },
  computed: {
    page_size() {
      return PAGE_SIZE;
    },
    endSlice() {
      return Math.min(this.tokens.length, (this.page + 1) * PAGE_SIZE);
    },
    viewedTokens() {
      return this.tokens.slice(
        this.page * PAGE_SIZE,
        (this.page + 1) * PAGE_SIZE
      );
    },
  },
  data: () => ({
    loading: true,
    tokens: [],
    lastId: null,
    page: 0,
    total: 0,
    selectedVersion: "fa12",
    headers: [
      {
        text: "Address",
        value: "address",
      },
    ],
  }),
  created() {
    this.getTokensInfo(this.selectedVersion);
  },
  methods: {
    ...mapActions(["showError"]),
    getTokensInfo(version) {
      this.loading = true;

      this.api
        .getTokensByVersion(this.network, version, this.lastId, PAGE_SIZE)
        .then((res) => {
          if (!res) return;
          this.lastId = res.last_id;
          this.total = res.total;

          this.tokens.push(...res.tokens);
          if (this.tokens.length > 0) {
            this.headers = this.headers.splice(0, 1);
            let methods = this.tokens[0].methods;
            Object.keys(methods).forEach((element) => {
              this.headers.push({
                text: element,
                align: "center",
                sortable: false,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => (this.loading = false));
    },
    left() {
      if (this.page > 0) this.page--;
    },
    right() {
      this.page++;
      if (this.tokens.length == this.page * PAGE_SIZE) {
        this.getTokensInfo(this.selectedVersion);
      }
    },
    navigate(item) {
      this.$router.push({
        name: 'contract',
        params: {
          address: item.address,
          network: item.network
        }
      })
    }
  },
  watch: {
    $route: function () {
      this.getTokensInfo(this.selectedVersion);
    },
    selectedVersion: function (newValue) {
      this.tokens = [];
      this.lastId = null;
      this.page = 0;
      this.total = 0;
      this.getTokensInfo(newValue);
    },
  },
};
</script>

<style>
.custom-link:hover {
  cursor: pointer;
}
</style>