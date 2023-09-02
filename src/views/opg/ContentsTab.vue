<template>
  <div>
    <v-skeleton-loader
      v-if="loading && operations.length === 0"
      :loading="loading"
      type="list-item-two-line, list-item-two-line, list-item-two-line"
    />
    <template v-else-if="!loading && operations.length > 0">
      <v-card
        flat
        outlined
        v-for="(op, idx) in operations"
        :key="idx"
        class="mb-8"
      >
        <InternalOperation :data="op" />
        <template v-for="(intop, intid) in op.internal_operations">
          <v-divider :key="'divider' + intid"></v-divider>
          <InternalOperation :data="intop" :mainOperation="op" :key="intid" />
        </template>
      </v-card>
    </template>
    <EmptyState
      v-else
      title="Nothing found"
      text="Can't find operation group by hash. Maybe the operation you are looking for is not yet in the mempool"
    />
  </div>
</template>

<script>
import InternalOperation from "@/components/InternalOperation.vue";
import EmptyState from "@/components/Cards/EmptyState.vue";

export default {
  name: "OpgContents",
  components: {
    InternalOperation,
    EmptyState,
  },
  props: {
    operations: Array,
    loading: Boolean,
  },
};
</script>
