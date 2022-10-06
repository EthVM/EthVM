<template>
    <div :class="[xs ? 'adr-core-background-mobile' : 'adr-core-background']">
        <div class="mx-2 mx-sm-6 mx-xl-auto">
            <v-container class="px-0 pt-16">
                <div class="mt-16 pt-9 pl-11 pb-16 mb-16">
                    <p class="mt-9 text-white font-weight-light text-h1">Track, analyze and explore</p>
                    <p class="text-white font-weight-light text-h1">on the Ethereum blockchain.</p>
                    <div class="mb-12">
                        <module-search class="justify-start mt-5 mb-16" />
                    </div>
                </div>

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
            </v-container>
        </div>
    </div>
</template>

<script setup lang="ts">
// Components
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import ModuleSearch from '@module/search/ModuleSearch.vue'

import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { xs } = useDisplay()
const { columnPadding, rowMargin } = useAppViewGrid()
</script>

<style lang="scss" scoped>
.adr-core-background {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 544px, rgb(var(--v-theme-background)) 544px, rgb(var(--v-theme-background)) 100%);
}
.adr-core-background-mobile {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 150px, rgb(var(--v-theme-background)) 150px, rgb(var(--v-theme-background)) 100%);
}
</style>
