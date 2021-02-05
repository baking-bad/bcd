<template>
  <div>
    <TokenBriefInfo :token="token"/>
    <ReservedFields v-if="reservedFieldsData" class="mt-3" :token="reservedFieldsData"/>
    <OtherFields v-if="otherFieldsData" class="mt-3" :token="otherFieldsData"/>
  </div>
</template>
x
<script>
import TokenBriefInfo from "@/views/contract/TokensTab/Metadata/TokenBriefInfo";
import ReservedFields from "@/views/contract/TokensTab/Metadata/ReservedFields";
import OtherFields from "@/views/contract/TokensTab/Metadata/OtherFields";

const RESERVED_FIELDS = ['name', 'symbol', 'decimals'];

export default {
  name: "MetadataToken",
  components: {OtherFields, ReservedFields, TokenBriefInfo},
  props: {
    token: Object,
  },
  computed: {
    reservedFieldsData() {
      return this.token ?
          Object.fromEntries(Object.entries(this.token).filter(
              item => RESERVED_FIELDS.indexOf(item[0]) !== -1
          )) : null;
    },
    otherFieldsData() {
      return this.token ?
          Object.fromEntries(Object.entries(this.token).filter(
              item => RESERVED_FIELDS.indexOf(item[0]) === -1
          )) : null;
    }
  }
}
</script>
