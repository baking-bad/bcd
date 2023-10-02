<template>
    <RecentlyCalledContracts
        class="mt-4"
        hide-pagination-count
        :network="network"
        :contractsNumber="contractsNumber"
        :items-per-page="10"
        pageable
    />
</template>

<script>
import RecentlyCalledContracts from '../../components/Tables/RecentlyCalledContracts.vue'

export default {
    name: "RecentlyCalledTab",
    components: {
        RecentlyCalledContracts
    },
    props: {
        network: String,
        state: Object,
    },
    computed: {
        contractsNumber() {
            return this.state.stats ? this.state.stats.contracts_count : 0;
        },
    },
}
</script>
