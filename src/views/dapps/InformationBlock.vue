<template>
  <v-row>
    <v-col cols="6">
      <h3 class="mb-1">Information</h3>
      <v-skeleton-loader :loading="loading" type="list-item-two-line@4">
        <div>
          <v-list disabled style="background-color: transparent">
            <v-list-item selectable v-if="dapp.authors && dapp.authors.length" class="mx-0 px-0">
              <v-list-item-content>
                <v-list-item-subtitle class="overline">Authors</v-list-item-subtitle>
                <v-list-item-title class="info-item-title">{{ dapp.authors.join(', ') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-list-item selectable class="mx-0 px-0">
              <v-list-item-content>
                <v-list-item-subtitle class="overline">License</v-list-item-subtitle>
                <v-list-item-title class="info-item-title">{{ dapp.license }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
            <v-list-item
              selectable
              v-if="dapp.categories && dapp.categories.length"
              class="mx-0 px-0"
            >
              <v-list-item-content>
                <v-list-item-subtitle class="overline">Categories</v-list-item-subtitle>
                <v-list-item-title class="info-item-title">{{ dapp.categories.join(', ') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              selectable
              v-if="dapp.interfaces && dapp.interfaces.length"
              class="mx-0 px-0"
            >
              <v-list-item-content>
                <v-list-item-subtitle class="overline">Interfaces</v-list-item-subtitle>
                <v-list-item-title class="info-item-title">{{ dapp.interfaces.join(', ') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="d-flex">
            <template v-for="link in dapp.social_links">
              <v-btn :href="link" target="_blank" icon large :key="link" :color="getSocialColor(link)">
                <v-icon :color="getSocialColor(link)">{{ getSocialIcon(link) }}</v-icon>
              </v-btn>
            </template>
          </div>
        </div>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6">
      <h3 class="mb-1">Contracts</h3>

      <v-skeleton-loader :loading="loading" type="list-item-two-line@4">
        <v-list style="background-color: transparent">
          <v-list-item
            three-line
            class="mx-0 px-0"
            v-for="contract in dapp.contracts"
            :key="contract.address"
            target="_blank"
            :to="{name: 'contract', params: {address: contract.address, network: contract.network}}"
          >
            <v-list-item-content>
              <v-list-item-title>{{ contract.alias ? contract.alias : contract.address }}</v-list-item-title>
              <v-list-item-subtitle
                class="info-item-title"
                v-if="contract.alias"
              >{{ contract.address }}</v-list-item-subtitle>
              <v-list-item-subtitle>Deployed at {{ contract.release_date | formatDate }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
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
      } else if (link.includes("github")) {
        return "mdi-github";
      }
      return "mdi-web";
    },
    getSocialColor(link) {
      if (link.includes("twitter")) {
        return "#1da1f2";
      } else if (link.includes("youtube")) {
        return "#ff0000";
      } else if (link.includes("github")) {
        return "#24292e";
      } else if (link.includes("reddit")) {
        return "#ff4500";
      } else if (link.includes("linkedin")) {
        return "#007bb5";
      } else if (link.includes("facebook")) {
        return "#1877f2";
      } else if (link.startsWith("tg://") || link.includes("t.me")) {
        return "#0088cc";
      } else if (link.includes("gitlab")) {
        return "#F26D25";
      } else if (link.includes("github")) {
        return "#24292F";
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
</style>