<template>
  <div>
    <header class="d-flex mb-4">
      <h3 class="text--secondary font-weight-regular header-table">Referenced contracts</h3>
    </header>
    <v-fade-transition>
      <v-skeleton-loader :loading="loading" type="article" transition="fade-transition">
        <v-list-item-group
            v-if="contracts.length || loading"
            class="themed-border radius-1"
            mandatory
        >
          <template v-for="(item, i) in contracts">
            <v-list-item inactive class="token-card" :key="'entrypoint-' + i">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn
                      class="text--secondary hash"
                      :to="`/${item.network}/${item.address}/`"
                      style="text-transform: none;"
                      target="_blank"
                      text>
                <span v-if="item.alias">
                          {{
                    item.alias.length > aliasMaxLength
                        ? item.alias.slice(0, aliasMaxLength).trim()
                        : item.alias
                  }}<em
                    v-if="item.alias.length > aliasMaxLength"
                    class="v-icon notranslate mdi mdi-dots-horizontal"
                    style="font-size: 16px;"
                />
                        </span>
                    <span v-else v-past-html="helpers.shortcut(item.address, 8)"></span>
                  </v-btn>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
        <div v-else class="ba-1 bg-database px-4 py-2 mt-4 radius-1">
          No references to contracts
        </div>
      </v-skeleton-loader>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: "ReferenceContract",
  props: {
    contractInfoItems: Array
  },
  data() {
    return {
      loading: true,
      aliasMaxLength: 28,
      contracts: [],
    }
  },
  async mounted() {
    this.loading = true;

    this.contracts = await this.api.getConstantsByAddress(this.$route.params.network, this.$route.params.address);

    this.loading = false;
  }
}
</script>