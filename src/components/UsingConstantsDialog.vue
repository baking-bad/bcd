<template>
    <v-dialog v-model="show" max-width="482" @keydown.esc="show = false" @keydown.enter="saveOnEnter" persistent>
      <v-card flat outlined>
        <v-card-title class="sidebar d-flex justify-center py-2">
          <span class="body-1 font-weight-medium text-uppercase text--secondary">USING CONSTANTS</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-6 pb-6">
          <v-data-table
              :items="constants"
              hide-default-header
              :class="['ba-1 mt-4 avg-gas-consumption', 'hide-pagination-count']"
              hide-default-footer
          >
            <template v-slot:item="{item}">
              <tr class="table-row">
                <td>
                  <v-btn
                      @click="navigate(item.address)"
                      target="_blank"
                      class="text--secondary hash"
                      style="text-transform: none;"
                      text>
                    <span v-past-html="helpers.shortcut(item.address, 16)"></span>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "UsingConstantsDialog",
    props: {
        value: Boolean,
        constants: Array,
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
      navigate(address) {
        window.open(`/constant/${this.network}/${address}/`, '_blank')
      }
    }
}
</script>