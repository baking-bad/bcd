<template>
  <v-row class="pa-0">
    <v-col cols="12" class="pa-0 ma-0">
      <v-skeleton-loader :loading="loading || reviewsLoading || qaLoading" type="image">
        <v-tabs grow icons-and-text background-color="transparent">
          <v-tab>Reviews<v-icon>mdi-forum</v-icon></v-tab>
          <v-tab>Q&A<v-icon>mdi-comment-question-outline</v-icon></v-tab>

          <v-tab-item style="background-color: transparent;" class="px-8 pb-8">
            <template v-for="(post) in reviews">
              <Post :post="post" :key="post.id" v-if="post.post_type === 1" :agoraApi="agoraApi"/>
            </template>
          </v-tab-item>

          <v-tab-item style="background-color: transparent;" class="px-8 pb-8">
            <template v-for="(post) in qa">
              <Post :post="post" :key="post.id" v-if="post.post_type === 1" :agoraApi="agoraApi"/>
            </template>
          </v-tab-item>
        </v-tabs>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import { AgoraApi } from "@/api/agora.js";

import Post from "@/views/dapps/Post.vue";

export default {
  name: "AgoraBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
  components: {
    Post,
  },
  created() {
    this.agoraApi = new AgoraApi();

    this.getReviews();
    this.getQA();
  },
  data: () => ({
    reviewsLoading: true,
    reviews: [],
    qaLoading: false,
    qa: [],
    agoraApi: null,
  }),
  methods: {
    ...mapActions(["showError"]),
    getReviews() {
      if (!this.dapp || !this.dapp.agora_review_post_id) return;

      this.reviewsLoading = true;
      this.agoraApi
        .getPosts(this.dapp.agora_review_post_id)
        .then((res) => {
          this.reviews = res.post_stream.posts;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.reviewsLoading = false;
        });
    },
    getQA() {
      if (!this.dapp || !this.dapp.agora_qa_post_id) return;

      this.qaLoading = true;
      this.agoraApi
        .getPosts(this.dapp.agora_qa_post_id)
        .then((res) => {
          this.qa = res.post_stream.posts;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.qaLoading = false;
        });
    },
  },
};
</script>
