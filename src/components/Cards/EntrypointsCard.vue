<template>
  <v-row>
    <v-col cols="6">
      <Schema v-if="executable" />
    </v-col>
    <v-col :cols="executable ? 6 : 12">
      <v-card flat outlined :style="`max-width:${cardMaxWidth >= 0 ? cardMaxWidth + 'px' : '100%'};`">
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
              <v-expansion-panel-content v-if="isImplementations">
                <ImplementationsList
                    v-for="(implementations, i) in item.implementations"
                    v-bind:key="`implementation${i}`"
                    :implementations="implementations"
                />
              </v-expansion-panel-content>
              <v-expansion-panel-content v-else>
                <TypeDef :typedef="item.typedef" first="parameter"/>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-navigation-drawer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import TypeDef from "@/views/contract/TypeDef";
import ImplementationsList from "@/components/Lists/ImplementationsList";
import Schema from "@/components/schema/Schema";

export default {
  name: "EntrypointsCard",
  components: {Schema, ImplementationsList, TypeDef},
  props: {
    entrypoints: Array,
    selectedOutside: Number,
    executable: Boolean,
    isImplementations: {
      type: Boolean,
      default: false,
    },
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
    }
  },
  created() {
    if (typeof this.selectedOutside === "number") {
      this.selected = this.selectedOutside
    }
  },
  data() {
    return {
      selected: null,
    }
  }
}
</script>