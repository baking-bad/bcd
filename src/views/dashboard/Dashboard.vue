<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-toolbar flat class="dashboard-toolbar">
      <v-tabs
        class="ml-4"
        center-active
        background-color="transparent"
        slider-color="primary"
        v-if="contract"
      >
        <v-tab :to="{ name: 'subscriptions' }" replace class="overline">
          <v-icon left small>mdi-content-duplicate</v-icon>
          Subscriptions
        </v-tab>
      </v-tabs>
      <div class="mr-4">
        <ExpandableSearch></ExpandableSearch>
      </div>
    </v-toolbar>
    <v-container fluid class="py-0 my-0">
      <v-row no-gutters>
        <v-col cols="12">
          <v-slide-x-reverse-transition mode="out-in">
            <router-view/>
          </v-slide-x-reverse-transition>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data: () => ({
    loading: false
  })
};
</script>

<style>
.dashboard-toolbar > .v-toolbar__content {
  border-bottom: 1px solid #ddd;
  background-color: rgb(250, 250, 250);
  padding: 0 10px;
}
</style>