<template>
  <div>
    <v-btn v-if="constants.length" class="mr-1 text--secondary" small text @click="openDialog">
      <v-icon class="mr-1" small>mdi-code-parentheses</v-icon>
      <span>USING CONSTANTS</span>
    </v-btn>
    <v-dialog v-model="openConstantsDialog" max-width="482" @keydown.esc="hide" persistent no-click-animation ref="constantDialog">
      <v-fade-transition>
        <v-skeleton-loader :loading="isLoading" type="article" class="global-constant-loader"
                           transition="fade-transition">
          <v-card flat outlined>
            <v-card-title class="sidebar d-flex justify-center py-2">
              <span class="body-1 font-weight-medium text-uppercase text--secondary">USING CONSTANTS</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click.stop="openConstantsDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pt-2 pb-2">
              <v-data-table
                  :items="constants"
                  hide-default-header
                  :class="['mt-1', 'hide-pagination-count']"
                  hide-default-footer
              >
                <template v-slot:item="{item}">
                  <tr class="table-row text-center" @click="navigate(item.address)">
                    <td>
                      <span class="text-center" v-past-html="helpers.shortcut(item.address, 16)"></span>
                    </td>
                  </tr>
                </template>
                <template v-slot:footer v-if="!hideFooter">
                  <div class="footer-pagination pt-2">
                    <v-btn icon @click="changePage(page - 1)" :disabled="page === 0">
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn icon @click="changePage(page + 1)" :disabled="isLastPage">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-fade-transition>
    </v-dialog>
  </div>
</template>

<script>
import {DATA_LOADING_STATUSES} from "@/utils/network";

export default {
  name: "UsingConstantsDialog",
  props: {
    network: String,
    address: String,
    itemsPerPage: {
      type: Number,
      default: 7,
    }
  },
  data: () => ({
    name: "",
    constants: [],
    page: 0,
    openConstantsDialog: false,
    isLastPage: true,
    hideFooter: true,
    loadingConstantsStatus: DATA_LOADING_STATUSES.SUCCESS,
  }),
  mounted() {
    this.init();
    document.addEventListener('keyup', this.handleKeyUp);
  },
  watch: {
    address() {
      this.init();
    }
  },
  computed: {
    isLoading() {
      return this.loadingConstantsStatus === DATA_LOADING_STATUSES.PROGRESS;
    },
  },
  destroyed() {
    document.addEventListener('keyup', this.handleKeyUp);
  },
  methods: {
    handleKeyUp(e) {
      if (e.key === "Escape"){
        this.hide();
      }
    },
    async init() {
      await this.getConstants();
      this.hideFooter = this.isLastPage;
    },
    navigate(address) {
      window.open(`/constant/${this.network}/${address}/`, '_blank')
      this.hide()
    },
    changePage(newPageNum) {
      this.page = newPageNum;
      this.getConstants();
    },
    hide() {
      this.openConstantsDialog = false
    },
    openDialog() {
      this.openConstantsDialog = true;
    },
    async getConstants() {
      this.loadingConstantsStatus = DATA_LOADING_STATUSES.PROGRESS;

      const offset = this.page * this.itemsPerPage;
      this.constants = await this.api.getConstantsByContract(this.network, this.address, offset, this.itemsPerPage);

      this.isLastPage = this.constants.length < this.itemsPerPage;

      this.loadingConstantsStatus = DATA_LOADING_STATUSES.SUCCESS;
    }
  }
}
</script>
<style scoped lang="scss">
.table-row {
  cursor: pointer;
}

.theme--dark.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: rgba(255, 255, 255, 0.08);
}

</style>