<template>
    <GlobalConstantsRegistry
        class="mt-4"
        hide-pagination-count
        :network="network"
        :constantsNumber="constantsNumber"
        :items-per-page="10"
        :updateable="false"
        pageable
    />
</template>

<script>
import GlobalConstantsRegistry from '../../components/Tables/GlobalConstantsRegistry.vue'

export default {
    name: "ConstantsTab",
    components: {
        GlobalConstantsRegistry
    },
    props: {
        network: String,
        state: Object,
    },
    computed: {
        constantsNumber() {
            return this.state.stats ? this.state.stats.global_constants_count : 0;
        },
    },
}
</script>
