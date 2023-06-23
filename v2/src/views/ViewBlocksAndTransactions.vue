<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" class="mx-n1 mt-n2 mb-4"></app-tabs>

                <recent-blocks v-show="state.tab === routes[0]" :max-items="10" page-type="blocks" />
                <module-txs v-show="state.tab === routes[1]" :max-items="10" page-type="txs" />
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()

const routes = Q_BLOCKS_AND_TXS

const tabs: Tab[] = [
    {
        value: routes[0],
        title: t('common.block', 2)
    },
    {
        value: routes[1],
        title: t('txs.name', 2)
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
