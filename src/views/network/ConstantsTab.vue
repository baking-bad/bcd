<template>
    <GlobalConstantsRegistry
        class="mt-4"
        hide-pagination-count
        :network="network"
        :items-per-page="10"
        :updateable="false"
        pageable
    />
</template>

<script>
import GlobalConstantsRegistry from '../../components/Tables/GlobalConstantsRegistry.vue'

export default {
    name: "ConstantsTab",
    props: {
        network: String
    },
    components: {
        GlobalConstantsRegistry
    }
}
</script>