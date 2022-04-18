<template>
  <v-row>
    <v-col cols="6">
      <h3 class="mb-1">Information</h3>
        <div>
          <v-list disabled style="background-color: transparent">
            <v-list-item
              selectable
              v-if="dapp.authors && dapp.authors.length"
              class="mx-0 px-0"
            >
              <v-list-item-content>
                <v-list-item-subtitle class="overline"
                  >Authors</v-list-item-subtitle
                >
                <v-list-item-title class="info-item-title">{{
                  dapp.authors.join(", ")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              selectable
              v-if="dapp.categories && dapp.categories.length"
              class="mx-0 px-0"
            >
              <v-list-item-content>
                <v-list-item-subtitle class="overline"
                  >Categories</v-list-item-subtitle
                >
                <v-list-item-title class="info-item-title">{{
                  dapp.categories.join(", ")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              selectable
              v-if="dapp.interfaces && dapp.interfaces.length"
              class="mx-0 px-0"
            >
              <v-list-item-content>
                <v-list-item-subtitle class="overline"
                  >Interfaces</v-list-item-subtitle
                >
                <v-list-item-title class="info-item-title">{{
                  dapp.interfaces.join(", ")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <span class="overline text--secondary" v-if="dapp.social_links">Social</span>
          <div class="d-flex" style="margin-left: -3px;" v-if="dapp.social_links">
            <template v-for="link in dapp.social_links">
              <v-btn
                :href="link"
                target="_blank"
                icon
                large
                :key="link"
              >
                <v-icon :color="getSocialColor(link)">{{
                  getSocialIcon(link)
                }}</v-icon>
              </v-btn>
            </template>
          </div>
        </div>
    </v-col>
    <v-col cols="6">
      <h3 class="mb-1">Contracts</h3>

      <v-skeleton-loader :loading="loading" type="list-item-two-line@3">
        <v-data-table
          :items="dapp.contracts"
          :page.sync="contractsPage"
          :items-per-page="3"
          hide-default-header
          hide-default-footer
          class="elevation-0"
        
          @page-count="contractsPageCount = $event"
        >
          <template v-slot:item="{ item }">
            <v-list-item
            two-line
            :key="item.address"
            target="_blank"
            class="contract-item"
            :to="{
              name: 'contract',
              params: { address: item.address, network: item.network },
            }"
          >
            <v-list-item-content>
              <v-list-item-title>{{
                item.alias ? item.alias : item.address
              }}</v-list-item-title>
              <v-list-item-subtitle
                >Deployed on
                {{ item.release_date | formatDate }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="contractsPage"
            :length="contractsPageCount"
            v-if="dapp.contracts && dapp.contracts.length > 3"
          ></v-pagination>
        </div>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>


<script>
export default {
  name: "InformationBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
  data: () => ({
    contractsPage: 1,
    contractsPageCount: 0
  }),
  methods: {
    getSocialIcon(link) {
      if (link.includes("twitter")) {
        return "mdi-twitter";
      } else if (link.includes("youtube")) {
        return "mdi-youtube";
      } else if (link.includes("github")) {
        return "mdi-github";
      } else if (link.includes("reddit")) {
        return "mdi-reddit";
      } else if (link.includes("linkedin")) {
        return "mdi-linkedin";
      } else if (link.includes("facebook")) {
        return "mdi-facebook";
      } else if (link.startsWith("tg://") || link.includes("t.me")) {
        return "mdi-telegram";
      } else if (link.includes("gitlab")) {
        return "mdi-gitlab";
      } else if (link.includes("instagram")) {
        return "mdi-instagram";
      }
      return "mdi-web";
    },
    getSocialColor(link) {
      if (link.includes("twitter")) {
        return "twitter";
      } else if (link.includes("youtube")) {
        return "youtube";
      } else if (link.includes("github")) {
        return "github";
      } else if (link.includes("reddit")) {
        return "reddit";
      } else if (link.includes("linkedin")) {
        return "linkedin";
      } else if (link.includes("facebook")) {
        return "facebook";
      } else if (link.startsWith("tg://") || link.includes("t.me")) {
        return "telegram";
      } else if (link.includes("gitlab")) {
        return "gitlab";
      } else if (link.includes("instagram")) {
        return "instagram";
      }
      return "grey";
    },
  },
};
</script>


<style lang="scss" scoped>
.info-item-title {
  font-size: 14px;
  font-weight: 300;
}
.contract-item {
  border-left: 3px solid var(--v-primary-base);
}
</style>
