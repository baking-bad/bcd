<template>
  <div>
    <header class="d-flex mb-4">
      <h3 class="text--secondary font-weight-regular header-table">Constant Info</h3>
    </header>
    <v-fade-transition>
      <v-skeleton-loader :loading="loading" type="article" transition="fade-transition">
        <div class="ba-1 bg-database px-4 py-2 radius-1">
          <v-list-item
              class="pl-0"
              v-for="(field, pos) in contractInfoItems"
              :key="pos"
          >
            <v-list-item-content>
              <v-list-item-subtitle class="overline"
              >{{ field.label }}
              </v-list-item-subtitle
              >
              <v-list-item-title class="body-2">
                {{ field.type === 'timestamp' ? helpers.formatDatetime(field.value) : field.value }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-skeleton-loader>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: "ConstantInfo",
  props: {
    contractInfoItems: Array,
    loading: Boolean
  },
}
</script>