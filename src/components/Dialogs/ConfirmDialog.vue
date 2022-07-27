<template>
  <v-dialog
      v-model="dialog"
      :max-width="options.width"
      :style="{ zIndex: options.zIndex }"
      @keydown.esc="cancel"
  >
    <v-card outlined>
      <v-toolbar v-if="title" dark :color="options.color" dense flat>
        <v-toolbar-title class="body-1 font-weight-medium text-uppercase text--secondary">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text
          v-show="!!message"
          class="pa-4 text--primary"
      >{{ message }}

        <v-btn
            x-small
            v-if="!options.noconfirm"
            color="primary"
            @click.native="changeWallet"
        >Change wallet
        </v-btn>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
            v-if="!options.noconfirm"
            color="primary"
            @click.native="cancel"
        >{{ cancelBtn }}
        </v-btn
        >
        <v-btn color="primary" text @click.native="agree">{{ okBtn }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {Wallet} from "@/utils/wallet";

export default {
  name: "ConfirmDialog",
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      okBtn: 'OK',
      cancelBtn: 'Cancel',
      title: null,
      options: {
        width: 400,
        zIndex: 200,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(title, message, {ok = 'OK', cancel = 'Cancel'}, options) {
      this.dialog = true;
      this.title = title;
      this.okBtn = ok;
      this.cancelBtn = cancel;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    async changeWallet() {
      await Wallet.getClient(
          this.$route.params.network || this.$route.$query.network || 'main',
          [],
          false
      );
      this.resolve(true);
      this.dialog = false;
    }
  },
};
</script>