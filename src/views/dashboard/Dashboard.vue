<template>
  <div>
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container fluid class="py-0 my-0">
      <v-row no-gutters>
        <v-col cols="12" style="height: 64px;" class="d-flex align-end">
          <v-tabs background-color="transparent" slider-color="primary">
            <v-tab :to="{ name: 'timeline' }" replace class="overline">
              <v-icon left small>mdi-timeline-text-outline</v-icon>Timeline
            </v-tab>
            <v-tab :to="{ name: 'subscriptions' }" replace class="overline">
              <v-icon left small>mdi-content-duplicate</v-icon>Subscriptions
            </v-tab>
            <!-- <v-tab replace class="overline">
              <v-icon left small>mdi-poll</v-icon>Statistics
            </v-tab> -->
          </v-tabs>
        </v-col>
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