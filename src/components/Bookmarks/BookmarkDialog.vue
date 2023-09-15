<template>
    <v-dialog v-model="show" max-width="500" @keydown.esc="show = false" @keydown.enter="saveOnEnter" persistent>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center py-2">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">Your contract name</span>
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
        <v-card-actions class="justify-end px-5">
          <v-btn color="primary" text @click="add">Add bookmark</v-btn>
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