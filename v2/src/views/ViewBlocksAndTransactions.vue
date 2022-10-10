<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <!-- <v-tabs v-model="state.tab" color="primary" end>
                    <v-tab :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Blocks</v-tab>
                    <v-tab :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Transactions</v-tab>
                </v-tabs> -->
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs"></app-tabs>

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
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { onMounted, reactive } from 'vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { Q_BLOCKS_AND_TXS } from '@core/router/routesNames'
import { useRoute, useRouter } from 'vue-router'

const { columnPadding, rowMargin } = useAppViewGrid()

const routes = Q_BLOCKS_AND_TXS

const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'Blocks'
    },
    {
        value: routes[1],
        title: 'Transactions'
    }
]

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})

const state = reactive({
    tab: props.tab
})
</script>
