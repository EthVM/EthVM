<template>
    <v-row>
        <v-col cols="12">
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
</script>
