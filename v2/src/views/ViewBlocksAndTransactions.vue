<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl">
                <v-tabs v-model="state.tab" color="primary" end>
                    <v-tab :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Blocks</v-tab>
                    <v-tab :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Transactions</v-tab>
                </v-tabs>
                <div class="mt-6">
                    <recent-blocks v-show="state.tab === routes[0]" :max-items="10" page-type="blocks" />
                    <module-txs v-show="state.tab === routes[1]" :max-items="10" page-type="txs" />
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import { onMounted, reactive } from 'vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { Q_BLOCKS_AND_TXS } from '@core/router/routesNames'
import { useRoute, useRouter } from 'vue-router'

const { columnPadding, rowMargin } = useAppViewGrid()

const routes = Q_BLOCKS_AND_TXS

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})

const state = reactive({
    tab: routes[0]
})

const router = useRouter()
const route = useRoute()
/**
 * Sets route query if new tab is selected
 */
const changeRoute = () => {
    if (route.query.t !== state.tab) {
        router.push({
            query: { t: state.tab }
        })
    }
}

onMounted(() => {
    state.tab = props.tab
})
</script>
