<template>
    <v-card>
        
    </v-card>
</template>

<script>
export default {
    name: "AccountCard",
    props: {
        item: Object
    },
    data: () => ({
        loading: false,
        info: {}
    }),
    created() {
        this.getAccountInfo();
    },
    methods: {
        getAccountInfo() {
            if (this.loading) return;
            this.loading = true;

            this.api.getAccountInfo(this.item.body.Network, this.item.body.Address)
            .then(account => {
                this.info = account;
            })
            .catch(err => console.log(err))
            .finally(() => this.loading = false);
        },
    }
}
</script>