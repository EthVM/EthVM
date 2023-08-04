<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <block-stats-module />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <module-txs :max-items="10" page-type="txs" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'
import { VIEW_TAGS } from '@core/helper/tags'
import { usePageMeta } from '@core/composables/use-page-meta/use-page-meta.composable'

usePageMeta(null, VIEW_TAGS.TXS)

const { columnPadding, rowMargin } = useAppViewGrid()
onMounted(() => {
    window.scrollTo(0, 0)
})
</script>
