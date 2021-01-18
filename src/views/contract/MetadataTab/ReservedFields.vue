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
          <span>
            {{
              field.key
            }}:
          </span>
          <LicenseField
              class="grey--text ml-3"
              v-if="field.key === 'license'"
              :value="field.value"
          />
          <AuthorsField
              class="grey--text ml-3"
              v-else-if="field.key === 'authors'"
              :value="field.value"
          />
          <HomepageField
              class="grey--text ml-3"
              v-else-if="field.key === 'homepage'"
              :value="field.value"
          />
          <InterfacesField
              class="grey--text ml-3"
              v-else-if="field.key === 'interfaces'"
              :value="field.value"
            />
          <span v-else class="grey--text ml-3">
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

export default {
  name: "ReservedFields",
  components: {InterfacesField, HomepageField, LicenseField, AuthorsField},
  props: {
    metadata: Array,
  },
}
</script>
