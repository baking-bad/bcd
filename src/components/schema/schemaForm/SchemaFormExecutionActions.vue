<template>
  <div class="d-flex align-center" @click="$emit('executeAction')">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            outlined
            :loading="execution"
            class="px-6"
            color="accent"
            v-bind="attrs"
            v-on="on"
            @click="$emit('executeClick')"
        >
          <span>Execute</span>
          <v-icon small class="ml-1">mdi-creation</v-icon>
        </v-btn>
      </template>
      <v-list v-if="executeActions">
        <template v-for="(item, index) in executeActions">
          <v-list-item :key="index" @click="item.callback()" v-if="item.callback">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
            <v-list-item-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "SchemaFormExecutionActions",
  props: {
    execution: Boolean,
    executeActions: Array,
  }
}
</script>
