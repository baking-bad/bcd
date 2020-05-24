<template>
  <div class="fill-height canvas">
    <v-overlay :value="loading" v-if="loading" absolute color="data">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
    <v-container fluid v-else-if="contents.length > 0" class="pa-8">
      <template v-for="(op, idx) in contents">
        <v-card flat outlined :key="idx" class="mb-8">
          <InternalOperation :data="op" />
          <template v-for="(intop, intid) in op.internal_operations">
            <v-divider :key="'divider' + intid"></v-divider>
            <InternalOperation :data="intop" :mainOperation="op" :key="intid" />
          </template>
        </v-card>
      </template>
    </v-container>
    <ErrorState v-else></ErrorState>
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