<template>
  <div v-if="dapp">
    <v-row no-gutters>
      <v-col cols="12">
        <HeaderBlock class="mb-10" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12" v-if="dapp.pictures">
        <ScreenshotsBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12">
        <InformationBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12">
        <StatisticsBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12" v-if="dapp.categories.includes('DEX')">
        <DEXBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
      <v-col cols="12" v-if="dapp.agora_review_post_id || dapp.agora_qa_post_id">
        <AgoraBlock class="island elevation-1" :dapp="dapp" :loading="loading" />
      </v-col>
    </v-row>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      direction="top"
      open-on-hover
      v-if="dapp.social_links && dapp.social_links.length > 0"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" fab color="white">
          <v-icon v-if="fab" color="primary">mdi-close</v-icon>
          <v-icon v-else color="primary">mdi-message-text-outline</v-icon>
        </v-btn>
      </template>
      <template v-for="link in dapp.social_links">
        <v-btn :href="link" target="_blank" fab small :key="link" :color="getSocialColor(link)">
          <v-icon color="white" small>{{ getSocialIcon(link) }}</v-icon>
        </v-btn>
      </template>
    </v-speed-dial>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HeaderBlock from "@/views/dapps/HeaderBlock.vue";
import InformationBlock from "@/views/dapps/InformationBlock.vue";
import ScreenshotsBlock from "@/views/dapps/ScreenshotsBlock.vue";
import StatisticsBlock from "@/views/dapps/StatisticsBlock.vue";
import AgoraBlock from "@/views/dapps/AgoraBlock.vue";
import DEXBlock from '@/views/dapps/DEXBlock.vue';

export default {
  name: "DApp",
  components: {
    HeaderBlock,
    ScreenshotsBlock,
    InformationBlock,
    StatisticsBlock,
    AgoraBlock,
    DEXBlock,
  },
  data: () => ({
    loading: true,
    dapp: null,
    fab: false,
  }),
  created() {
    this.getDApp(this.$route.params.slug);
  },
  methods: {
    ...mapActions(["showError"]),
    getDApp(slug) {
      this.loading = true;

      this.api
        .getDApp(slug)
        .then((res) => {
          this.dapp = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
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
      } else if (link.startsWith("tg://")) {
        return "mdi-telegram";
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
      } else if (link.startsWith("tg://")) {
        return "#0088cc";
      }
      return "grey";
    },
  },
  watch: {
    $route: function () {
      this.getDApp(this.$route.params.slug);
    },
  },
};
</script>

<style lang="scss" scoped>
.island {
  background-color: var(--v-data-base);
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 15px;
}
</style>
