<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <recent-blocks :max-items="10" page-type="blocks" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'

onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
