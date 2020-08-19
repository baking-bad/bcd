<template>
  <v-row class="pa-0">
    <v-col cols="12" class="pa-0 ma-0">
      <v-skeleton-loader :loading="loading || reviewsLoading || qaLoading" type="image">
        <v-tabs grow icons-and-text background-color="transparent">
          <v-tab>
            Reviews
            <v-icon>mdi-forum</v-icon>
          </v-tab>
          <v-tab>
            Q&A
            <v-icon>mdi-comment-question-outline</v-icon>
          </v-tab>

          <v-tab-item style="background-color: transparent;" class="px-8 py-8">
            <v-row no-gutters>
              <v-col v-if="rating">
                <div class="d-flex flex-horizontal align-end pl-4">
                  <span class="rating">{{ rating.value.toFixed(1) }}</span>
                  <v-rating
                    v-model="rating.value"
                    color="primary"
                    background-color="lightgrey"
                    class="pl-2"
                    half-increments
                    readonly
                  ></v-rating>
                  <span class="rating-caption">{{ rating.count }} reviews</span>
                </div>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2" align="end">
                <v-btn
                  outlined
                  color="primary"
                  target="_blank"
                  :href="`https://forum.tezosagora.org/t/${this.dapp.agora_review_post_id}`"
                >
                  <v-icon left small>mdi-star-outline</v-icon>Review
                </v-btn>
              </v-col>
              <v-col cols="12">
                <template v-for="(post) in reviews">
                  <Post
                    :post="post"
                    :key="post.id"
                    v-if="post.post_type === 1"
                    :agoraApi="agoraApi"
                  />
                </template>
              </v-col>
            </v-row>
          </v-tab-item>

          <v-tab-item style="background-color: transparent;" class="px-8 py-8">
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <v-col cols="2" align="end">
                <v-btn
                  outlined
                  color="primary"
                  target="_blank"
                  :href="`https://forum.tezosagora.org/t/${this.dapp.agora_qa_post_id}`"
                >
                  <v-icon left small>mdi-comment-question-outline</v-icon>Ask question
                </v-btn>
              </v-col>
              <v-col cols="12">
                <template v-for="(post) in qa">
                  <Post
                    :post="post"
                    :key="post.id"
                    v-if="post.post_type === 1"
                    :agoraApi="agoraApi"
                  />
                </template>
              </v-col>
            </v-row>
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
    rating: null
  }),
  methods: {
    ...mapActions(["showError"]),
    getReviews() {
      if (!this.dapp || !this.dapp.agora_review_post_id) return;

      this.reviewsLoading = true;
      this.agoraApi
        .getPostsWithRating(this.dapp.agora_review_post_id)
        .then((res) => {
          this.reviews = res.post_stream.posts;
          this.rating = res.ratings[0];
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

<style lang="scss" scoped>
.rating {
  font-size: 48px;
  line-height: 54px;
  font-weight: bold;
}

.rating-caption {
  font-size: 16px;
  color: gray;
  line-height: 32px;
  font-weight: 300;
}
</style>