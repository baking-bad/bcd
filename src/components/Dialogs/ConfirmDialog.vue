<template>
  <v-dialog
      v-model="show"
      :max-width="400"
      @keydown.esc="close"
      ref="confirmDialog"
      persistent
  >
    <v-card outlined>
      <v-card-title class="sidebar d-flex justify-center py-1 pa-2">
        <v-icon small color="orange">mdi-alert</v-icon>
        <span class="body-1 ml-2 font-weight-medium text-uppercase text--secondary">Warning</span>
        <v-spacer></v-spacer>
        <v-btn icon small @click.stop="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text
          class="pa-4 text--primary"
      >The networks of the active wallet and the current contract do not match.
      </v-card-text>
      <v-card-actions class="pt-3 justify-space-between px-5">
        <v-btn
            color="error"
            text
            @click.native="cancel"
        >Continue anyway
        </v-btn>
        <v-btn color="primary" text @click.native="agree">Change wallet</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    value: Boolean
  },
  computed: {
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
  },
  data() {
    return {
    };
  },
  updated() {
      if (this.show) {
          this.$refs.confirmDialog.show();
      }
  },
  methods: {
    open() {
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.show = false;
    },
    cancel() {
      this.resolve(false);
      this.show = false;
    },
    close() {
      this.reject();
      this.show = false;
    },
  },
};
</script>