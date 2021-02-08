<template>
  <v-list class="pb-0" v-scroll="onScroll">
    <v-subheader class="title">Holders</v-subheader>
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
                <span :title="holder_address">{{ holder_address }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="6">
          <v-list-item class="fill-height pa-0">
            <v-list-item-content>
              <v-list-item-title
                  class="font-weight-light hash text--secondary text-center"
              >
                <span :title="holders[holder_address]">{{ holders[holder_address] }} {{token}}</span>
              </v-list-item-title>
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
export default {
  name: "HoldersInfo",
  components: {ScrollBackToTop},
  props: {
    holders: Object,
    token: String,
  },
  computed: {
    holdersToShow() {
      return Object.keys(this.holders).slice(0, this.shownAmount);
    }
  },
  methods: {
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
