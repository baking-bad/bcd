<template>
  <v-container fluid class="canvas fill-canvas px-8">
    <v-row>
      <v-col cols="9">
        <v-breadcrumbs
          class="pl-0 pb-0 pt-0 ml-7"
          divider="/"
          :items="breadcrumbsItems"
        />
      </v-col>
      <v-col cols="3" class="d-flex flex-row-reverse">
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                class="mr-2 pl-2 pr-2 text--secondary"
                outlined
                small
                @click="
                  () => {
                    $clipboard(hash);
                    showClipboardOK();
                  }
                "
              >
                <v-icon class="text--secondary" small>mdi-content-copy</v-icon>
                <span class="ml-1 text--secondary"> Copy hash </span>
              </v-btn>
            </template>
            Copy hash
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                outlined
                small
                class="mr-2 pl-2 pr-2 text--secondary"
                @click="showRaw = true"
              >
                <v-icon class="text--secondary">mdi-code-json</v-icon>
                <span class="ml-1 text--secondary"> Raw JSON </span>
              </v-btn>
            </template>
            Raw JSON
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                class="pl-2 text--secondary"
                outlined
                small
                @click="
                  () => {
                    openInTzkt();
                  }
                "
              >
                <v-icon class="text--secondary" small
                  >mdi-logout-variant</v-icon
                >
                <span class="ml-1 text--secondary"> Open in TZKT </span>
              </v-btn>
            </template>
            Open in TZKT
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="9" class="px-7">
        <OpgContents :loading="loading" :operations="operations"></OpgContents>
      </v-col>
      <v-col cols="3" class="pl-0">
        <v-list v-if="content">
          <v-list-item style="height: 74px">
            <v-list-item-content two-line>
              <v-list-item-title class="headline">
                {{ content.hash }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <span
                  class="overline"
                  :class="network === 'mainnet' ? 'secondary--text' : ''"
                >
                  {{ network }}</span
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="overline">Date</v-list-item-subtitle>
              <v-list-item-title class="body-2">
                {{ helpers.formatDatetime(content.timestamp) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="overline"
                >Level</v-list-item-subtitle
              >
              <v-list-item-title class="body-2">
                <span>{{ content.level }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="overline"
                >Total cost</v-list-item-subtitle
              >
              <v-list-item-title class="body-2">
                <span>{{ totalCost }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list v-if="content" class="mt-5">
          <v-list-item style="height: 44px">
            <v-list-item-content two-line>
              <v-list-item-title class="headline">Call stack</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <div class="d-flex flex-column px-4 call-stack-content-wrapper" style="font-size: 15px">
            <div
              v-for="(op, idx) in operations"
              :key="idx"
              class="d-flex align-center"
              :class="op.internal ? 'mt-2' : 'mt-4'"
            >
              <span v-if="op.internal" class="mr-2" style="font-size: 14px">↳</span>
              <div>
                <span class="text--secondary" v-if="op.destination_alias">{{
                  op.destination_alias
                }}</span>
                <span
                  class="text--secondary"
                  v-else
                  v-html="helpers.shortcut(op.destination)"
                ></span>
                <span class="text--secondary" style="font-size: 20px">→</span>
                <span v-if="op.entrypoint" class="hash">{{ op.entrypoint }}()</span>
                <span v-else>{{ op.amount | uxtz }}</span>
              </div>
            </div>
          </div>
        </v-list>
      </v-col>
    </v-row>

    <RawJsonViewer
      v-if="content"
      :show.sync="showRaw"
      type="operation"
      :network="network"
      :level="content.level"
      :hash="hash"
      :raw="content.rawMempool"
    />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { toTitleCase } from "../../utils/string";
import { openTzktOPG } from "../../utils/tzkt";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";
import OpgContents from "@/views/opg/ContentsTab.vue";

export default {
  name: "OperationGroup",
  props: {
    network: String,
    hash: String,
  },
  components: {
    RawJsonViewer,
    OpgContents,
  },
  data: () => ({
    loading: true,
    showRaw: false,
    operations: [],
  }),
  created() {
    this.getOPG();
  },
  computed: {
    contentsLength() {
      return this.operations.filter((op) => !op.internal).length;
    },
    content() {
      if (this.operations.length > 0) {
        return this.operations[0];
      }
      return undefined;
    },
    totalCost() {
      return this.operations.reduce(
        (acc, c) => acc + (c.fee || 0) + (c.burned || 0),
        0
      );
    },
    breadcrumbsItems() {
      return [
        {
          text: "Home",
          to: "/",
        },
        {
          disabled: true,
          text: toTitleCase(this.network),
        },
        {
          text: this.hash,
          to: `/${this.network}/opg/${this.hash}${
            this.$route.hash !== "#" ? "#" : "##"
          }`,
          disabled: false,
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      showError: "showError",
      showClipboardOK: "showClipboardOK",
    }),
    getOPG() {
      this.api
        .getOPG(this.hash)
        .then((res) => {
          if (!res) return;
          this.operations = res;
        })
        .catch((err) => {
          if (err.code !== 204) {
            console.log(err);
            this.showError(err);
          }
        })
        .finally(() => (this.loading = false));
    },
    openInTzkt() {
      openTzktOPG(this.network, this.hash);
    },
  },
  watch: {
    hash: "getOPG",
  },
};
</script>

<style>
.main-navigation > .v-navigation-drawer__content {
  overflow: hidden;
}

.call-stack-content-wrapper {
  max-height: calc(100vh - 344px);
  overflow-y: auto;
}
</style>
