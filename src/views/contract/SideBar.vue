<template>
  <div class="fill-height canvas top-margin-from-main-header" :key="address">
    <v-divider></v-divider>
    <div class="d-flex align-center px-4 sidebar" style="height: 48px">
      <span class="caption font-weight-bold text-uppercase text--secondary"
        >Actions</span
      >
    </div>

    <v-divider></v-divider>

    <v-skeleton-loader
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line, list-item-two-line"
    >

    </v-skeleton-loader>

    <BakingBadFooter />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SimilarItem from "@/views/contract/SimilarItem.vue";
import AccountBox from "@/components/Dialogs/AccountBox.vue";
import BakingBadFooter from "@/components/BakingBadFooter.vue";
import { DATA_LOADING_STATUSES } from "@/utils/network";
import ShareLink from "../../components/Buttons/ShareLink";
import Tags from "../../components/Tags";

export default {
  name: "SideBar",
  props: {
    loading: Boolean,
    contract: Object,
    metadata: Object,
    address: String,
    network: String,
    migrations: Array,
    balance: Number,
  },
  components: {
    Tags,
    ShareLink,
    SimilarItem,
    AccountBox,
    BakingBadFooter,
  },
  data: () => ({

  }),
  created() {
  },
  computed: {

    isContract() {
      return this.address.startsWith("KT");
    },
    alias() {
      if (this.contract) {
        if (this.contract.alias) {
          return this.contract.alias;
        } else if (this.metadata && this.metadata.name) {
          return this.metadata.name;
        }
      }
      return null;
    },
    link() {
      let routeData = {};
      if (this.contract && this.contract.slug) {
        routeData = {href:`/@${this.contract.slug}`};
      } else {
        routeData = this.$router.resolve({
          name: "contract",
          params: {
            address: this.address,
            network: this.network,
          },
        });
      }
      return `${window.location.protocol}//${window.location.host}${routeData.href}`;
    },
  },
  methods: {
    ...mapActions(["showError", "showClipboardOK"]),
  },
  watch: {
    contract(newVal) {
      this.same_count = newVal.same_count;
      this.sameInitialLoadingStatus = DATA_LOADING_STATUSES.NOTHING;
      this.same = [];
    }
  }
};
</script>

<style scss>
.opened-panel {
  border-bottom: none !important;
}
.opened-panel > .v-expansion-panel-content > .v-expansion-panel-content__wrap {
  padding: 0;
}
.opened-panel > .v-expansion-panel-header {
  min-height: 48px;
}
.contract-list {
  max-height: calc(100vh - 75px - 5 * 48px);
  overflow-y: auto;
  border-radius: 0;
  padding: 0;
  z-index: 1;
}
</style>
