<template>
  <v-dialog
      v-model="dialog"
      :max-width="options.width"
      :style="{ zIndex: options.zIndex }"
      @keydown.esc="cancel"
  >
    <v-card outlined>
      <v-card-title class="sidebar d-flex justify-end py-1 pa-2">
        <v-btn icon small @click.stop="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text
          v-show="!!message"
          class="pa-4 text--primary"
      >{{ message }}
      </v-card-text>
      <v-card-actions class="pt-3 justify-space-between">
        <v-btn
            v-if="!options.noconfirm"
            color="error"
            text
            @click.native="cancel"
        >{{ cancelBtn }}
        </v-btn>
        <v-btn color="primary" text @click.native="agree">{{ okBtn }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
  },
};
</script>