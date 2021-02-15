<template>
  <div class="fill-canvas canvas">
    <v-container fluid class="pa-8">
      <v-skeleton-loader
        v-if="loading && contents.length === 0"
        :loading="loading"
        type="list-item-two-line, list-item-two-line, list-item-two-line"
      />
      <template v-else-if="!loading && contents.length > 0">
        <v-card flat outlined v-for="(op, idx) in contents" :key="idx" class="mb-8">
          <InternalOperation :data="op" />
          <template v-for="(intop, intid) in op.internal_operations">
            <v-divider :key="'divider' + intid"></v-divider>
            <InternalOperation :data="intop" :mainOperation="op" :key="intid" />
          </template>
        </v-card>
      </template>
      <ErrorState v-else />
    </v-container>
  </div>
</template>

<script>
import InternalOperation from "@/components/InternalOperation.vue";
import ErrorState from "@/components/ErrorState.vue";

export default {
  name: "OpgContents",
  components: {
    InternalOperation,
    ErrorState
  },
  props: {
    operations: Array,
    loading: Boolean
  },
  computed: {
    contents() {
      let contents = [];
      if (this.operations) {
        this.operations.forEach(op => {
          if (op.internal) {
            contents[contents.length - 1].internal_operations.push(op);
          } else {
            op.internal_operations = [];
            contents.push(op);
          }
        });
      }
      return contents;
    }
  }
};
</script>