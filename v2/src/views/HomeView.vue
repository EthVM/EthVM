<template>
    <v-row>
        <v-col cols="12">
            <block-stats-module />
        </v-col>
        <v-col cols="12">
            <recent-blocks :max-items="10" page-type="home" />
        </v-col>
        <v-col cols="12">
            <module-txs :max-items="10" page-type="home" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
// Components
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
</script>
