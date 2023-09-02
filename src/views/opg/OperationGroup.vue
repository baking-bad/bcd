<template>
  <v-container fluid class="canvas fill-canvas">
    <v-row>
      <v-col cols="9" class="pl-0">
        <v-breadcrumbs
          class="pl-0 pb-0 pt-0 ml-10"
          divider="/"
          :items="breadcrumbsItems"
        />
      </v-col>
      <v-col cols="3" class="d-flex flex-row-reverse pr-8">
        <div>
            <v-btn
              class="mr-2 pl-2 pr-2 text--secondary"
              text
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
            <v-btn
              text
              small
              class="mr-2 pl-2 pr-2 text--secondary"
              @click="showRaw = true"
            >
              <v-icon class="text--secondary">mdi-code-json</v-icon>
              <span class="ml-1 text--secondary"> Raw JSON </span>
            </v-btn>
            <v-btn
              class="pl-2 text--secondary"
              text
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
        </div>
      </v-col>
    </v-row>
    <v-row class="px-7">
      <v-col cols="9" class="pr-7">
        <OpgContents :loading="loading" :operations="contents"></OpgContents>
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

        <CallStack v-if="content" :network="network" :operations="contents"/>
      </v-col>
    </v-row>

    <RawJsonViewer
      v-if="content"
      v-model="showRaw"
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
import CallStack from "@/views/opg/CallStack.vue";

export default {
  name: "OperationGroup",
  props: {
    network: String,
    hash: String,
  },
  components: {
    RawJsonViewer,
    OpgContents,
    CallStack
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
    content() {
      if (this.contents.length > 0) {
        return this.contents[0];
      }
      return undefined;
    },
    contents() {
      let contents = [];
      if (this.operations) {
        this.operations.forEach((op) => {
          if (op.internal) {
            contents[contents.length - 1].internal_operations.push(op);
          } else {
            op.internal_operations = [];
            contents.push(op);
          }
        });
      }
      return contents.sort((a, b) => a.counter - b.counter);
    },
    totalCost() {
      return this.contents.reduce(function(acc, op) {
        let sum = acc + (op.fee || 0) + (op.burned || 0);

        if (op.internal_operations) {
          sum += op.internal_operations.reduce(function(intAcc, intOp) {
            return intAcc + (intOp.fee || 0) + (intOp.burned || 0);
          }, 0);
        }

        return sum;
      }, 0);
    },
    breadcrumbsItems() {
      return [
        {
          text: "Home",
          to: "/",
        },
        {
          to: {
            name: "recently_called",
            params: {
              network: this.network
            }
          },
          text: toTitleCase(this.network),
        },
        {
          text: this.hash,
          to: `/${this.network}/opg/${this.hash}`,
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
        .getOPG(this.hash, true, false, this.network)
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
