<template>
    <div>
        <div class="not-found px-2 px-sm-6 mx-xl-auto mt-n16 pt-16">
            <v-container :class="[{ 'top-card-md': md }, { 'top-card-xs': smAndDown }, 'px-7 px-lg-12 pt-0 pb-16']">
                <v-row align="center" justify="space-between">
                    <div class="ml-lg-16 pl-lg-14">
                        <p class="mt-16 text-white font-weight-light text-h3 text-sm-h2 text-md-h1 text-center text-lg-left">Track, analyze and explore</p>
                        <p class="text-white font-weight-light text-h3 text-sm-h2 text-md-h1 text-center text-lg-left">on the Ethereum blockchain.</p>
                        <div class="ml-1">
                            <module-search class="justify-center justify-lg-start mt-5" />
                        </div>
                    </div>
                    <v-img :src="require('@/assets/hero/hero-group.png')" alt="" height="542" width="542" max-height="542" max-width="542" contain />
                </v-row>
            </v-container>
        </div>
        <div class="mx-2 mx-sm-6 mx-xl-auto">
            <v-container class="pt-3 px-0">
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
import ModuleSearch from '@/modules/search/ModuleAppSearch.vue'

import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { smAndDown, lgAndUp, md } = useDisplay()
const { columnPadding, rowMargin } = useAppViewGrid()
</script>

<style lang="scss" scoped>
.adr-core-background {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 544px, rgb(var(--v-theme-background)) 544px, rgb(var(--v-theme-background)) 100%);
}
.adr-core-background-mobile {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 466px, rgb(var(--v-theme-background)) 466px, rgb(var(--v-theme-background)) 100%);
}

.top-card-lg {
    margin-top: 164px;
}

.top-card-md {
    margin-bottom: 84px;
    margin-top: 205px;
}

.top-card-xs {
    margin-bottom: 84px;
    margin-top: 205px;
}

.not-found {
    background: url('/src/assets/background-nebula.png');
    background-size: cover;
    background-attachment: fixed;
    background-position: right 35% center;
    height: 100%;
    width: 100;
}
</style>
