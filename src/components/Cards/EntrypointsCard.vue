<template>
  <v-card flat outlined :style="`max-width:${cardMaxWidth}px;`">
    <v-navigation-drawer floating permanent :style="`max-height: ${navigationMaxHeight}vh; width: 100%;`">
      <v-expansion-panels
          flat
          accordion
          mandatory
          active-class="entrypoint-selected"
          v-model="selected"
      >
        <v-expansion-panel
            v-for="(item, i) in entrypoints"
            :key="i"
            :class="i > 0 ? 'bt-1' : ''"
            class="entrypoint-panel"
        >
          <v-expansion-panel-header>
            <div class="d-flex">
              <span class="hash">{{ item.name }}</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <TypeDef :typedef="item.typedef" first="parameter"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import TypeDef from "@/views/contract/TypeDef";

export default {
  name: "EntrypointsCard",
  components: {TypeDef},
  props: {
    entrypoints: Array,
    selectedOutside: Number,
    cardMaxWidth: {
      type: Number,
      default: 500
    },
    navigationMaxHeight: {
      type: Number,
      default: 80,
    },
  },
  watch: {
    selectedOutside: {
      handler(newVal) {
        this.selected = newVal
      }
    },
    selected: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit('selected', newVal)
        }
      },
      deep: true,
      immediate: true,
    }
  },
  data() {
    return {
      selected: null,
    }
  }
}
</script>
