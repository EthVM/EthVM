<template>
    <block-stats-module />
    <recent-blocks :max-items="10" page-type="blocks" />
</template>

<script setup lang="ts">
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
</script>
