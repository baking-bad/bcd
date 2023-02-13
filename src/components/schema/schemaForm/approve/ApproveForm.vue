<template>
    <div>
        <v-btn
            class="mr-2 pl-2 pr-2 text--secondary"
            text
            small
            @click="showTokenAddDialog = true"
          >
            <v-icon class="text--secondary" small>mdi-plus</v-icon>
            <span class="ml-1 text--secondary">Add</span>
        </v-btn>

        <v-list v-if="model.length > 0" class="mt-0 py-0" two-line tile color="transparent">
            <template v-for="(token, i) in model">
                <v-list-item class="py-2" :key="i" selectable @click="onEditToken(token)">
                    <v-list-item-avatar width="75" class="px-0 ml-0 mr-2">
                        <v-chip active-class="primary--text" disabled active small class="caption chip hash">{{ token.typeName }}</v-chip>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="hash">{{ token.value.tokenContract }}</span>
                            <span v-if="token.type == 2" class="caption hash" style="opacity: 0.5">&nbsp;with token id&nbsp;</span>
                            <span v-if="token.type == 2" class="hash">{{ token.value.tokenId }}</span>                        
                        </v-list-item-title>

                        <v-list-item-subtitle class="caption">
                            <span v-if="token.type == 1" class="hash">Allowance: {{ token.value.allowance }}</span>
                            <span v-else class="hash">Owner: {{ token.value.owner }}</span>
                        </v-list-item-subtitle>

                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon small @click.stop="onDeleteToken(i)">
                            <v-icon class="text--secondary">mdi-close</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
                <v-divider :key="'divider-' + i" v-if="i != model.length - 1"/>
            </template>
        </v-list>

        <TokenAddDialog 
            ref="tokenAddDialog"
            v-model="showTokenAddDialog"
            :network="network"
            @tokenAdded="onTokenAdded"
        />
    </div>
</template>

<script>
import TokenAddDialog from './TokenAddDialog.vue';
export default {
    name: "ApproveForm",
    props: {
        value: Array,
        network: String
    },
    components: {
        TokenAddDialog
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    data: () => {
        return {
            showTokenAddDialog: false
        }
    },
    methods: {
        onTokenAdded(event) {
            this.model.push(event);
        },
        onDeleteToken(tokenIdx) {
            this.model.splice(tokenIdx, 1);
        },
        onEditToken(token) {
            this.showTokenAddDialog = true;
            this.$nextTick(() => this.$refs.tokenAddDialog.edit(token));
        }
    }
}
</script>
