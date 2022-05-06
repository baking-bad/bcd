<template>
  <v-card class="mt-6 ml-2 pt-2 elevation-0 transparent">
    <v-card-title class="pa-0 postHeader" style="border-radius: 15px">
      <v-list-item
        disabled
        :two-line="post.name !== ''"
        selectable
        dense
      >
        <v-list-item-avatar left>
          <v-img
            :src="`https://forum.tezosagora.org${post.avatar_template}`.replace('{size}', '100')"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="subtitle-1">{{ post.username }}&nbsp;<span class="caption" v-if="post.moderator">[moderator]</span></v-list-item-title>
          <v-list-item-subtitle>
            <span class="body-2" v-if="post.name !== ''">{{ post.name }}</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text class="post-date">{{ post.created_at | formatTime }}</v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-card-title>
    <v-card-text class="mt-2 pr-0 pb-0">
      <div class="post" v-html="sanitizeHtml(content)" />
      <v-expansion-panels v-if="post.reply_count > 0" flat hover>
        <v-expansion-panel
          style="background-color:transparent;"
          class="px-0"
          @click="onHeaderClick"
        >
          <v-expansion-panel-header ripple>Replies ({{post.reply_count}})</v-expansion-panel-header>
          <v-expansion-panel-content class="px-0">
            <v-skeleton-loader :loading="loading" type="image">
              <span></span>
              <Post :post="reply" :agoraApi="agoraApi" v-for="(reply) in replies" :key="reply.id" />
            </v-skeleton-loader>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import sanitizeHtml from 'sanitize-html';

export default {
  name: "Post",
  props: {
    post: Object,
    agoraApi: Object,
  },
  computed: {
    content() {
      return this.post.cooked
        .replace(
          /<blockquote>\n/g,
          '<blockquote class="blockquote bcd-blockquote">'
        )
        .replace(/\n<\/blockquote>/g, "</blockquote>")
        .replace(
          /href="(\/u\/[a-zA-Z0-9_]*)"/gm,
          `href="https://forum.tezosagora.org$1"`
        )
        .replace(/(href="http[^"]*")/gm, `$1 target="_blank"`);
    },
  },
  data: () => ({
    loading: true,
    replies: [],
    loaded: false,
  }),
  methods: {
    ...mapActions(["showError"]),
    sanitizeHtml,
    getReplies() {
      if (!this.post || !this.post.reply_count) return;

      this.loading = true;
      this.agoraApi
        .getReplies(this.post.id)
        .then((res) => {
          this.replies = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loading = false;
          this.loaded = true;
        });
    },
    onHeaderClick() {
      if (!this.loaded) {
        this.getReplies();
      }
    },
  },
};
</script>

<style lang="scss">
.emoji {
  height: 14px;
}
.mention {
  text-decoration: none;
}
.bcd-blockquote {
  font-size: 0.9rem !important;
  border-left: 3px lightgray solid;
  margin-bottom: 15px;
}
.meta {
  display: none;
}
.post {
  font-size: 1rem;
  line-height: 1.6rem;
}
.post-date {
  font-size: 1rem;
}
.v-application--is-ltr .v-expansion-panel-header__icon {
  margin-left: 10px !important;
}
.v-expansion-panel-content__wrap {
  padding-right: 0;
  padding-bottom: 0;
}
</style>