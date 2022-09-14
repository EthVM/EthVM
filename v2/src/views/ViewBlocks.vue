<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12">
            <recent-blocks :max-items="10" page-type="blocks" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
