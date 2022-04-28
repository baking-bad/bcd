<template>
  <v-list class="ma-0 data">
    <h2 class="ml-4 my-4 text--secondary d-flex align-center">
      <span class="font-weight-regular">TZIP-16</span>
      <v-btn small icon class="ml-1 text--disabled" href="https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-16/tzip-16.md" target="_blank" rel="noopener">
        <v-icon small>mdi-file-document-outline</v-icon>
      </v-btn>
    </h2>
    <v-list-item
        v-for="(field, idx) in metadata"
        :key="idx"
        selectable
    >
      <v-list-item-content class="pt-0">
        <v-row no-gutters>
          <v-col cols="2">
            <span class="key-field">
            {{
              field.key
            }}:
          </span>
          </v-col>
          <v-col>
          <LicenseField
              class="value-field"
              v-if="field.key === 'license'"
              :value="field.value"
          />
          <AuthorsField
              class="value-field"
              v-else-if="field.key === 'authors'"
              :value="field.value"
          />
          <SourcesField
              class="value-field"
              v-else-if="field.key === 'source'"
              :value="field.value"
            />
          <ErrorsField
              class="value-field"
              v-else-if="field.key === 'errors'"
              :value="field.value"
          />
          <span v-else class="value-field">
            {{ field.value }}
          </span>
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import AuthorsField from "@/views/contract/MetadataTab/CustomFields/AuthorsField";
import LicenseField from "@/views/contract/MetadataTab/CustomFields/LicenseField";
import SourcesField from "@/views/contract/MetadataTab/CustomFields/SourcesField";
import ErrorsField from "@/views/contract/MetadataTab/CustomFields/ErrorsField";

export default {
  name: "ReservedFields",
  components: {ErrorsField, SourcesField, LicenseField, AuthorsField},
  props: {
    metadata: Array,
  },
}
</script>

<style lang="scss" scoped>
.v-list-item {
  min-height: 1.25rem;
  font-family: Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;
  .key-field {
    color: #9e9e9e;
    line-height: 1.2rem;
  }
  .value-field {
    white-space: normal;
    color: var(--v-tree-base);
    line-height: 1.2rem;
  }
}
</style>
