<template>
  <div class="pb-6">
    <Michelson />
    <SchemaFormExecutionActions
        class="pl-4 pr-6"
        @executionClick="$emit('implementForm')"
    />
  </div>
</template>

<script>
import SchemaFormExecutionActions from "@/components/schema/schemaForm/SchemaFormExecutionActions";
import Michelson from "@/components/Michelson";

export default {
name: "EventsImplementationForm",
  components: {Michelson, SchemaFormExecutionActions}
}
</script>
