<template>
  <div>
    <header class="d-flex mb-4">
      <h3 class="text--secondary font-weight-regular header-table">Constant Info</h3>
    </header>
    <v-fade-transition>
      <v-skeleton-loader :loading="loading" type="article" transition="fade-transition">
        <div class="ba-1 bg-database px-4 py-2 radius-1">
          <v-list-item
              class="pl-0"
              v-for="(field, pos) in contractInfoItems"
              :key="pos"
          >
            <v-list-item-content>
              <v-list-item-subtitle class="overline"
              >{{ field.label }}
              </v-list-item-subtitle>
              <v-list-item-title class="body-2" v-if="field.type !== 'address'">
                {{ field.type === 'timestamp' ? helpers.formatDatetime(field.value) : field.value }}
              </v-list-item-title>
              <v-list-item-title class="body-2" v-else>
                <span v-past-html="helpers.shortcut(field.value, 12)" class="mr-3"></span>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-on="on" v-bind="attrs">
                      <v-icon class="text--secondary" @click="copyAddress(field.value)" small>mdi-content-copy</v-icon>
                    </span>
                  </template>
                  <span>Copy address</span>
                </v-tooltip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-skeleton-loader>
    </v-fade-transition>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ConstantInfo",
  props: {
    contractInfoItems: Array,
    loading: Boolean
  },
  methods: {
    ...mapActions({
      showClipboardOK: "showClipboardOK",
    }),
    copyAddress(address) {
      this.$clipboard(address);
      this.showClipboardOK();
    }
  }
}
</script>