<template>
  <v-card>
    <v-card-title
      class="body-2 secondary grey--text text--darken-3"
    >{{ diffs.name_a }} -> {{ diffs.name_b}}</v-card-title>
    <v-card-text class="px-0">
      <template v-for="(items, idx) in diffs.diff_a">
        <v-row :key="idx" no-gutters>
          <v-col cols="1" class="number">
            <span class="px-1" v-if="items.length > 0">{{ idx + 1 }}</span>
          </v-col>
          <v-col cols="5" class="px-2">
            <template v-for="(part, i) in items">
              <code
                :class="getPartStyle(part.type)"
                :key="i"
                v-text="part.chunk"
                v-if="part.type == 1 || part.type == -1"
              ></code>
              <code
                class="spaces"
                :key="i"
                v-text="part.chunk"
                v-else-if="part.type == 2 || part.type == -2"
              ></code>
              <span :class="getPartStyle(part.type)" :key="i" v-text="part.chunk" v-else></span>
            </template>
          </v-col>
          <v-col cols="1" class="number">
            <span class="px-1" v-if="diffs.diff_b[idx].length > 0">{{ idx + 1 }}</span>
          </v-col>
          <v-col cols="5" class="px-2">
            <template v-for="(part, i) in diffs.diff_b[idx]">
              <code
                :class="getPartStyle(part.type)"
                :key="i"
                v-text="part.chunk"
                v-if="part.type == 1 || part.type == -1"
              ></code>
              <code
                class="spaces"
                :key="i"
                v-text="part.chunk"
                v-else-if="part.type == 2 || part.type == -2"
              ></code>
              <span :class="getPartStyle(part.type)" :key="i" v-text="part.chunk" v-else></span>
            </template>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DiffViewer",
  props: {
    diffs: Object
  },
  data: () => ({
    left_rows: 0,
    right_rows: 0
  }),
  methods: {
    getPartStyle(type) {
      if (type == 1) return "added";
      else if (type == -1) return "removed";
      return "";
    }
  }
};
</script>

<style scoped>
.removed {
  color: #24292e;
  background-color: #ffeef0;
}

.added {
  color: #24292e;
  background-color: #e6ffed;
}
.number {
  color: rgba(27, 31, 35, 0.3);
  background-color: rgba(0, 0, 0, 0.02);
  max-width: 35px;
}
.spaces {
    background-color: #ffffff;
    box-shadow: none;
}
</style>