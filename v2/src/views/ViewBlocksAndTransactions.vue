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
                <v-window v-model="state.tab" class="mt-6">
                    <v-window-item :value="routes[0]" :key="routes[0]">
                        <recent-blocks :max-items="10" page-type="blocks" />
                    </v-window-item>
                    <v-window-item :value="routes[1]" :key="routes[1]">
                        <module-txs :max-items="10" page-type="txs" />
                    </v-window-item>
                </v-window>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import { reactive } from 'vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { ALL_BLOCKS_TAB } from '@core/router/routesNames'
import { useRoute, useRouter } from 'vue-router'

const { columnPadding, rowMargin } = useAppViewGrid()

const routes = ALL_BLOCKS_TAB

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})

const state = reactive({
    tab: props.tab
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
</script>
