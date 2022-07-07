<template>
  <v-expansion-panel
    class="bl-1 br-1 bt-1 op-panel"
    active-class="op-active-panel"
    @change="onPanelStateChange"
  >
    <v-expansion-panel-header
      class="py-0 px-4"
      ripple
      :class="statusHeaderClass"
      :title="value.status"
    >
      <template v-slot:default="{ open }">
        <v-row no-gutters class="py-1">
          <v-col cols="2">
            <v-list-item class="fill-height pa-0">
              <v-list-item-content>
                <v-list-item-title class="hash">{{
                  helpers.formatDatetime(value.timestamp, {
                    val: 15,
                    unit: "minute"
                  })
                }}</v-list-item-title>
                <v-list-item-subtitle
                  class="font-weight-light hash text--secondary"
                >
                  <span v-if="value.mempool">mempool</span>
                  <span v-else>level {{ value.level }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="2">
            <v-list-item class="fill-height pa-0">
              <v-list-item-content>
                <v-list-item-title class="hash">
                  <span v-if="open">{{ value.kind }}</span>
                  <span
                    v-else
                    :class="
                      text === value.kind ? 'accent--text' : 'secondary--text'
                    "
                    >{{ text }}</span
                  >
                </v-list-item-title>
                <v-list-item-subtitle
                  class="font-weight-light hash text--secondary"
                  v-if="value && !value.mempool && !isNaN(value.internals) && value.internals > 0">{{value.internals}} internal</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="2">
            <v-list-item
              class="fill-height pl-1"
              v-if="!open && !value.mempool && !isNaN(value.flow) && value.flow !== 0"
            >
              <v-list-item-content>
                <v-list-item-title class="hash">{{
                  value.flow | uxtz
                }}</v-list-item-title>
                <v-list-item-subtitle
                  class="font-weight-light hash text--secondary"
                >
                  <span v-if="value.flow > 0">locked</span>
                  <span v-else>withdrawn</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="2">
            <v-list-item class="fill-height pl-2" v-if="value && !value.mempool && !isNaN(value.total_cost) ">
              <v-list-item-content>
                <v-list-item-title class="hash">{{
                  value.total_cost | uxtz
                }}</v-list-item-title>
                <v-list-item-subtitle
                  class="font-weight-light hash text--secondary"
                  >total cost</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4">
            <v-list-item class="fill-height pl-3">
              <v-list-item-content>
                <v-list-item-title>
                  <Shortcut :str="value.hash" v-if="value.hash"/>
                </v-list-item-title>
                <v-list-item-subtitle v-if="value.content_index !== undefined"
                  class="font-weight-light hash text--secondary"
                  >content #{{ value.content_index }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="opg-content">
      <v-progress-linear v-if="loading" indeterminate color="primary"/>
      <div v-else v-for="(item, idx) in internal" :key="idx">
        <v-divider></v-divider>
        <InternalOperation
          :data="item"
          :mainOperation="internal[0]"
          :address="address"          
        />
      </div>      
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapActions } from "vuex";
import InternalOperation from "@/components/InternalOperation.vue";
import Shortcut from "@/components/Shortcut.vue";
import { getContentItemHeaderClass } from '@/utils/styles';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default {
  name: "ContentItem",
  props: {
    data: Object,
    address: String,
    network: String,
  },
  components: {
    InternalOperation,
    Shortcut,
  },
  created() {
    this.value = Object.assign({}, this.data);
  },
  computed: {
    text() {
      if (this.value == null) return "";
      if (this.value.entrypoint) {
        return this.value.entrypoint;
      }
      return this.value.kind;
    },
    statusHeaderClass() {
      return getContentItemHeaderClass(this.value.status);
    },
  },
  data: () => ({
    value: null,
    internal: [],
    loading: false
  }),
  methods: {
    ...mapActions(["showError"]),
    onPanelStateChange() {
      if (!this.value) return;
      if (this.value.mempool) this.internal = [Object.assign({}, this.value)];
      if (this.internal.length > 0) return;
      if (this.loading) return;

      this.loading = true;

      if (this.value.hash){
        this.api.
          getOperationsByHashAndCounter(this.value.hash, this.value.counter, this.network)
          .then(res => {
            this.internal = res;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.loading = false;
          })
      } else {
        this.api.
          getImplicitOperation(this.network, this.value.counter)
          .then(res => {
            this.internal = res;
          })
          .catch(err => {
            console.log(err);
            this.showError(err);
          })
          .finally(() => {
            this.loading = false;
          })
      }
    }
  },
};
</script>

<style>
.opg-content > .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>

<style lang="scss" scoped>
.op-panel {
  background-color: var(--v-data-base) !important;
}

.op-active-panel > .v-expansion-panel-header {
  opacity: 0.8;
  background-color: var(--v-border-base) !important;
}

.op-active-panel,
.op-panel.v-expansion-panel--next-active {
  border-bottom: 1px solid var(--v-border-base);
}
</style>
