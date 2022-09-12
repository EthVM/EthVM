<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <recent-blocks :max-items="10" page-type="home" />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <module-txs :max-items="10" page-type="home" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
// Components
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
