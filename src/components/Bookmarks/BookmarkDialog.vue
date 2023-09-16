<template>
    <v-dialog v-model="show" max-width="550" @keydown.esc="show = false" @keydown.enter="saveOnEnter" persistent>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center py-2">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Your bookmark name</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-3 pb-0">
          <v-text-field
              v-model="name"
              hide-details
              label="Alias" 
              autofocus
              placeholder="Type here custom contract name" 
              >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="pb-3 px-6 d-flex justify-space-between justify-end align-end">
          <div>
            <span class="text--disabled">In bookmarks, will look like:</span>
            <v-list-item v-if="name" class="item py-0 mt-1 px-3">
              <v-list-item-content class="pa-0">
                
                <v-list-item-title>{{ name }}</v-list-item-title>
                <v-list-item-subtitle class="overline">{{ network }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon color="primary">mdi-star</v-icon>
              </v-list-item-action>
            </v-list-item>
          </div>
          <v-btn class="d-flex justify-center" color="primary" text @click="add">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "BookmarkDialog",
    props: {
        value: Boolean,
        alias: String,
        network: String,
    },
    data: () => ({
        name: ""
    }),
    computed: {
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
        add() {
            this.$emit('added', this.name)
        },
        saveOnEnter() {
          this.add();
          this.show = false;
        }
    },
    watch: {
        show(newValue){
            if (newValue) {
                this.name = this.alias;
            }
        }
    }
}
</script>

<style scoped>
  .item-text {
    max-width: 315px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item {
    max-width: 380px !important;
    background-color: var(--v-data-base) !important;
  }
</style>
