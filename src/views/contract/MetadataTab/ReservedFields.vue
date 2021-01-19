<template>
  <v-list>
    <v-subheader class="title">Reserved Fields</v-subheader>
    <v-list-item
        v-for="(field, idx) in metadata"
        :key="idx"
        selectable
    >
      <v-list-item-content class="pt-0 pb-0">
        <v-list-item-title class="d-flex">
          <span class="key-field">
            {{
              field.key
            }}:
          </span>
          <LicenseField
              class="value-field ml-3"
              v-if="field.key === 'license'"
              :value="field.value"
          />
          <AuthorsField
              class="value-field ml-3"
              v-else-if="field.key === 'authors'"
              :value="field.value"
          />
          <HomepageField
              class="value-field ml-3"
              v-else-if="field.key === 'homepage'"
              :value="field.value"
          />
          <InterfacesField
              class="value-field ml-3"
              v-else-if="field.key === 'interfaces'"
              :value="field.value"
            />
          <SourcesField
              class="value-field ml-3"
              v-else-if="field.key === 'source'"
              :value="field.value"
            />
          <ErrorsField
              class="value-field ml-3"
              v-else-if="field.key === 'errors'"
              :value="field.value"
          />
          <span v-else class="value-field ml-3">
            {{ field.value }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import AuthorsField from "@/views/contract/MetadataTab/CustomFields/AuthorsField";
import LicenseField from "@/views/contract/MetadataTab/CustomFields/LicenseField";
import HomepageField from "@/views/contract/MetadataTab/CustomFields/HomepageField";
import InterfacesField from "@/views/contract/MetadataTab/CustomFields/InterfacesField";
import SourcesField from "@/views/contract/MetadataTab/CustomFields/SourcesField";
import ErrorsField from "@/views/contract/MetadataTab/CustomFields/ErrorsField";

export default {
  name: "ReservedFields",
  components: {ErrorsField, SourcesField, InterfacesField, HomepageField, LicenseField, AuthorsField},
  props: {
    metadata: Array,
  },
}
</script>

<style lang="scss" scoped>
.v-list-item {
  min-height: 1.5rem;
  font-family: Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;
  .key-field,
  .value-field {
    font-size: 0.875rem;
  }
  .key-field {
    color: #9e9e9e;
  }
  .value-field {
    color: var(--v-anchor-base);
  }
}
</style>
