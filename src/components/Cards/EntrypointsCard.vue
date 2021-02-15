<template>
  <v-row>
    <v-col v-if="executable && selectedImplementation" cols="6">
      <SchemaImplementation
          :hidden-implementations-fields="hiddenImplementationsFields"
          :implementation="selectedImplementation"
      />
    </v-col>
    <v-col v-else-if="isOffChainEvents && selectedImplementation" cols="6">
      <EventsImplementation
          :implementation="selectedImplementation"
      />
    </v-col>
    <v-col :cols="executable || isOffChainEvents ? 6 : 12">
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
                    @selectImplementation="setSelectedImplementation"
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
import SchemaImplementation from "@/views/contract/MetadataTab/SchemaImplementation/SchemaImplementation";
import EventsImplementation from "@/views/opg/tabs/EventsTab/EventsImplementation/EventsImplementation";

export default {
  name: "EntrypointsCard",
  components: {EventsImplementation, SchemaImplementation, ImplementationsList, TypeDef},
  props: {
    entrypoints: Array,
    selectedOutside: Number,
    hiddenImplementationsFields: Array,
    executable: Boolean,
    isOffChainEvents: Boolean,
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
          this.setDefaultImplementation()
        }
      },
    }
  },
  created() {
    if (typeof this.selectedOutside === "number") {
      this.selected = this.selectedOutside
      this.setDefaultImplementation()
    }
  },
  methods: {
    setDefaultImplementation() {
      if (this.entrypoints[this.selected].implementations) {
        const firstImplementationsList = this.entrypoints[this.selected].implementations[0];
        const firstImplementationName = Object.keys(firstImplementationsList)[0];
        this.selectedImplementation = {
          implementationName: firstImplementationName,
          info: firstImplementationsList[firstImplementationName]
        }
      }
    },
    setSelectedImplementation(selectedImplementation) {
      this.selectedImplementation = selectedImplementation;
    }
  },
  data() {
    return {
      selected: null,
      selectedImplementation: null,
    }
  }
}
</script>
