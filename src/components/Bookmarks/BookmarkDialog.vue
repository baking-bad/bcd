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
        <v-card-actions class="pb-3 px-6 d-flex justify-end align-end">
          <v-list-item v-if="name" class="pa-0">
            <v-list-item-content class="py-1">
              <v-list-item-subtitle class="text--disabled">In bookmarks, will look like:</v-list-item-subtitle>
              <v-row class="ma-0">
                <span class="title-span text--secondary">{{ name }}</span>
                <v-icon class="px-2" color="primary" small>mdi-star</v-icon>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-btn class="px-2" color="primary" text @click="add">Add bookmark</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "BookmarkDialog",
    props: {
        value: Boolean,
        alias: String
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
  .title-span {
    max-width: 315px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
