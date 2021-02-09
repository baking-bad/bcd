<template>
  <v-list class="pb-0" v-scroll="onScroll">
    <v-subheader class="title">{{ holdersTitle }}</v-subheader>
    <div class="bt-1 mt-1">
      <v-row
          v-for="holder_address in holdersToShow"
          v-bind:key="holder_address"
          no-gutters
          class="py-1 bb-1 holders-row"
      >
        <v-col cols="6">
          <v-list-item class="fill-height pl-4">
            <v-list-item-content>
              <v-list-item-title
                  class="font-weight-light hash"
              >
                <AccountBox
                    :address="holder_address"
                    :network="network"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="6">
          <v-list-item class="fill-height pa-0">
            <v-list-item-content class="flex-nowrap">
              <v-row>
                <v-col cols="6" class="pr-2 text-align-end">
                  <span :title="holders[holder_address]">{{ getHolderAmount(holders[holder_address]) }}</span>
                </v-col>
                <v-col cols="6" class="pl-0">
                  <span class="caption text-uppercase font-weight-regular text--disabled"> {{token}}</span>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </div>
    <ScrollBackToTop />
  </v-list>
</template>

<script>
import ScrollBackToTop from "@/components/Buttons/ScrollBackToTop";
import AccountBox from "@/components/AccountBox";

export default {
  name: "HoldersInfo",
  components: {AccountBox, ScrollBackToTop},
  props: {
    holders: Object,
    token: String,
    network: String,
    decimals: Number,
  },
  computed: {
    holdersTitle() {
      const holdersAmount = Object.keys(this.holders).length;
      return `Holders (${holdersAmount})`;
    },
    holdersToShow() {
      return Object.keys(this.holders).slice(0, this.shownAmount);
    }
  },
  methods: {
    getHolderAmount(amount) {
      return amount / Math.pow(10, this.decimals);
    },
    onScroll() {
      const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      const isLeftHolders = Object.keys(this.holders).length > this.shownAmount;
      if (isBottom && isLeftHolders) {
        this.shownAmount += 10;
      }
    }
  },
  data() {
    return {
      shownAmount: 10,
    }
  }
}
</script>

<style lang="scss" scoped>
.holders-row {
  &:last-child {
    border-bottom: none !important;
  }
}
</style>
