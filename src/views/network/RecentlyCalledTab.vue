<template>
    <RecentlyCalledContracts
        class="mt-4"
        hide-pagination-count
        :network="network"
        :items-per-page="10"
        :updateable="false"
        pageable
    />
</template>

<script>
import RecentlyCalledContracts from '../../components/Tables/RecentlyCalledContracts.vue'

export default {
    name: "RecentlyCalledTab",
    props: {
        network: String
    },
    components: {
        RecentlyCalledContracts
    }
}
</script>