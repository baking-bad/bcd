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
        <v-card-text class="pt-6 pb-0">
          <v-text-field
              v-model="name"
              hide-details
              label="Alias" 
              autofocus
              placeholder="Type here custom contract name" 
              >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="px-2 pt-0 pd-2 justify-end">
          <v-list-item v-if="name">
            <v-list-item-content>
              <v-list-item-subtitle>In bookmarks, will look like:</v-list-item-subtitle>
              <v-row class="pt-4 pl-3">
                <span class="title-span text--secondary">{{ name }}</span>
                <v-icon class="px-1 pd-2" color="primary" small>mdi-star</v-icon>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-btn class="px-2 pt-9" color="primary" text @click="add">Add bookmark</v-btn>
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
  .title{
    max-width: 350px;
  }
  .title-span {
    max-width: 310px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
