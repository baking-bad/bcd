<template>
  <div class="fill-height canvas">
    <SideNavigation :app="true" />
  </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";

export default {
  name: "Diff",
  components: {
    SideNavigation,
  },
};
</script>
